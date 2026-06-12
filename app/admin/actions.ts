'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'

export interface LoginState {
  error?: string
  success?: boolean
}

async function verifyAdmin() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  if (!process.env.ADMIN_SECRET || auth?.value !== process.env.ADMIN_SECRET) {
    throw new Error('Unauthorized')
  }
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

export async function deleteRegistrationAction(id: string): Promise<void> {
  await verifyAdmin()
  await prisma.registration.delete({ where: { id } })
  revalidatePath('/admin')
}

export async function updateRegistrationAction(
  id: string,
  data: {
    name: string
    email: string | null
    phone: string | null
    memberCount: number
    guestCount: number
  }
): Promise<void> {
  await verifyAdmin()
  await prisma.registration.update({ where: { id }, data })
  revalidatePath('/admin')
}

export async function updateEventConfigAction(
  eventId: string,
  data: {
    artist: string | null
    isoDate: string | null
    genre: string | null
    genreFr: string | null
    tbd: boolean
    maxCapacity: number | null
  }
): Promise<void> {
  await verifyAdmin()
  await prisma.eventConfig.upsert({
    where: { eventId },
    create: { eventId, ...data },
    update: { ...data },
  })
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath(`/register/${eventId}`)
}

export async function resetEventConfigAction(eventId: string): Promise<void> {
  await verifyAdmin()
  await prisma.eventConfig.deleteMany({ where: { eventId } })
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath(`/register/${eventId}`)
}
