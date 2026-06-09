import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEventById, EVENTS } from '@/lib/events'
import RegisterForm from './RegisterForm'

interface Props {
  params: Promise<{ eventId: string }>
}

export function generateStaticParams() {
  return EVENTS.map((e) => ({ eventId: e.id }))
}

export default async function RegisterPage({ params }: Props) {
  const { eventId } = await params
  const event = getEventById(eventId)
  if (!event) notFound()

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Back */}
        <Link
          href="/"
          className="text-amber-600 hover:text-amber-400 text-sm transition-colors flex items-center gap-1.5 mb-8"
        >
          ← All events
        </Link>

        {/* Event banner */}
        <div
          className="rounded-xl overflow-hidden mb-7"
          style={{ border: `1px solid ${event.borderColor}44` }}
        >
          <div className="px-6 py-5" style={{ backgroundColor: event.bgColor }}>
            <p
              className="font-serif text-sm mb-1.5 tracking-wide"
              style={{ color: event.textColor, opacity: 0.8 }}
            >
              ★&nbsp;&nbsp;{event.date} — Doors open at 7:30 PM
            </p>
            <h1
              className="font-serif text-3xl font-bold leading-tight"
              style={{ color: event.textColor }}
            >
              {event.artist}
            </h1>
            {event.genre && (
              <p
                className="text-sm italic mt-1"
                style={{ color: event.textColor, opacity: 0.75 }}
              >
                {event.genre}
              </p>
            )}
          </div>
        </div>

        {/* Form card */}
        <div
          className="rounded-xl p-6"
          style={{
            background: 'rgba(26,16,10,0.85)',
            border: '1px solid rgba(120,80,30,0.3)',
          }}
        >
          <h2 className="font-serif text-xl text-amber-300 mb-1">Reserve Your Spot</h2>
          <p className="text-stone-500 text-sm mb-6">
            Members: ${event.memberPrice}&nbsp;&nbsp;·&nbsp;&nbsp;Guests: ${event.guestPrice}
          </p>
          <RegisterForm
            eventId={event.id}
            memberPrice={event.memberPrice}
            guestPrice={event.guestPrice}
          />
        </div>
      </div>
    </main>
  )
}
