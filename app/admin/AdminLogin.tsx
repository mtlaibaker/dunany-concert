'use client'

import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { loginAction } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-lg font-semibold bg-amber-700 hover:bg-amber-600 text-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    >
      {pending ? 'Verifying…' : 'Sign In'}
    </button>
  )
}

export default function AdminLogin() {
  const router = useRouter()
  const [state, formAction] = useFormState(loginAction, null)

  useEffect(() => {
    if (state?.success) router.refresh()
  }, [state, router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-amber-300">Admin Access</h1>
          <p className="text-stone-500 text-sm mt-1">Dunany Country Club</p>
        </div>
        <form
          action={formAction}
          className="space-y-4 rounded-xl p-6"
          style={{
            background: 'rgba(26,16,10,0.85)',
            border: '1px solid rgba(120,80,30,0.3)',
          }}
        >
          <div>
            <label className="block text-sm text-stone-300 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-stone-800/70 border border-stone-600/60 rounded-lg px-3.5 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-colors"
              placeholder="Enter admin password"
            />
          </div>
          {state?.error && (
            <p className="text-red-400 text-sm">{state.error}</p>
          )}
          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
