import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { getEventById } from '@/lib/events'

export async function GET() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin_auth')

  if (
    !process.env.ADMIN_SECRET ||
    !authCookie ||
    authCookie.value !== process.env.ADMIN_SECRET
  ) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const registrations = await prisma.registration.findMany({
    orderBy: [{ eventId: 'asc' }, { createdAt: 'asc' }],
  })

  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`

  const header = 'Name,Event,Date,Email,Phone,Type,Registered At\n'
  const rows = registrations
    .map((r) => {
      const event = getEventById(r.eventId)
      return [
        escape(r.name),
        escape(event?.artist ?? r.eventId),
        event?.date ?? '',
        r.email ? escape(r.email) : '',
        r.phone ? escape(r.phone) : '',
        r.isMember ? 'Member' : 'Guest',
        new Date(r.createdAt).toISOString(),
      ].join(',')
    })
    .join('\n')

  return new NextResponse(header + rows, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="dunany-registrations.csv"',
    },
  })
}
