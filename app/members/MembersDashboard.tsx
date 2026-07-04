import { prisma } from '@/lib/db'
import { getMergedEvents } from '@/lib/eventConfig'
import { isPast } from '@/lib/events'
import { memberLogoutAction } from './actions'

export default async function MembersDashboard() {
  const [registrations, events] = await Promise.all([
    prisma.registration.findMany({ orderBy: { createdAt: 'asc' } }),
    getMergedEvents(),
  ])

  const upcoming = events.filter((e) => !isPast(e) && !e.tbd)
  const past = events.filter((e) => isPast(e))

  function EventSection({ eventList, label }: { eventList: typeof events; label?: string }) {
    const rows = eventList.map((event) => {
      const regs = registrations.filter((r) => r.eventId === event.id)
      const totalTickets = regs.reduce((s, r) => s + r.memberCount + r.guestCount, 0)
      return { event, regs, totalTickets }
    }).filter((r) => r.regs.length > 0)

    if (rows.length === 0) return null

    return (
      <div className="mb-8">
        {label && (
          <p className="text-xs text-stone-500 uppercase tracking-widest mb-3">{label}</p>
        )}
        <div className="space-y-4">
          {rows.map(({ event, regs, totalTickets }) => (
            <div
              key={event.id}
              className="rounded-xl overflow-hidden"
              style={{ border: `1px solid ${event.borderColor}44` }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: event.bgColor }}
              >
                <div>
                  <p className="font-serif font-bold" style={{ color: event.textColor }}>
                    {event.artist}
                  </p>
                  <p className="text-xs opacity-75" style={{ color: event.textColor }}>
                    {event.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg" style={{ color: event.textColor }}>
                    {regs.length}
                  </p>
                  <p className="text-xs opacity-60" style={{ color: event.textColor }}>
                    {regs.length === 1 ? 'registration' : 'registrations'} · {totalTickets} tickets
                  </p>
                </div>
              </div>

              <div style={{ background: 'rgba(18,10,5,0.9)' }}>
                {regs.map((reg, i) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between px-4 py-2.5"
                    style={{
                      borderTop: i > 0 ? '1px solid rgba(60,40,20,0.3)' : undefined,
                    }}
                  >
                    <span className="text-stone-200 text-sm">{reg.name}</span>
                    <span className="text-stone-500 text-xs">
                      {reg.memberCount + reg.guestCount} {reg.memberCount + reg.guestCount === 1 ? 'ticket' : 'tickets'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalRegistrations = registrations.length
  const totalTickets = registrations.reduce((s, r) => s + r.memberCount + r.guestCount, 0)

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-amber-600 text-xs uppercase tracking-widest mb-1">Dunany Country Club</p>
            <h1 className="font-serif text-3xl text-amber-300">Members Area</h1>
            <p className="text-stone-500 text-sm mt-1">
              {totalRegistrations} {totalRegistrations === 1 ? 'registration' : 'registrations'} &nbsp;·&nbsp; {totalTickets} tickets
            </p>
          </div>
          <form action={memberLogoutAction}>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 text-sm transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>

        {upcoming.length > 0 && (
          <EventSection eventList={upcoming} label="Upcoming Shows" />
        )}

        {past.length > 0 && (
          <EventSection eventList={past} label="Past Shows" />
        )}

        {totalRegistrations === 0 && (
          <p className="text-center text-stone-600 py-16">No registrations yet.</p>
        )}
      </div>
    </main>
  )
}
