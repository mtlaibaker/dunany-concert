'use client'

import { useState, useTransition } from 'react'
import { deleteRegistrationAction, updateRegistrationAction } from './actions'
import { getEventById } from '@/lib/events'
import type { Registration } from '@prisma/client'

const COUNT_OPTIONS = Array.from({ length: 11 }, (_, i) => i)

const inputClass =
  'bg-stone-800 border border-stone-600 rounded px-2 py-1 text-stone-100 text-sm w-full focus:outline-none focus:border-amber-600'

const selectClass =
  'bg-stone-800 border border-stone-600 rounded px-2 py-1 text-stone-100 text-sm focus:outline-none focus:border-amber-600'

interface Props {
  reg: Registration
  striped: boolean
}

export default function RegistrationRow({ reg, striped }: Props) {
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState(reg.name)
  const [email, setEmail] = useState(reg.email ?? '')
  const [phone, setPhone] = useState(reg.phone ?? '')
  const [memberCount, setMemberCount] = useState(reg.memberCount)
  const [guestCount, setGuestCount] = useState(reg.guestCount)

  const event = getEventById(reg.eventId)

  function handleDelete() {
    if (!confirm(`Delete registration for "${reg.name}"?`)) return
    startTransition(async () => {
      await deleteRegistrationAction(reg.id)
    })
  }

  function handleSave() {
    if (!name.trim()) return
    startTransition(async () => {
      await updateRegistrationAction(reg.id, {
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        memberCount,
        guestCount,
      })
      setEditing(false)
    })
  }

  function handleCancel() {
    setName(reg.name)
    setEmail(reg.email ?? '')
    setPhone(reg.phone ?? '')
    setMemberCount(reg.memberCount)
    setGuestCount(reg.guestCount)
    setEditing(false)
  }

  const rowBg = striped ? 'bg-stone-900/30' : ''
  const opacity = isPending ? 'opacity-40' : ''

  if (editing) {
    return (
      <tr className={`${rowBg} ${opacity}`} style={{ borderBottom: '1px solid rgba(60,40,20,0.3)' }}>
        {/* Name */}
        <td className="px-4 py-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Name"
          />
        </td>
        {/* Event (read-only) */}
        <td className="px-4 py-2">
          <span className="text-xs text-stone-500">{event?.date} · {event?.artist ?? reg.eventId}</span>
        </td>
        {/* Contact */}
        <td className="px-4 py-2 space-y-1">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="Email"
            type="email"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="Phone"
            type="tel"
          />
        </td>
        {/* Counts */}
        <td className="px-4 py-2">
          <div className="flex items-center gap-2 text-xs">
            <label className="text-stone-500">Tickets</label>
            <select value={guestCount} onChange={(e) => setGuestCount(parseInt(e.target.value))} className={selectClass}>
              {COUNT_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </td>
        {/* Date (read-only) */}
        <td className="px-4 py-2 text-stone-600 text-xs">
          {new Date(reg.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
        </td>
        {/* Actions */}
        <td className="px-4 py-2">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-3 py-1 rounded text-xs bg-amber-700 hover:bg-amber-600 text-amber-100 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="px-3 py-1 rounded text-xs bg-stone-700 hover:bg-stone-600 text-stone-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className={`${rowBg} ${opacity}`} style={{ borderBottom: '1px solid rgba(60,40,20,0.3)' }}>
      <td className="px-5 py-3 text-stone-200 font-medium">{reg.name}</td>
      <td className="px-5 py-3">
        <div
          className="text-xs inline-flex items-center gap-1.5 px-2 py-1 rounded-full"
          style={{ backgroundColor: event ? `${event.bgColor}99` : undefined, color: event?.textColor }}
        >
          <span>{event?.date}</span>
          <span className="opacity-60">·</span>
          <span>{event?.artist ?? reg.eventId}</span>
        </div>
      </td>
      <td className="px-5 py-3 text-stone-400 text-xs space-y-0.5">
        {reg.email && <div>{reg.email}</div>}
        {reg.phone && <div>{reg.phone}</div>}
      </td>
      <td className="px-5 py-3 text-sm">
        <span className="text-amber-400 font-medium">{reg.memberCount + reg.guestCount}</span>
        <span className="text-stone-600 text-xs"> tickets</span>
      </td>
      <td className="px-5 py-3 text-stone-600 text-xs">
        {new Date(reg.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </td>
      <td className="px-5 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(true)}
            disabled={isPending}
            className="px-3 py-1 rounded text-xs bg-stone-700 hover:bg-stone-600 text-stone-300 disabled:opacity-50"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-3 py-1 rounded text-xs bg-red-900/50 hover:bg-red-900 text-red-400 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}
