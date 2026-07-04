export const dynamic = 'force-dynamic'

import { cookies } from 'next/headers'
import MembersLogin from './MembersLogin'
import MembersDashboard from './MembersDashboard'

export default async function MembersPage() {
  const secret = process.env.MEMBER_SECRET

  if (!secret) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-serif text-2xl text-amber-300 mb-2">Members Area</p>
          <p className="text-stone-500 text-sm">This page is not yet available.</p>
        </div>
      </main>
    )
  }

  const cookieStore = await cookies()
  const auth = cookieStore.get('member_auth')

  if (auth?.value !== secret) {
    return <MembersLogin />
  }

  return <MembersDashboard />
}
