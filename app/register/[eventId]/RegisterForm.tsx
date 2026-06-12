'use client'

import { useState, useRef, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { registerAction } from '@/app/actions'
import { useLanguage } from '@/app/LanguageContext'
import { type TranslationKey } from '@/lib/i18n'
import Link from 'next/link'

const COUNT_OPTIONS = Array.from({ length: 11 }, (_, i) => i)

function SubmitButton() {
  const { pending } = useFormStatus()
  const { t } = useLanguage()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-lg font-semibold bg-amber-700 hover:bg-amber-600 text-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
    >
      {pending ? t.registering : t.completeRegistration}
    </button>
  )
}

function PrivacyModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage()
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-xl p-6 shadow-2xl"
        style={{ background: 'rgba(22,13,7,0.98)', border: '1px solid rgba(120,80,30,0.4)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-200 transition-colors text-xl leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="font-serif text-lg text-amber-300 mb-4 pr-6">{t.privacyTitle}</h3>

        <div className="space-y-3 text-xs text-stone-400 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <p>{t.privacyIntro}</p>
          <p className="text-stone-300 font-medium">{t.privacyPurposesTitle}</p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>{t.privacyPurpose1}</li>
            <li>{t.privacyPurpose2}</li>
          </ul>
          <p>{t.privacyNoMarketing}</p>
          <p>{t.privacyAccess}</p>
          <p>{t.privacyDeletion}</p>
          <p className="text-stone-300 italic">{t.privacyConsent}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2 rounded-lg text-sm font-semibold bg-amber-700/40 hover:bg-amber-700/60 text-amber-300 transition-colors border border-amber-800/40"
        >
          {t.close}
        </button>
      </div>
    </div>
  )
}

interface Props {
  eventId: string
  guestPrice: number
}

export default function RegisterForm({ eventId, guestPrice }: Props) {
  const { t, lang } = useLanguage()
  const [state, formAction] = useFormState(registerAction, null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [ticketCount, setTicketCount] = useState(0)
  const [privacyChecked, setPrivacyChecked] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const submittedTotal = useRef(0)

  // Reset ticket count when a capacity error is returned so select and total stay in sync
  useEffect(() => {
    if (state?.error === 'tooManyTickets' || state?.error === 'capacityFull') {
      setTicketCount(0)
    }
  }, [state])

  const total = ticketCount * guestPrice

  function handleSubmit() {
    submittedTotal.current = total
  }

  const errorMsg = (() => {
    if (!state?.error) return null
    if (state.error === 'tooManyTickets' && state.remaining != null) {
      const n = state.remaining
      return lang === 'fr'
        ? `Seulement ${n} place${n === 1 ? '' : 's'} restante${n === 1 ? '' : 's'}. Veuillez réduire votre sélection.`
        : `Only ${n} spot${n === 1 ? '' : 's'} remaining. Please reduce your selection.`
    }
    return t[state.error as TranslationKey] ?? state.error
  })()

  if (state?.success) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🎵</div>
        <h3 className="font-serif text-2xl text-amber-300 mb-2">{t.youreRegistered}</h3>
        <p className="text-stone-300 text-sm mb-1">{t.lookForward}</p>
        {submittedTotal.current > 0 && (
          <div
            className="mt-5 rounded-lg px-5 py-4 inline-block"
            style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.25)' }}
          >
            <p className="text-stone-400 text-xs uppercase tracking-wider mb-1">{t.amountDue}</p>
            <p className="text-amber-300 text-3xl font-bold font-serif">${submittedTotal.current}</p>
            <p className="text-stone-500 text-xs mt-1">{t.payableBy}</p>
          </div>
        )}
        <div className="mt-6">
          <Link href="/" className="text-amber-600 hover:text-amber-400 text-sm transition-colors">
            {t.viewOtherEvents}
          </Link>
        </div>
      </div>
    )
  }

  const inputClass =
    'w-full bg-stone-800/70 border border-stone-600/60 rounded-lg px-3.5 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-colors'

  return (
    <>
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}

      <form action={formAction} className="space-y-5" onSubmit={handleSubmit}>
        <input type="hidden" name="eventId" value={eventId} />

        <div>
          <label className="block text-sm text-stone-300 mb-1.5" htmlFor="name">
            {t.fullName} <span className="text-red-400">*</span>
          </label>
          <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} placeholder={t.fullName} value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm text-stone-300 mb-1.5" htmlFor="email">
            {t.emailAddress}
          </label>
          <input id="email" name="email" type="email" autoComplete="email" className={inputClass} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm text-stone-300 mb-1.5" htmlFor="phone">
            {t.phoneNumber}{' '}
            <span className="text-stone-500 font-normal">{t.phoneOptional}</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} placeholder="(514) 555-0100" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <p className="text-xs text-stone-600 mt-1">{t.phoneHint}</p>
        </div>

        <div
          className="rounded-lg p-4 space-y-4"
          style={{ background: 'rgba(201,162,39,0.07)', border: '1px solid rgba(201,162,39,0.2)' }}
        >
          <div>
            <label className="block text-xs text-amber-400 mb-1.5" htmlFor="guestCount">
              {t.generalAdmission} <span className="text-stone-500">(${guestPrice} {t.each})</span>
            </label>
            <input type="hidden" name="memberCount" value="0" />
            <select
              id="guestCount" name="guestCount"
              value={ticketCount} onChange={(e) => setTicketCount(parseInt(e.target.value))}
              className={inputClass}
            >
              {COUNT_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-amber-900/30">
            <span className="text-stone-400 text-sm">{t.estimatedTotal}</span>
            <span className="text-amber-300 text-xl font-bold font-serif">
              {total > 0 ? `$${total}` : '—'}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-md px-3 py-2" style={{ background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.3)' }}>
            <span className="text-amber-400 text-base leading-none">💳</span>
            <p className="text-amber-300 text-xs font-medium">{t.paymentNote}</p>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="privacyAcknowledged"
            required
            checked={privacyChecked}
            onChange={(e) => setPrivacyChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-600 bg-stone-800 accent-amber-600 cursor-pointer"
          />
          <span className="text-stone-400 text-sm leading-snug">
            {t.privacyAgreePre}
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="text-amber-500 hover:text-amber-300 underline underline-offset-2 transition-colors"
            >
              {t.privacyLinkText}
            </button>
            {t.privacyAgreePost}
          </span>
        </label>

        {errorMsg && (
          <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-lg px-4 py-2.5">
            {errorMsg}
          </p>
        )}

        <SubmitButton />
      </form>
    </>
  )
}
