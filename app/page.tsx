import Link from 'next/link'
import { EVENTS, isPast, type ConcertEvent } from '@/lib/events'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getEventCounts(): Promise<Record<string, { members: number; guests: number }>> {
  try {
    const grouped = await prisma.registration.groupBy({
      by: ['eventId'],
      _sum: { memberCount: true, guestCount: true },
    })
    const counts: Record<string, { members: number; guests: number }> = {}
    for (const row of grouped) {
      counts[row.eventId] = {
        members: row._sum.memberCount ?? 0,
        guests: row._sum.guestCount ?? 0,
      }
    }
    return counts
  } catch {
    return {}
  }
}

function EventCard({
  event,
  counts,
  past = false,
}: {
  event: ConcertEvent
  counts: { members: number; guests: number }
  past?: boolean
}) {
  const total = counts.members + counts.guests

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: `1px solid ${past ? '#44444433' : event.borderColor + '33'}`,
        background: past ? 'rgba(20,20,20,0.5)' : 'rgba(26,16,10,0.85)',
        opacity: past ? 0.6 : 1,
      }}
    >
      {/* Coloured banner */}
      <div
        className="px-5 py-4"
        style={{ backgroundColor: past ? '#2a2a2a' : event.bgColor }}
      >
        <div className="flex items-center justify-between">
          <span
            className="font-serif text-base font-bold tracking-wide"
            style={{ color: past ? '#888' : event.textColor }}
          >
            {past ? '✕' : '★'}&nbsp;&nbsp;{event.date}
            {past && <span className="text-xs font-normal ml-2">(past)</span>}
          </span>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide"
            style={{
              backgroundColor: past ? '#333' : event.badgeBg,
              color: past ? '#777' : event.textColor,
            }}
          >
            {total} registered
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        <h3
          className="font-serif text-xl font-bold mb-1 leading-snug"
          style={{ color: past ? '#666' : undefined }}
          // tailwind class as fallback when not past
          {...(!past && { className: 'font-serif text-xl font-bold text-amber-200 mb-1 leading-snug' })}
        >
          {event.artist}
        </h3>
        {event.genre && (
          <p className="text-stone-500 text-sm italic mb-3">{event.genre}</p>
        )}

        <div className="flex gap-4 text-sm mb-4">
          <span className="text-stone-400">
            Members:{' '}
            <span className={past ? 'text-stone-500' : 'text-amber-400 font-semibold'}>
              ${event.memberPrice}
            </span>
          </span>
          <span className="text-stone-700">|</span>
          <span className="text-stone-400">
            Guests:{' '}
            <span className={past ? 'text-stone-500' : 'text-amber-400 font-semibold'}>
              ${event.guestPrice}
            </span>
          </span>
        </div>

        <div className="flex gap-3 mb-5">
          <div
            className="flex-1 rounded-lg px-3 py-2.5 text-center"
            style={{
              background: past ? 'rgba(60,60,60,0.2)' : 'rgba(201,162,39,0.1)',
              border: `1px solid ${past ? 'rgba(80,80,80,0.2)' : 'rgba(201,162,39,0.2)'}`,
            }}
          >
            <div className={`text-2xl font-bold ${past ? 'text-stone-600' : 'text-amber-300'}`}>
              {counts.members}
            </div>
            <div className="text-xs text-stone-600 uppercase tracking-wider mt-0.5">Members</div>
          </div>
          <div
            className="flex-1 rounded-lg px-3 py-2.5 text-center"
            style={{
              background: 'rgba(60,60,60,0.15)',
              border: '1px solid rgba(80,80,80,0.2)',
            }}
          >
            <div className={`text-2xl font-bold ${past ? 'text-stone-600' : 'text-stone-300'}`}>
              {counts.guests}
            </div>
            <div className="text-xs text-stone-600 uppercase tracking-wider mt-0.5">Guests</div>
          </div>
        </div>

        {past ? (
          <div className="block text-center py-2.5 rounded-lg text-sm text-stone-600 border border-stone-800">
            This event has passed
          </div>
        ) : (
          <Link
            href={`/register/${event.id}`}
            className="block text-center py-2.5 rounded-lg font-semibold transition-opacity hover:opacity-90 text-sm tracking-wide"
            style={{ backgroundColor: event.borderColor, color: event.textColor }}
          >
            Register Now
          </Link>
        )}
      </div>
    </div>
  )
}

export default async function HomePage() {
  const counts = await getEventCounts()

  const upcoming = EVENTS.filter((e) => !isPast(e))
  const past = EVENTS.filter((e) => isPast(e))

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

      <section className="max-w-5xl mx-auto px-4 py-12">
        {/* Upcoming events */}
        {upcoming.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  counts={counts[event.id] ?? { members: 0, guests: 0 }}
                />
              ))}
            </div>
          </>
        )}

        {/* Past events */}
        {past.length > 0 && (
          <div className={upcoming.length > 0 ? 'mt-14' : ''}>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-stone-800" />
              <span className="text-stone-600 text-xs uppercase tracking-widest">Past Events</span>
              <div className="h-px flex-1 bg-stone-800" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {past.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  counts={counts[event.id] ?? { members: 0, guests: 0 }}
                  past
                />
              ))}
            </div>
          </div>
        )}

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
