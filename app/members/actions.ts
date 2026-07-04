'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

export interface MemberLoginState {
  error?: string
}

export async function memberLoginAction(
  prevState: MemberLoginState | null,
  formData: FormData
): Promise<MemberLoginState> {
  const password = formData.get('password') as string
  const siteConfig = await prisma.siteConfig.findUnique({ where: { id: 1 } })
  const secret = siteConfig?.memberSecret

  if (!secret) return { error: 'Member access is not configured on this server.' }

  if (password === secret) {
    const cookieStore = await cookies()
    cookieStore.set('member_auth', secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8,
      path: '/',
      sameSite: 'strict',
    })
    redirect('/members')
  }

  return { error: 'Incorrect password.' }
}

export async function memberLogoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('member_auth')
  redirect('/members')
}
