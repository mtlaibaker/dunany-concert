'use client'

import { useState, useTransition } from 'react'
import { updateSiteConfigAction, sendTestEmailAction } from './actions'

interface Props {
  contactEmail: string
}

export default function ContactEditor({ contactEmail }: Props) {
  const [email, setEmail] = useState(contactEmail)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [testStatus, setTestStatus] = useState<{ ok: boolean; message: string } | null>(null)
  const [isTesting, startTestTransition] = useTransition()

  function handleSave() {
    if (!email.trim()) return
    startTransition(async () => {
      await updateSiteConfigAction(email.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  function handleTest() {
    if (!email.trim()) return
    setTestStatus(null)
    startTestTransition(async () => {
      const result = await sendTestEmailAction(email.trim())
      setTestStatus(
        result.ok
          ? { ok: true, message: `Test email sent to ${email.trim()}` }
          : { ok: false, message: result.error ?? 'Unknown error' }
      )
    })
  }

  return (
    <div
      className="rounded-xl p-5 mb-8"
      style={{ background: 'rgba(26,16,10,0.7)', border: '1px solid rgba(120,80,30,0.2)' }}
    >
      <h2 className="text-xs text-stone-500 uppercase tracking-widest mb-3">Site Contact Info</h2>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-xs text-stone-400 mb-1">Contact Email (shown on public site)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setSaved(false); setTestStatus(null) }}
            className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 text-sm focus:outline-none focus:border-amber-600 transition-colors"
            placeholder="contact@example.com"
          />
        </div>
        <button
          onClick={handleTest}
          disabled={isTesting || isPending || !email.trim()}
          className="mt-5 px-4 py-2 rounded-lg text-sm bg-stone-700 hover:bg-stone-600 text-stone-200 transition-colors disabled:opacity-40 shrink-0"
        >
          {isTesting ? 'Sending…' : 'Send Test'}
        </button>
        <button
          onClick={handleSave}
          disabled={isPending || isTesting || !email.trim()}
          className="mt-5 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-700 hover:bg-amber-600 text-amber-100 transition-colors disabled:opacity-40 shrink-0"
        >
          {isPending ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
      {testStatus && (
        <p className={`mt-3 text-xs ${testStatus.ok ? 'text-green-400' : 'text-red-400'}`}>
          {testStatus.ok ? '✓ ' : '✕ '}{testStatus.message}
        </p>
      )}
    </div>
  )
}
