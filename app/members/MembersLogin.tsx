'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { memberLoginAction } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 rounded-lg font-semibold bg-amber-700 hover:bg-amber-600 text-amber-100 transition-colors disabled:opacity-50 text-sm"
    >
      {pending ? 'Signing in…' : 'Sign In'}
    </button>
  )
}

export default function MembersLogin() {
  const [state, formAction] = useFormState(memberLoginAction, null)

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-amber-600 text-xs uppercase tracking-widest mb-2">Dunany Country Club</p>
          <h1 className="font-serif text-3xl text-amber-300">Members Area</h1>
          <p className="text-stone-500 text-sm mt-2">Sign in to see who's attending</p>
        </div>

        <div
          className="rounded-xl p-6"
          style={{ background: 'rgba(26,16,10,0.85)', border: '1px solid rgba(120,80,30,0.3)' }}
        >
          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1.5" htmlFor="password">
                Member Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full bg-stone-800/70 border border-stone-600/60 rounded-lg px-3.5 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-colors"
                placeholder="Enter member password"
              />
            </div>

            {state?.error && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-lg px-4 py-2.5">
                {state.error}
              </p>
            )}

            <SubmitButton />
          </form>
        </div>
      </div>
    </main>
  )
}
