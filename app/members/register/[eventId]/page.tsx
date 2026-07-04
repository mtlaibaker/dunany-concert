export const dynamic = 'force-dynamic'

import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { getMergedEvent, getTicketCount } from '@/lib/eventConfig'
import { isPast } from '@/lib/events'
import Link from 'next/link'
import RegisterForm from '@/app/register/[eventId]/RegisterForm'
import { prisma } from '@/lib/db'

export default async function MemberRegisterPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const siteConfig = await prisma.siteConfig.findUnique({ where: { id: 1 } })
  const secret = siteConfig?.memberSecret
  const cookieStore = await cookies()
  const auth = cookieStore.get('member_auth')
  if (!secret || auth?.value !== secret) redirect('/members')

  const { eventId } = await params
  const [event, ticketCount] = await Promise.all([
    getMergedEvent(eventId),
    getTicketCount(eventId),
  ])
  if (!event) notFound()

  const past = isPast(event)
  const isFull = event.maxCapacity != null && ticketCount >= event.maxCapacity
  const spotsLeft = event.maxCapacity != null ? Math.max(0, event.maxCapacity - ticketCount) : null

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-lg mx-auto">
        <Link
          href="/members"
          className="text-amber-600 hover:text-amber-400 text-sm transition-colors flex items-center gap-1.5 mb-8"
        >
          ← Members Area
        </Link>

        <div
          className="rounded-xl overflow-hidden mb-7"
          style={{ border: `1px solid ${event.borderColor}44` }}
        >
          <div className="px-6 py-5" style={{ backgroundColor: event.bgColor }}>
            <p className="font-serif text-sm mb-1.5 tracking-wide" style={{ color: event.textColor, opacity: 0.8 }}>
              ★&nbsp;&nbsp;{event.date} — Doors open at 7:30 PM
            </p>
            <h1 className="font-serif text-3xl font-bold leading-tight" style={{ color: event.textColor }}>
              {event.artist}
            </h1>
            {event.genre && (
              <p className="text-sm italic mt-1" style={{ color: event.textColor, opacity: 0.75 }}>
                {event.genre}
              </p>
            )}
          </div>
        </div>

        <div
          className="rounded-xl p-6"
          style={{ background: 'rgba(26,16,10,0.85)', border: '1px solid rgba(120,80,30,0.3)' }}
        >
          {!past && !event.tbd && !isFull && (
            <>
              <h2 className="font-serif text-xl text-amber-300 mb-1">Reserve Your Spot</h2>
              <p className="text-stone-500 text-sm mb-6">
                General Admission: ${event.price}
                {spotsLeft !== null && (
                  <span className="ml-3 text-amber-700">· {spotsLeft} spots remaining</span>
                )}
              </p>
            </>
          )}
          <RegisterForm
            eventId={event.id}
            guestPrice={event.price}
            isFull={isFull || past || event.tbd}
            isMember={true}
            returnHref="/members"
          />
        </div>
      </div>
    </main>
  )
}
