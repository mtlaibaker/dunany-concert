import { cookies } from 'next/headers'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin_auth')
  const isAuthenticated =
    !!process.env.ADMIN_SECRET &&
    authCookie?.value === process.env.ADMIN_SECRET

  if (!isAuthenticated) return <AdminLogin />
  return <AdminDashboard />
}
