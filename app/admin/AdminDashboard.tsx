import { prisma } from '@/lib/db'
import { getMergedEvents } from '@/lib/eventConfig'
import Link from 'next/link'
import { logoutAction } from './actions'
import EventEditorButton from './EventEditor'
import ContactEditor from './ContactEditor'
import RegistrationsTable from './RegistrationsTable'
import type { RegistrationData, EventSummary } from './RegistrationsTable'

async function getAllRegistrations() {
  return prisma.registration.findMany({
    orderBy: [{ eventId: 'asc' }, { createdAt: 'desc' }],
  })
}

async function getStats() {
  const grouped = await prisma.registration.groupBy({
    by: ['eventId'],
    _sum: { memberCount: true, guestCount: true },
  })
  const stats: Record<string, number> = {}
  for (const row of grouped) {
    stats[row.eventId] = (row._sum.memberCount ?? 0) + (row._sum.guestCount ?? 0)
  }
  return stats
}

export default async function AdminDashboard() {
  const [registrations, stats, events, siteConfig] = await Promise.all([
    getAllRegistrations(),
    getStats(),
    getMergedEvents(),
    prisma.siteConfig.findUnique({ where: { id: 1 } }),
  ])
  const contactEmail = siteConfig?.contactEmail ?? 'Dan_Leblanc13@hotmail.com'
  const memberSecretEnabled = !!siteConfig?.memberSecret
  const totalTickets = registrations.reduce((s, r) => s + r.memberCount + r.guestCount, 0)

  const serializedRegs: RegistrationData[] = registrations.map((r) => ({
    id: r.id,
    eventId: r.eventId,
    name: r.name,
    email: r.email,
    phone: r.phone,
    memberCount: r.memberCount,
    guestCount: r.guestCount,
    isMember: r.isMember,
    createdAt: r.createdAt.toISOString(),
  }))

  const eventSummaries: EventSummary[] = events.map((e) => ({
    id: e.id,
    artist: e.artist,
    date: e.date,
    isoDate: e.isoDate,
    bgColor: e.bgColor,
    textColor: e.textColor,
    borderColor: e.borderColor,
  }))

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <Link href="/" className="text-amber-600 hover:text-amber-400 text-xs transition-colors">
              ← Public Site
            </Link>
            <h1 className="font-serif text-3xl text-amber-300 mt-1">Registration Dashboard</h1>
            <p className="text-stone-500 text-sm mt-1">
              {registrations.length} registrations &nbsp;·&nbsp; {totalTickets} tickets
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-red-900/40 hover:bg-red-900/70 text-red-400 text-sm transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>

        {/* Contact info */}
        <ContactEditor contactEmail={contactEmail} memberSecretEnabled={memberSecretEnabled} />

        {/* Per-event cards — click to edit */}
        <div className="mb-3">
          <h2 className="text-xs text-stone-500 uppercase tracking-widest mb-3">Events — click to edit</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {events.map((event) => (
            <EventEditorButton
              key={`${event.id}-${event.artist}-${event.isoDate}-${event.maxCapacity}`}
              event={event}
              ticketCount={stats[event.id] ?? 0}
            />
          ))}
        </div>

        {/* Registrations table with sort + filter + export */}
        <RegistrationsTable registrations={serializedRegs} events={eventSummaries} />
      </div>
    </div>
  )
}
