import { prisma } from '@/lib/db'
import { getMergedEvents } from '@/lib/eventConfig'
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

async function getContactEmail(): Promise<string> {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { id: 1 } })
    return config?.contactEmail ?? 'Dan_Leblanc13@hotmail.com'
  } catch {
    return 'Dan_Leblanc13@hotmail.com'
  }
}

export default async function HomePage() {
  const [counts, events, contactEmail] = await Promise.all([
    getEventCounts(),
    getMergedEvents(),
    getContactEmail(),
  ])
  return <HomeContent counts={counts} events={events} contactEmail={contactEmail} />
}
