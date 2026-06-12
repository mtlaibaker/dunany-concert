import { notFound } from 'next/navigation'
import { EVENTS } from '@/lib/events'
import { getMergedEvent, getTicketCount } from '@/lib/eventConfig'
import RegisterPageContent from './RegisterPageContent'

interface Props {
  params: Promise<{ eventId: string }>
}

export function generateStaticParams() {
  return EVENTS.map((e) => ({ eventId: e.id }))
}

export const dynamic = 'force-dynamic'

export default async function RegisterPage({ params }: Props) {
  const { eventId } = await params
  const [event, ticketCount] = await Promise.all([
    getMergedEvent(eventId),
    getTicketCount(eventId),
  ])
  if (!event) notFound()

  return <RegisterPageContent event={event} ticketCount={ticketCount} />
}
