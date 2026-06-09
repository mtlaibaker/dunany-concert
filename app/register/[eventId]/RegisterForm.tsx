'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { registerAction } from '@/app/actions'
import Link from 'next/link'

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
  const [isMember, setIsMember] = useState(false)

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

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="isMember" value={isMember.toString()} />

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
          className="w-full bg-stone-800/70 border border-stone-600/60 rounded-lg px-3.5 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-colors"
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
          className="w-full bg-stone-800/70 border border-stone-600/60 rounded-lg px-3.5 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-colors"
          placeholder="you@example.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm text-stone-300 mb-1.5" htmlFor="phone">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className="w-full bg-stone-800/70 border border-stone-600/60 rounded-lg px-3.5 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-colors"
          placeholder="(514) 555-0100"
        />
        <p className="text-xs text-stone-600 mt-1">Please provide at least one of email or phone.</p>
      </div>

      {/* Member toggle */}
      <div
        className="rounded-lg p-4 cursor-pointer select-none"
        style={{ background: 'rgba(201,162,39,0.07)', border: '1px solid rgba(201,162,39,0.2)' }}
        onClick={() => setIsMember(!isMember)}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-stone-200 text-sm font-medium">
              Dunany Country Club Member
            </p>
            <p className="text-stone-500 text-xs mt-0.5">
              {isMember
                ? `Member rate applies — $${memberPrice} per ticket`
                : `Toggle on if you are a member — saves $${guestPrice - memberPrice}`}
            </p>
          </div>
          {/* Toggle switch */}
          <div
            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
              isMember ? 'bg-amber-600' : 'bg-stone-600'
            }`}
            role="switch"
            aria-checked={isMember}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isMember ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
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
