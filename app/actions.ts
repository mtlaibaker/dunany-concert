'use server'

import { prisma } from '@/lib/db'
import { getEventById } from '@/lib/events'
import { revalidatePath } from 'next/cache'

export interface RegisterState {
  error?: string
  success?: boolean
}

export async function registerAction(
  prevState: RegisterState | null,
  formData: FormData
): Promise<RegisterState> {
  const eventId = formData.get('eventId') as string
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim() || null
  const phone = (formData.get('phone') as string)?.trim() || null
  const isMember = formData.get('isMember') === 'true'

  if (!name) return { error: 'Full name is required.' }
  if (!email && !phone) return { error: 'Please provide at least one contact method (email or phone).' }

  const event = getEventById(eventId)
  if (!event) return { error: 'Invalid event.' }

  try {
    await prisma.registration.create({
      data: { eventId, name, email, phone, isMember },
    })
    revalidatePath('/')
    revalidatePath(`/register/${eventId}`)
    return { success: true }
  } catch {
    return { error: 'Registration failed. Please try again.' }
  }
}
