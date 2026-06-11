'use client'

import Link from 'next/link'
import { EVENTS, isPast, type ConcertEvent } from '@/lib/events'
import { useLanguage } from './LanguageContext'

interface Props {
  counts: Record<string, { members: number; guests: number }>
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
  const { lang, t } = useLanguage()
  const total = counts.members + counts.guests
  const date = lang === 'fr' ? event.dateFr : event.date
  const genre = lang === 'fr' ? event.genreFr : event.genre

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: `1px solid ${past ? '#44444433' : event.borderColor + '33'}`,
        background: past ? 'rgba(20,20,20,0.5)' : 'rgba(26,16,10,0.85)',
        opacity: past ? 0.6 : 1,
      }}
    >
      <div className="px-5 py-4" style={{ backgroundColor: past ? '#2a2a2a' : event.bgColor }}>
        <div className="flex items-center justify-between">
          <span className="font-serif text-base font-bold tracking-wide" style={{ color: past ? '#888' : event.textColor }}>
            {past ? '✕' : '★'}&nbsp;&nbsp;{date}
            {past && <span className="text-xs font-normal ml-2">({lang === 'fr' ? 'passé' : 'past'})</span>}
          </span>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide"
            style={{ backgroundColor: past ? '#333' : event.badgeBg, color: past ? '#777' : event.textColor }}
          >
            {total} {t.registered}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className={`font-serif text-xl font-bold mb-1 leading-snug ${past ? 'text-stone-600' : 'text-amber-200'}`}>
          {event.artist}
        </h3>
        {genre && <p className="text-stone-500 text-sm italic mb-3">{genre}</p>}

        <div className="flex gap-4 text-sm mb-4">
          <span className="text-stone-400">
            {t.generalAdmission}:{' '}
            <span className={past ? 'text-stone-500' : 'text-amber-400 font-semibold'}>${event.price}</span>
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
            <div className={`text-2xl font-bold ${past ? 'text-stone-600' : 'text-amber-300'}`}>{total}</div>
            <div className="text-xs text-stone-600 uppercase tracking-wider mt-0.5">{t.ticketsLabel}</div>
          </div>
        </div>

        {past ? (
          <div className="block text-center py-2.5 rounded-lg text-sm text-stone-600 border border-stone-800">
            {t.eventPassed}
          </div>
        ) : event.tbd ? (
          <div className="block text-center py-2.5 rounded-lg text-sm text-stone-500 border border-stone-700">
            {t.tbdNotice}
          </div>
        ) : (
          <Link
            href={`/register/${event.id}`}
            className="block text-center py-2.5 rounded-lg font-semibold transition-opacity hover:opacity-90 text-sm tracking-wide"
            style={{ backgroundColor: event.borderColor, color: event.textColor }}
          >
            {t.registerNow}
          </Link>
        )}
      </div>
    </div>
  )
}

export default function HomeContent({ counts }: Props) {
  const { t } = useLanguage()
  const upcoming = EVENTS.filter((e) => !isPast(e))
  const past = EVENTS.filter((e) => isPast(e))

  return (
    <main className="min-h-screen">
      <header className="text-center py-14 px-4" style={{ borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <p className="text-amber-500 text-xs tracking-[0.35em] uppercase mb-3 font-sans">{t.welcomeTo}</p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-amber-300 tracking-wide leading-tight">
          Dunany Country Club
        </h1>
        <div className="text-amber-500 text-3xl font-serif font-bold tracking-widest my-2">2026</div>
        <h2 className="font-serif text-2xl md:text-4xl text-amber-400 tracking-[0.2em] uppercase mb-6">
          {t.performanceSeries}
        </h2>
        <div className="w-32 h-px mx-auto mb-5" style={{ background: 'linear-gradient(90deg, transparent, #c9a227, transparent)' }} />
        <p className="text-stone-400 text-sm">
          {t.showTimePrefix}{' '}
          <span className="text-amber-400 font-semibold">{t.showTime}</span>
          {' · '}
          {t.address}
        </p>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-12">
        {upcoming.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} counts={counts[event.id] ?? { members: 0, guests: 0 }} />
            ))}
          </div>
        )}

        {past.length > 0 && (
          <div className={upcoming.length > 0 ? 'mt-14' : ''}>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-stone-800" />
              <span className="text-stone-600 text-xs uppercase tracking-widest">{t.pastEvents}</span>
              <div className="h-px flex-1 bg-stone-800" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {past.map((event) => (
                <EventCard key={event.id} event={event} counts={counts[event.id] ?? { members: 0, guests: 0 }} past />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 text-center space-y-1">
          <p className="text-stone-500 text-sm">
            {t.questions}{' '}
            <a href="mailto:Dan_Leblanc13@hotmail.com" className="text-amber-700 hover:text-amber-500 transition-colors">
              Dan_Leblanc13@hotmail.com
            </a>
          </p>
          <p className="text-stone-600 text-xs tracking-widest uppercase">{t.tagline}</p>
        </div>
      </section>
    </main>
  )
}
