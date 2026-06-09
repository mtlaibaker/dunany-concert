import Link from 'next/link'
import { EVENTS } from '@/lib/events'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getEventCounts(): Promise<Record<string, { members: number; guests: number }>> {
  const grouped = await prisma.registration.groupBy({
    by: ['eventId', 'isMember'],
    _count: { id: true },
  })
  const counts: Record<string, { members: number; guests: number }> = {}
  for (const row of grouped) {
    if (!counts[row.eventId]) counts[row.eventId] = { members: 0, guests: 0 }
    if (row.isMember) counts[row.eventId].members = row._count.id
    else counts[row.eventId].guests = row._count.id
  }
  return counts
}

export default async function HomePage() {
  const counts = await getEventCounts()

  return (
    <main className="min-h-screen">
      {/* ── Header ── */}
      <header className="text-center py-14 px-4" style={{ borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <p className="text-amber-500 text-xs tracking-[0.35em] uppercase mb-3 font-sans">
          Welcome to
        </p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-amber-300 tracking-wide leading-tight">
          Dunany Country Club
        </h1>
        <div className="text-amber-500 text-3xl font-serif font-bold tracking-widest my-2">2026</div>
        <h2 className="font-serif text-2xl md:text-4xl text-amber-400 tracking-[0.2em] uppercase mb-6">
          Performance Series
        </h2>
        <div className="w-32 h-px mx-auto mb-5" style={{ background: 'linear-gradient(90deg, transparent, #c9a227, transparent)' }} />
        <p className="text-stone-400 text-sm">
          All shows start at{' '}
          <span className="text-amber-400 font-semibold">7:30 PM</span>
          {' · '}
          2053 Dunany Road, Wentworth, Quebec
        </p>
      </header>

      {/* ── Event Grid ── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EVENTS.map((event) => {
            const c = counts[event.id] ?? { members: 0, guests: 0 }
            const total = c.members + c.guests

            return (
              <div
                key={event.id}
                className="rounded-xl overflow-hidden"
                style={{
                  border: `1px solid ${event.borderColor}33`,
                  background: 'rgba(26,16,10,0.85)',
                }}
              >
                {/* Coloured banner */}
                <div className="px-5 py-4" style={{ backgroundColor: event.bgColor }}>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-serif text-base font-bold tracking-wide"
                      style={{ color: event.textColor }}
                    >
                      ★&nbsp;&nbsp;{event.date}
                    </span>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide"
                      style={{ backgroundColor: event.badgeBg, color: event.textColor }}
                    >
                      {total} registered
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="font-serif text-xl font-bold text-amber-200 mb-1 leading-snug">
                    {event.artist}
                  </h3>
                  {event.genre && (
                    <p className="text-stone-400 text-sm italic mb-3">{event.genre}</p>
                  )}

                  {/* Pricing */}
                  <div className="flex gap-4 text-sm mb-4">
                    <span className="text-stone-300">
                      Members:{' '}
                      <span className="text-amber-400 font-semibold">${event.memberPrice}</span>
                    </span>
                    <span className="text-stone-600">|</span>
                    <span className="text-stone-300">
                      Guests:{' '}
                      <span className="text-amber-400 font-semibold">${event.guestPrice}</span>
                    </span>
                  </div>

                  {/* Attendance counts */}
                  <div className="flex gap-3 mb-5">
                    <div
                      className="flex-1 rounded-lg px-3 py-2.5 text-center"
                      style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.2)' }}
                    >
                      <div className="text-2xl font-bold text-amber-300">{c.members}</div>
                      <div className="text-xs text-stone-500 uppercase tracking-wider mt-0.5">
                        Members
                      </div>
                    </div>
                    <div
                      className="flex-1 rounded-lg px-3 py-2.5 text-center"
                      style={{ background: 'rgba(120,120,120,0.1)', border: '1px solid rgba(120,120,120,0.2)' }}
                    >
                      <div className="text-2xl font-bold text-stone-300">{c.guests}</div>
                      <div className="text-xs text-stone-500 uppercase tracking-wider mt-0.5">
                        Guests
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/register/${event.id}`}
                    className="block text-center py-2.5 rounded-lg font-semibold transition-opacity hover:opacity-90 text-sm tracking-wide"
                    style={{ backgroundColor: event.borderColor, color: event.textColor }}
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center space-y-1">
          <p className="text-stone-500 text-sm">
            Questions?{' '}
            <a
              href="mailto:Dan_Leblanc13@hotmail.com"
              className="text-amber-700 hover:text-amber-500 transition-colors"
            >
              Dan_Leblanc13@hotmail.com
            </a>
          </p>
          <p className="text-stone-600 text-xs tracking-widest uppercase">
            Summer Fun for Everyone!
          </p>
        </div>
      </section>
    </main>
  )
}
