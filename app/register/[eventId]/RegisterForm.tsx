'use client'

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

  if (state?.success) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🎵</div>
        <h3 className="font-serif text-2xl text-amber-300 mb-2">You&apos;re registered!</h3>
        <p className="text-stone-400 text-sm">We look forward to seeing you at the show.</p>
        <Link
          href="/"
          className="inline-block mt-6 text-amber-600 hover:text-amber-400 text-sm transition-colors"
        >
          ← View other events
        </Link>
      </div>
    )
  }

  const selectClass =
    'w-full bg-stone-800/70 border border-stone-600/60 rounded-lg px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-colors'

  return (
    <form action={formAction} className="space-y-5">
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

      {/* Phone — optional */}
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
            <select id="memberCount" name="memberCount" defaultValue="0" className={selectClass}>
              {COUNT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-xs text-stone-300 mb-1.5" htmlFor="guestCount">
              Guests <span className="text-stone-500">(${guestPrice} each)</span>
            </label>
            <select id="guestCount" name="guestCount" defaultValue="0" className={selectClass}>
              {COUNT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
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
