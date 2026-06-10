import { prisma } from '@/lib/db'
import HomeContent from './HomeContent'

export const dynamic = 'force-dynamic'

async function getEventCounts(): Promise<Record<string, { members: number; guests: number }>> {
  try {
    const grouped = await prisma.registration.groupBy({
      by: ['eventId'],
      _sum: { memberCount: true, guestCount: true },
    })
    const counts: Record<string, { members: number; guests: number }> = {}
    for (const row of grouped) {
      counts[row.eventId] = {
        members: row._sum.memberCount ?? 0,
        guests: row._sum.guestCount ?? 0,
      }
    }
    return counts
  } catch {
    return {}
  }
}

export default async function HomePage() {
  const counts = await getEventCounts()
  return <HomeContent counts={counts} />
}
