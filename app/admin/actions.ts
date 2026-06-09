'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export interface LoginState {
  error?: string
  success?: boolean
}

export async function loginAction(
  prevState: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const password = formData.get('password') as string
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret) return { error: 'Admin access is not configured on this server.' }

  if (password === adminSecret) {
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', adminSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
      sameSite: 'strict',
    })
    return { success: true }
  }

  return { error: 'Incorrect password.' }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_auth')
  redirect('/admin')
}
