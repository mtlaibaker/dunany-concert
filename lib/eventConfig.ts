import { prisma } from './db'
import { EVENTS, type ConcertEvent } from './events'

function formatDateEN(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function formatDateFR(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
}

type EventConfigRow = {
  eventId: string
  artist: string | null
  isoDate: string | null
  genre: string | null
  genreFr: string | null
  tbd: boolean | null
  maxCapacity: number | null
}

function applyConfig(event: ConcertEvent, config: EventConfigRow | null): ConcertEvent {
  if (!config) return event
  const isoDate = config.isoDate ?? event.isoDate
  const dateChanged = config.isoDate !== null
  return {
    ...event,
    artist: config.artist ?? event.artist,
    isoDate,
    date: dateChanged ? formatDateEN(isoDate) : event.date,
    dateFr: dateChanged ? formatDateFR(isoDate) : event.dateFr,
    // null in DB means "not overridden"; use static default
    // empty string from admin means "clear it"
    genre: config.genre !== null ? (config.genre || null) : event.genre,
    genreFr: config.genreFr !== null ? (config.genreFr || null) : event.genreFr,
    tbd: config.tbd ?? event.tbd,
    maxCapacity: config.maxCapacity ?? event.maxCapacity,
  }
}

export async function getMergedEvents(): Promise<ConcertEvent[]> {
  try {
    const configs = await prisma.eventConfig.findMany()
    const map = Object.fromEntries(configs.map((c) => [c.eventId, c]))
    return EVENTS.map((e) => applyConfig(e, map[e.id] ?? null))
  } catch {
    return EVENTS
  }
}

export async function getMergedEvent(eventId: string): Promise<ConcertEvent | undefined> {
  const event = EVENTS.find((e) => e.id === eventId)
  if (!event) return undefined
  try {
    const config = await prisma.eventConfig.findUnique({ where: { eventId } })
    return applyConfig(event, config)
  } catch {
    return event
  }
}

export async function getTicketCount(eventId: string): Promise<number> {
  try {
    const agg = await prisma.registration.aggregate({
      where: { eventId },
      _sum: { memberCount: true, guestCount: true },
    })
    return (agg._sum.memberCount ?? 0) + (agg._sum.guestCount ?? 0)
  } catch {
    return 0
  }
}
