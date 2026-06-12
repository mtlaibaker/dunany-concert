import { prisma } from '@/lib/db'
import { getMergedEvents } from '@/lib/eventConfig'
import Link from 'next/link'
import { logoutAction } from './actions'
import RegistrationRow from './RegistrationRow'
import EventEditorButton from './EventEditor'
import ContactEditor from './ContactEditor'

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

  const totalTickets = registrations.reduce((s, r) => s + r.memberCount + r.guestCount, 0)

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
          <div className="flex gap-3 items-center">
            <a
              href="/api/admin/export"
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm transition-colors"
            >
              ↓ Export CSV
            </a>
            <form action={logoutAction}>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-red-900/40 hover:bg-red-900/70 text-red-400 text-sm transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Contact info */}
        <ContactEditor contactEmail={contactEmail} />

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

        {/* Full registrations table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'rgba(26,16,10,0.7)',
            border: '1px solid rgba(120,80,30,0.2)',
          }}
        >
          <div className="px-6 py-4 border-b border-stone-800/60">
            <h2 className="font-serif text-lg text-amber-300">All Registrations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-800/60">
                  {['Name', 'Event', 'Contact', 'Tickets', 'Registered', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-stone-500 font-medium text-xs uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-stone-600">
                      No registrations yet.
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg, i) => (
                    <RegistrationRow key={reg.id} reg={reg} striped={i % 2 !== 0} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
