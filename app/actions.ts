'use server'

import { prisma } from '@/lib/db'
import { getMergedEvent } from '@/lib/eventConfig'
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
  const memberCount = parseInt(formData.get('memberCount') as string) || 0
  const guestCount = parseInt(formData.get('guestCount') as string) || 0

  if (!name) return { error: 'nameRequired' }
  if (!email && !phone) return { error: 'contactRequired' }
  if (memberCount + guestCount === 0) return { error: 'ticketRequired' }
  if (memberCount < 0 || memberCount > 10 || guestCount < 0 || guestCount > 10) return { error: 'ticketRequired' }

  const event = await getMergedEvent(eventId)
  if (!event) return { error: 'registrationFailed' }

  if (event.maxCapacity != null) {
    const agg = await prisma.registration.aggregate({
      where: { eventId },
      _sum: { memberCount: true, guestCount: true },
    })
    const current = (agg._sum.memberCount ?? 0) + (agg._sum.guestCount ?? 0)
    if (current + guestCount > event.maxCapacity) {
      return { error: 'capacityFull' }
    }
  }

  try {
    await prisma.registration.create({
      data: { eventId, name, email, phone, memberCount, guestCount },
    })
    revalidatePath('/')
    revalidatePath(`/register/${eventId}`)
    return { success: true }
  } catch {
    return { error: 'registrationFailed' }
  }
}
