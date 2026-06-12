'use client'

import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { isPast, type ConcertEvent } from '@/lib/events'
import RegisterForm from './RegisterForm'

interface Props {
  event: ConcertEvent
  ticketCount: number
}

export default function RegisterPageContent({ event, ticketCount }: Props) {
  const { lang, t } = useLanguage()
  const past = isPast(event)
  const date = lang === 'fr' ? event.dateFr : event.date
  const genre = lang === 'fr' ? event.genreFr : event.genre
  const isFull = event.maxCapacity != null && ticketCount >= event.maxCapacity
  const spotsLeft = event.maxCapacity != null ? Math.max(0, event.maxCapacity - ticketCount) : null

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="text-amber-600 hover:text-amber-400 text-sm transition-colors flex items-center gap-1.5 mb-8"
        >
          {t.backToEvents}
        </Link>

        <div
          className="rounded-xl overflow-hidden mb-7"
          style={{ border: `1px solid ${event.borderColor}44` }}
        >
          <div className="px-6 py-5" style={{ backgroundColor: event.bgColor }}>
            <p
              className="font-serif text-sm mb-1.5 tracking-wide"
              style={{ color: event.textColor, opacity: 0.8 }}
            >
              ★&nbsp;&nbsp;{date} — {t.doorsOpen}
            </p>
            <h1
              className="font-serif text-3xl font-bold leading-tight"
              style={{ color: event.textColor }}
            >
              {event.artist}
            </h1>
            {genre && (
              <p className="text-sm italic mt-1" style={{ color: event.textColor, opacity: 0.75 }}>
                {genre}
              </p>
            )}
          </div>
        </div>

        <div
          className="rounded-xl p-6"
          style={{ background: 'rgba(26,16,10,0.85)', border: '1px solid rgba(120,80,30,0.3)' }}
        >
          {past ? (
            <div className="text-center py-8">
              <p className="text-stone-500 text-lg mb-4">{t.eventPassed}</p>
              <Link href="/" className="text-amber-600 hover:text-amber-400 text-sm transition-colors">
                {t.viewUpcomingEvents}
              </Link>
            </div>
          ) : event.tbd ? (
            <div className="text-center py-8">
              <p className="text-amber-500 text-base mb-2">{t.dateTbd}</p>
              <p className="text-stone-500 text-sm mb-4">{t.tbdNotice}</p>
              <Link href="/" className="text-amber-600 hover:text-amber-400 text-sm transition-colors">
                {t.backToEvents}
              </Link>
            </div>
          ) : isFull ? (
            <div className="text-center py-8">
              <p className="text-red-400 text-lg font-semibold mb-2">{t.soldOut}</p>
              <p className="text-stone-500 text-sm mb-4">{t.capacityFull}</p>
              <Link href="/" className="text-amber-600 hover:text-amber-400 text-sm transition-colors">
                {t.backToEvents}
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-serif text-xl text-amber-300 mb-1">{t.reserveSpot}</h2>
              <p className="text-stone-500 text-sm mb-6">
                {t.generalAdmission}: ${event.price}
                {spotsLeft !== null && (
                  <span className="ml-3 text-amber-700">· {spotsLeft} {t.spotsRemaining}</span>
                )}
              </p>
              <RegisterForm eventId={event.id} guestPrice={event.price} />
            </>
          )}
        </div>
      </div>
    </main>
  )
}
