import { prisma } from '@/lib/db'
import { getMergedEvents } from '@/lib/eventConfig'
import { isPast } from '@/lib/events'
import Link from 'next/link'
import { memberLogoutAction } from './actions'
import AttendeesPanel from './AttendeesPanel'
import type { AttendeeEvent } from './AttendeesPanel'

export default async function MembersDashboard() {
  const [registrations, events] = await Promise.all([
    prisma.registration.findMany({ orderBy: { createdAt: 'asc' } }),
    getMergedEvents(),
  ])

  const counts: Record<string, number> = {}
  for (const r of registrations) {
    counts[r.eventId] = (counts[r.eventId] ?? 0) + r.memberCount + r.guestCount
  }

  const upcoming = events.filter((e) => !isPast(e))
  const past = events.filter((e) => isPast(e))

  const attendeeRegs = registrations.map((r) => ({
    id: r.id,
    eventId: r.eventId,
    name: r.name,
    memberCount: r.memberCount,
    guestCount: r.guestCount,
    isMember: r.isMember,
  }))

  const attendeeEvents: AttendeeEvent[] = events.map((e) => ({
    id: e.id,
    artist: e.artist,
    date: e.date,
    bgColor: e.bgColor,
    textColor: e.textColor,
    borderColor: e.borderColor,
  }))

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="text-center py-10 px-4" style={{ borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <p className="text-amber-500 text-xs tracking-[0.35em] uppercase mb-2">Dunany Country Club</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-amber-300 tracking-wide">
          Members Area
        </h1>
        <div className="text-amber-500 text-2xl font-serif font-bold tracking-widest my-1">2026</div>
        <p className="font-serif text-xl text-amber-400 tracking-[0.2em] uppercase">Performance Series</p>
        <div className="w-24 h-px mx-auto mt-4" style={{ background: 'linear-gradient(90deg, transparent, #c9a227, transparent)' }} />
      </header>

      <section className="max-w-4xl mx-auto px-4 py-10">
        {/* Sign out */}
        <div className="flex justify-end mb-8">
          <form action={memberLogoutAction}>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 text-sm transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>

        {/* Upcoming events */}
        {upcoming.length > 0 && (
          <>
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-4">Upcoming Shows</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {upcoming.map((event) => {
                const total = counts[event.id] ?? 0
                const isFull = event.maxCapacity != null && total >= event.maxCapacity
                const spotsLeft = event.maxCapacity != null ? Math.max(0, event.maxCapacity - total) : null

                return (
                  <div
                    key={event.id}
                    className="rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${event.borderColor}33`, background: 'rgba(26,16,10,0.85)' }}
                  >
                    <div className="px-5 py-4" style={{ backgroundColor: event.bgColor }}>
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-base font-bold tracking-wide" style={{ color: event.textColor }}>
                          ★&nbsp;&nbsp;{event.date}
                        </span>
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={{ backgroundColor: event.badgeBg, color: event.textColor }}
                        >
                          {total} registered
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-xl font-bold mb-1 text-amber-200">{event.artist}</h3>
                      {event.genre && <p className="text-stone-500 text-sm italic mb-3">{event.genre}</p>}
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-stone-400">
                          General Admission: <span className="text-amber-400 font-semibold">${event.price}</span>
                        </span>
                        {spotsLeft !== null && (
                          <span className={`text-xs ${spotsLeft === 0 ? 'text-red-400' : 'text-stone-500'}`}>
                            {spotsLeft} spots remaining
                          </span>
                        )}
                      </div>
                      {event.tbd ? (
                        <div className="block text-center py-2.5 rounded-lg text-sm text-stone-500 border border-stone-700">
                          Date to be confirmed
                        </div>
                      ) : isFull ? (
                        <div className="block text-center py-2.5 rounded-lg text-sm font-semibold text-red-400 border border-red-900/40 bg-red-900/10">
                          Sold Out
                        </div>
                      ) : (
                        <Link
                          href={`/members/register/${event.id}`}
                          className="block text-center py-2.5 rounded-lg font-semibold transition-opacity hover:opacity-90 text-sm tracking-wide"
                          style={{ backgroundColor: event.borderColor, color: event.textColor }}
                        >
                          Register Now
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Past events */}
        {past.length > 0 && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-stone-800" />
              <span className="text-stone-600 text-xs uppercase tracking-widest">Past Shows</span>
              <div className="h-px flex-1 bg-stone-800" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {past.map((event) => {
                const total = counts[event.id] ?? 0
                return (
                  <div
                    key={event.id}
                    className="rounded-xl overflow-hidden opacity-50"
                    style={{ border: '1px solid #44444433', background: 'rgba(20,20,20,0.5)' }}
                  >
                    <div className="px-5 py-4" style={{ backgroundColor: '#2a2a2a' }}>
                      <span className="font-serif text-base font-bold text-stone-500">✕&nbsp;&nbsp;{event.date}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-xl font-bold mb-1 text-stone-600">{event.artist}</h3>
                      <div className="block text-center py-2.5 rounded-lg text-sm text-stone-600 border border-stone-800 mt-4">
                        This event has passed
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Attendees section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-stone-800" />
          <span className="text-stone-600 text-xs uppercase tracking-widest">Attendees</span>
          <div className="h-px flex-1 bg-stone-800" />
        </div>
        <AttendeesPanel registrations={attendeeRegs} events={attendeeEvents} />
      </section>
    </main>
  )
}
