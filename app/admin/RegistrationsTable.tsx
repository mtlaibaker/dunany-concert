'use client'

import { useState, useMemo } from 'react'
import RegistrationRow from './RegistrationRow'

export interface RegistrationData {
  id: string
  eventId: string
  name: string
  email: string | null
  phone: string | null
  memberCount: number
  guestCount: number
  isMember: boolean
  createdAt: string
}

export interface EventSummary {
  id: string
  artist: string
  date: string
  isoDate: string
  bgColor: string
  textColor: string
  borderColor: string
}

type SortField = 'name' | 'event' | 'date'
type SortDir = 'asc' | 'desc'

interface Props {
  registrations: RegistrationData[]
  events: EventSummary[]
}

function SortButton({
  field,
  active,
  dir,
  onClick,
  children,
}: {
  field: SortField
  active: boolean
  dir: SortDir
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 hover:text-stone-200 transition-colors group"
    >
      {children}
      <span className={`text-xs transition-colors ${active ? 'text-amber-500' : 'text-stone-700 group-hover:text-stone-500'}`}>
        {active ? (dir === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </button>
  )
}

export default function RegistrationsTable({ registrations, events }: Props) {
  const [nameFilter, setNameFilter] = useState('')
  const [eventFilter, setEventFilter] = useState('')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const eventMap = useMemo(
    () => Object.fromEntries(events.map((e) => [e.id, e])),
    [events]
  )

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    let result = registrations

    if (nameFilter.trim()) {
      const q = nameFilter.toLowerCase()
      result = result.filter((r) => r.name.toLowerCase().includes(q))
    }

    if (eventFilter) {
      result = result.filter((r) => r.eventId === eventFilter)
    }

    return [...result].sort((a, b) => {
      let cmp = 0
      if (sortField === 'name') {
        cmp = a.name.localeCompare(b.name)
      } else if (sortField === 'event') {
        const ea = eventMap[a.eventId]?.isoDate ?? a.eventId
        const eb = eventMap[b.eventId]?.isoDate ?? b.eventId
        cmp = ea.localeCompare(eb)
      } else {
        cmp = a.createdAt.localeCompare(b.createdAt)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [registrations, nameFilter, eventFilter, sortField, sortDir, eventMap])

  function downloadCSV() {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`
    const header = 'Name,Event,Date,Email,Phone,Tickets,Registered At'
    const rows = filtered.map((r) => {
      const ev = eventMap[r.eventId]
      return [
        esc(r.name),
        esc(ev?.artist ?? r.eventId),
        ev?.date ?? '',
        r.email ? esc(r.email) : '',
        r.phone ? esc(r.phone) : '',
        r.memberCount + r.guestCount,
        r.createdAt,
      ].join(',')
    })
    const csv = '﻿' + [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dunany-registrations.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const isFiltered = !!(nameFilter || eventFilter)
  const inputClass =
    'bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-stone-200 text-sm focus:outline-none focus:border-amber-600 transition-colors'
  const thClass = 'text-left px-5 py-3 text-stone-500 font-medium text-xs uppercase tracking-wider'

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(26,16,10,0.7)', border: '1px solid rgba(120,80,30,0.2)' }}
    >
      {/* Header + filters */}
      <div className="px-6 py-4 border-b border-stone-800/60">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="font-serif text-lg text-amber-300 mb-3">All Registrations</h2>
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs text-stone-500 mb-1">Filter by name</label>
                <input
                  type="text"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="Search…"
                  className={`${inputClass} w-40`}
                />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Filter by event</label>
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className={inputClass}
                >
                  <option value="">All events</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>{e.artist}</option>
                  ))}
                </select>
              </div>
              {isFiltered && (
                <button
                  onClick={() => { setNameFilter(''); setEventFilter('') }}
                  className="text-xs text-stone-600 hover:text-stone-300 transition-colors pb-0.5"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>
          <button
            onClick={downloadCSV}
            className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm transition-colors shrink-0"
          >
            ↓ Export CSV{isFiltered && <span className="text-amber-600 ml-1">(filtered)</span>}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-800/60">
              <th className={thClass}>
                <SortButton field="name" active={sortField === 'name'} dir={sortDir} onClick={() => handleSort('name')}>
                  Name
                </SortButton>
              </th>
              <th className={thClass}>
                <SortButton field="event" active={sortField === 'event'} dir={sortDir} onClick={() => handleSort('event')}>
                  Event
                </SortButton>
              </th>
              <th className={thClass}>Contact</th>
              <th className={thClass}>Tickets</th>
              <th className={thClass}>
                <SortButton field="date" active={sortField === 'date'} dir={sortDir} onClick={() => handleSort('date')}>
                  Registered
                </SortButton>
              </th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-stone-600">
                  {isFiltered ? 'No registrations match the current filters.' : 'No registrations yet.'}
                </td>
              </tr>
            ) : (
              filtered.map((reg, i) => (
                <RegistrationRow key={reg.id} reg={reg} striped={i % 2 !== 0} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-stone-800/40">
        <p className="text-xs text-stone-600">
          Showing {filtered.length} of {registrations.length} registration{registrations.length !== 1 ? 's' : ''}
          {isFiltered && ' (filtered)'}
        </p>
      </div>
    </div>
  )
}
