'use client'

import { useState, useMemo } from 'react'

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
  const [filter, setFilter] = useState<'all' | 'members'>('all')

  const filtered = useMemo(
    () => filter === 'members' ? registrations.filter((r) => r.isMember) : registrations,
    [registrations, filter]
  )

  const rows = useMemo(
    () =>
      events
        .map((event) => ({
          event,
          regs: filtered.filter((r) => r.eventId === event.id),
          totalTickets: filtered
            .filter((r) => r.eventId === event.id)
            .reduce((s, r) => s + r.memberCount + r.guestCount, 0),
        }))
        .filter((r) => r.regs.length > 0),
    [filtered, events]
  )

  const btnBase = 'px-4 py-1.5 rounded-full text-xs font-semibold transition-colors'
  const btnActive = 'bg-amber-700 text-amber-100'
  const btnInactive = 'bg-stone-800 text-stone-400 hover:bg-stone-700'

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-amber-300">Who's Attending</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`${btnBase} ${filter === 'all' ? btnActive : btnInactive}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('members')}
            className={`${btnBase} ${filter === 'members' ? btnActive : btnInactive}`}
          >
            Members Only
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-stone-600 text-sm text-center py-10">
          {filter === 'members' ? 'No member registrations yet.' : 'No registrations yet.'}
        </p>
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
                    <div className="flex items-center gap-2">
                      <span className="text-stone-200 text-sm">{reg.name}</span>
                      {reg.isMember && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-400 border border-amber-800/40">
                          member
                        </span>
                      )}
                    </div>
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
