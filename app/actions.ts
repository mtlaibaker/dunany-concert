'use server'

import { prisma } from '@/lib/db'
import { getMergedEvent } from '@/lib/eventConfig'
import { sendCapacityAlert } from '@/lib/email'
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

  let currentTickets = 0
  if (event.maxCapacity != null) {
    const agg = await prisma.registration.aggregate({
      where: { eventId },
      _sum: { memberCount: true, guestCount: true },
    })
    currentTickets = (agg._sum.memberCount ?? 0) + (agg._sum.guestCount ?? 0)
    if (currentTickets + guestCount > event.maxCapacity) {
      return { error: 'capacityFull' }
    }
  }

  try {
    await prisma.registration.create({
      data: { eventId, name, email, phone, memberCount, guestCount },
    })
    revalidatePath('/')
    revalidatePath(`/register/${eventId}`)

    // Capacity threshold alerts (80%, 90%, 100%) — fire-and-forget
    if (event.maxCapacity != null) {
      void checkAndSendCapacityAlerts(event.artist, event.maxCapacity, currentTickets, guestCount)
    }

    return { success: true }
  } catch {
    return { error: 'registrationFailed' }
  }
}

async function checkAndSendCapacityAlerts(
  eventName: string,
  maxCapacity: number,
  previousCount: number,
  addedTickets: number
) {
  const newCount = previousCount + addedTickets
  const pct = Math.round((newCount / maxCapacity) * 100)
  console.log(`[capacity] "${eventName}": ${newCount}/${maxCapacity} (${pct}%) — was ${previousCount}`)

  const siteConfig = await prisma.siteConfig.findUnique({ where: { id: 1 } })
  const toEmail = siteConfig?.contactEmail ?? 'Dan_Leblanc13@hotmail.com'

  for (const threshold of [80, 90, 100]) {
    const limit = Math.floor(maxCapacity * threshold / 100)
    if (previousCount < limit && newCount >= limit) {
      console.log(`[capacity] Threshold ${threshold}% crossed — sending alert to ${toEmail}`)
      await sendCapacityAlert({ toEmail, eventName, ticketCount: newCount, maxCapacity, threshold })
    }
  }
}
