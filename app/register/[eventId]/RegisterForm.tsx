'use client'

import { useState, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { registerAction } from '@/app/actions'
import Link from 'next/link'

const COUNT_OPTIONS = Array.from({ length: 11 }, (_, i) => i) // 0–10

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-lg font-semibold bg-amber-700 hover:bg-amber-600 text-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
    >
      {pending ? 'Registering…' : 'Complete Registration'}
    </button>
  )
}

interface Props {
  eventId: string
  memberPrice: number
  guestPrice: number
}

export default function RegisterForm({ eventId, memberPrice, guestPrice }: Props) {
  const [state, formAction] = useFormState(registerAction, null)
  const [memberCount, setMemberCount] = useState(0)
  const [guestCount, setGuestCount] = useState(0)

  // Keep a ref to the final totals to show in the success message
  const submittedTotal = useRef(0)

  const total = memberCount * memberPrice + guestCount * guestPrice

  function handleSubmit() {
    submittedTotal.current = total
  }

  if (state?.success) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🎵</div>
        <h3 className="font-serif text-2xl text-amber-300 mb-2">You&apos;re registered!</h3>
        <p className="text-stone-300 text-sm mb-1">We look forward to seeing you at the show.</p>
        {submittedTotal.current > 0 && (
          <div
            className="mt-5 rounded-lg px-5 py-4 inline-block"
            style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.25)' }}
          >
            <p className="text-stone-400 text-xs uppercase tracking-wider mb-1">Amount due at the door</p>
            <p className="text-amber-300 text-3xl font-bold font-serif">${submittedTotal.current}</p>
            <p className="text-stone-500 text-xs mt-1">Payable by debit or credit card on the day of the event</p>
          </div>
        )}
        <div className="mt-6">
          <Link href="/" className="text-amber-600 hover:text-amber-400 text-sm transition-colors">
            ← View other events
          </Link>
        </div>
      </div>
    )
  }

  const selectClass =
    'w-full bg-stone-800/70 border border-stone-600/60 rounded-lg px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-colors'

  return (
    <form action={formAction} className="space-y-5" onSubmit={handleSubmit}>
      <input type="hidden" name="eventId" value={eventId} />

      {/* Name */}
      <div>
        <label className="block text-sm text-stone-300 mb-1.5" htmlFor="name">
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={selectClass}
          placeholder="Your full name"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm text-stone-300 mb-1.5" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={selectClass}
          placeholder="you@example.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm text-stone-300 mb-1.5" htmlFor="phone">
          Phone Number{' '}
          <span className="text-stone-500 font-normal">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className={selectClass}
          placeholder="(514) 555-0100"
        />
        <p className="text-xs text-stone-600 mt-1">Please provide at least one of email or phone.</p>
      </div>

      {/* Ticket counts */}
      <div
        className="rounded-lg p-4 space-y-4"
        style={{ background: 'rgba(201,162,39,0.07)', border: '1px solid rgba(201,162,39,0.2)' }}
      >
        <p className="text-stone-300 text-sm font-medium">Number of Tickets</p>

        <div className="grid grid-cols-2 gap-4">
          {/* Members */}
          <div>
            <label className="block text-xs text-amber-400 mb-1.5" htmlFor="memberCount">
              Members <span className="text-stone-500">(${memberPrice} each)</span>
            </label>
            <select
              id="memberCount"
              name="memberCount"
              value={memberCount}
              onChange={(e) => setMemberCount(parseInt(e.target.value))}
              className={selectClass}
            >
              {COUNT_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-xs text-stone-300 mb-1.5" htmlFor="guestCount">
              Guests <span className="text-stone-500">(${guestPrice} each)</span>
            </label>
            <select
              id="guestCount"
              name="guestCount"
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value))}
              className={selectClass}
            >
              {COUNT_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Running total */}
        <div className="flex items-center justify-between pt-1 border-t border-amber-900/30">
          <span className="text-stone-400 text-sm">Estimated total</span>
          <span className="text-amber-300 text-xl font-bold font-serif">
            {total > 0 ? `$${total}` : '—'}
          </span>
        </div>

        {/* Payment note */}
        <p className="text-stone-500 text-xs">
          Payment is collected on site by debit or credit card.
        </p>
      </div>

      {/* Error */}
      {state?.error && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-lg px-4 py-2.5">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  )
}
