import { prisma } from '@/lib/db'
import { EVENTS, getEventById } from '@/lib/events'
import Link from 'next/link'
import { logoutAction } from './actions'

async function getAllRegistrations() {
  return prisma.registration.findMany({
    orderBy: [{ eventId: 'asc' }, { createdAt: 'desc' }],
  })
}

async function getStats() {
  const grouped = await prisma.registration.groupBy({
    by: ['eventId', 'isMember'],
    _count: { id: true },
  })
  const stats: Record<string, { members: number; guests: number }> = {}
  for (const row of grouped) {
    if (!stats[row.eventId]) stats[row.eventId] = { members: 0, guests: 0 }
    if (row.isMember) stats[row.eventId].members = row._count.id
    else stats[row.eventId].guests = row._count.id
  }
  return stats
}

export default async function AdminDashboard() {
  const [registrations, stats] = await Promise.all([getAllRegistrations(), getStats()])

  const totalMembers = registrations.filter((r) => r.isMember).length
  const totalGuests = registrations.filter((r) => !r.isMember).length

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
              {registrations.length} total &nbsp;·&nbsp; {totalMembers} members &nbsp;·&nbsp; {totalGuests} guests
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

        {/* Per-event summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {EVENTS.map((event) => {
            const s = stats[event.id] ?? { members: 0, guests: 0 }
            return (
              <div
                key={event.id}
                className="rounded-xl p-4"
                style={{
                  background: 'rgba(26,16,10,0.7)',
                  borderLeft: `3px solid ${event.borderColor}`,
                  border: `1px solid rgba(120,80,30,0.2)`,
                  borderLeftColor: event.borderColor,
                }}
              >
                <p className="text-xs text-stone-500 uppercase tracking-wider mb-0.5">{event.date}</p>
                <p className="text-stone-200 text-sm font-medium leading-tight mb-3">
                  {event.artist}
                </p>
                <div className="flex gap-3 text-sm">
                  <span>
                    <span className="text-amber-400 font-bold">{s.members}</span>
                    <span className="text-stone-600 text-xs ml-1">members</span>
                  </span>
                  <span>
                    <span className="text-stone-300 font-bold">{s.guests}</span>
                    <span className="text-stone-600 text-xs ml-1">guests</span>
                  </span>
                </div>
              </div>
            )
          })}
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
                  <th className="text-left px-5 py-3 text-stone-500 font-medium text-xs uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-5 py-3 text-stone-500 font-medium text-xs uppercase tracking-wider">
                    Event
                  </th>
                  <th className="text-left px-5 py-3 text-stone-500 font-medium text-xs uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left px-5 py-3 text-stone-500 font-medium text-xs uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-5 py-3 text-stone-500 font-medium text-xs uppercase tracking-wider">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-stone-600">
                      No registrations yet.
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg, i) => {
                    const event = getEventById(reg.eventId)
                    return (
                      <tr
                        key={reg.id}
                        className={
                          i % 2 === 0 ? '' : 'bg-stone-900/30'
                        }
                        style={{ borderBottom: '1px solid rgba(60,40,20,0.3)' }}
                      >
                        <td className="px-5 py-3 text-stone-200 font-medium">{reg.name}</td>
                        <td className="px-5 py-3">
                          <div
                            className="text-xs inline-flex items-center gap-1.5 px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: event ? `${event.bgColor}99` : undefined,
                              color: event?.textColor,
                            }}
                          >
                            <span>{event?.date}</span>
                            <span className="opacity-60">·</span>
                            <span>{event?.artist ?? reg.eventId}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-stone-400 text-xs space-y-0.5">
                          {reg.email && <div>{reg.email}</div>}
                          {reg.phone && <div>{reg.phone}</div>}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              reg.isMember
                                ? 'bg-amber-900/50 text-amber-400'
                                : 'bg-stone-700/50 text-stone-400'
                            }`}
                          >
                            {reg.isMember ? 'Member' : 'Guest'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-stone-600 text-xs">
                          {new Date(reg.createdAt).toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
