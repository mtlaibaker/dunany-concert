'use client'

import { useMemo } from 'react'

export interface AttendeeReg {
  id: string
  eventId: string
  name: string
  memberCount: number
  guestCount: number
  isMember: boolean
}

export interface AttendeeEvent {
  id: string
  artist: string
  date: string
  bgColor: string
  textColor: string
  borderColor: string
}

interface Props {
  registrations: AttendeeReg[]
  events: AttendeeEvent[]
}

export default function AttendeesPanel({ registrations, events }: Props) {
  const memberRegs = useMemo(
    () => registrations.filter((r) => r.isMember),
    [registrations]
  )

  const rows = useMemo(
    () =>
      events
        .map((event) => ({
          event,
          regs: memberRegs.filter((r) => r.eventId === event.id),
          totalTickets: memberRegs
            .filter((r) => r.eventId === event.id)
            .reduce((s, r) => s + r.memberCount + r.guestCount, 0),
        }))
        .filter((r) => r.regs.length > 0),
    [memberRegs, events]
  )

  return (
    <div>
      <h2 className="font-serif text-xl text-amber-300 mb-4">Who's Attending</h2>

      {rows.length === 0 ? (
        <p className="text-stone-600 text-sm text-center py-10">No member registrations yet.</p>
      ) : (
        <div className="space-y-4">
          {rows.map(({ event, regs, totalTickets }) => (
            <div
              key={event.id}
              className="rounded-xl overflow-hidden"
              style={{ border: `1px solid ${event.borderColor}44` }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: event.bgColor }}
              >
                <div>
                  <p className="font-serif font-bold" style={{ color: event.textColor }}>
                    {event.artist}
                  </p>
                  <p className="text-xs opacity-75" style={{ color: event.textColor }}>
                    {event.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg" style={{ color: event.textColor }}>{regs.length}</p>
                  <p className="text-xs opacity-60" style={{ color: event.textColor }}>
                    {regs.length === 1 ? 'registration' : 'registrations'} · {totalTickets} tickets
                  </p>
                </div>
              </div>

              <div style={{ background: 'rgba(18,10,5,0.9)' }}>
                {regs.map((reg, i) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between px-4 py-2.5"
                    style={{ borderTop: i > 0 ? '1px solid rgba(60,40,20,0.3)' : undefined }}
                  >
                    <span className="text-stone-200 text-sm">{reg.name}</span>
                    <span className="text-stone-500 text-xs">
                      {reg.memberCount + reg.guestCount}{' '}
                      {reg.memberCount + reg.guestCount === 1 ? 'ticket' : 'tickets'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
