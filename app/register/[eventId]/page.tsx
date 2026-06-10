import { notFound } from 'next/navigation'
import { getEventById, EVENTS } from '@/lib/events'
import RegisterPageContent from './RegisterPageContent'

interface Props {
  params: Promise<{ eventId: string }>
}

export function generateStaticParams() {
  return EVENTS.map((e) => ({ eventId: e.id }))
}

export default async function RegisterPage({ params }: Props) {
  const { eventId } = await params
  const event = getEventById(eventId)
  if (!event) notFound()

  return <RegisterPageContent event={event} />
}
