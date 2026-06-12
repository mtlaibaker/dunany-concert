'use client'

import { useState, useTransition, useEffect } from 'react'
import { updateEventConfigAction, resetEventConfigAction } from './actions'
import type { ConcertEvent } from '@/lib/events'

interface Props {
  event: ConcertEvent
  ticketCount: number
}

const inputClass =
  'w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 text-sm focus:outline-none focus:border-amber-600 transition-colors'

const labelClass = 'block text-xs text-stone-400 mb-1'

export default function EventEditorButton({ event, ticketCount }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [artist, setArtist] = useState(event.artist)
  const [isoDate, setIsoDate] = useState(event.tbd ? '' : event.isoDate)
  const [tbd, setTbd] = useState(event.tbd ?? false)
  const [genre, setGenre] = useState(event.genre ?? '')
  const [genreFr, setGenreFr] = useState(event.genreFr ?? '')
  const [maxCapacity, setMaxCapacity] = useState(event.maxCapacity?.toString() ?? '')

  useEffect(() => {
    setArtist(event.artist)
    setIsoDate(event.tbd ? '' : event.isoDate)
    setTbd(event.tbd ?? false)
    setGenre(event.genre ?? '')
    setGenreFr(event.genreFr ?? '')
    setMaxCapacity(event.maxCapacity?.toString() ?? '')
  }, [event])

  function handleSave() {
    startTransition(async () => {
      await updateEventConfigAction(event.id, {
        artist: artist.trim() || null,
        isoDate: tbd ? null : (isoDate || null),
        genre: genre.trim() || null,
        genreFr: genreFr.trim() || null,
        tbd,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : null,
      })
      setOpen(false)
    })
  }

  function handleReset() {
    if (!confirm(`Reset "${event.artist}" to default values? This cannot be undone.`)) return
    startTransition(async () => {
      await resetEventConfigAction(event.id)
      setOpen(false)
    })
  }

  const isFull = event.maxCapacity != null && ticketCount >= event.maxCapacity

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={() => !isPending && setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl p-6 shadow-2xl"
            style={{ background: 'rgba(18,10,5,0.98)', border: '1px solid rgba(120,80,30,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-lg text-amber-300">Edit Event</h3>
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="text-stone-500 hover:text-stone-200 transition-colors text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Artist / Title */}
              <div>
                <label className={labelClass}>Artist / Title</label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className={inputClass}
                  placeholder="Artist or event name"
                />
              </div>

              {/* TBD toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tbd}
                  onChange={(e) => setTbd(e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-600"
                />
                <span className="text-sm text-stone-300">Date TBD (hides registration)</span>
              </label>

              {/* Date */}
              <div>
                <label className={labelClass}>Date</label>
                <input
                  type="date"
                  value={isoDate}
                  onChange={(e) => setIsoDate(e.target.value)}
                  disabled={tbd}
                  className={`${inputClass} disabled:opacity-40 disabled:cursor-not-allowed`}
                />
                <p className="text-xs text-stone-600 mt-1">EN and FR display dates are auto-generated from this.</p>
              </div>

              {/* Description */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Description (EN)</label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Roots Music"
                  />
                </div>
                <div>
                  <label className={labelClass}>Description (FR)</label>
                  <input
                    type="text"
                    value={genreFr}
                    onChange={(e) => setGenreFr(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Musique roots"
                  />
                </div>
              </div>

              {/* Max Capacity */}
              <div>
                <label className={labelClass}>Max Capacity (leave blank for no limit)</label>
                <input
                  type="number"
                  min="0"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 100"
                />
                {event.maxCapacity != null && (
                  <p className="text-xs text-stone-600 mt-1">
                    Currently {ticketCount} / {event.maxCapacity} tickets sold
                    {isFull && <span className="text-red-400 ml-1">— FULL</span>}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-800">
              <button
                onClick={handleReset}
                disabled={isPending}
                className="text-xs text-stone-600 hover:text-stone-400 transition-colors disabled:opacity-40"
              >
                Reset to defaults
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg text-sm bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-amber-700 hover:bg-amber-600 text-amber-100 transition-colors disabled:opacity-40"
                >
                  {isPending ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(true)}
        className="w-full text-left rounded-xl p-4 transition-all hover:ring-1 hover:ring-amber-700/50"
        style={{
          background: 'rgba(26,16,10,0.7)',
          border: `1px solid rgba(120,80,30,0.2)`,
          borderLeftColor: event.borderColor,
          borderLeftWidth: '3px',
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-stone-500 uppercase tracking-wider mb-0.5">
              {event.tbd ? 'TBD' : event.date}
            </p>
            <p className="text-stone-200 text-sm font-medium leading-tight">{event.artist}</p>
            {event.genre && <p className="text-stone-600 text-xs mt-0.5 italic">{event.genre}</p>}
          </div>
          <div className="text-right shrink-0">
            <p className="text-amber-400 font-bold text-sm">
              {ticketCount}
              {event.maxCapacity != null && <span className="text-stone-600 font-normal"> / {event.maxCapacity}</span>}
            </p>
            <p className="text-stone-600 text-xs">tickets</p>
          </div>
        </div>
        <p className="text-xs text-amber-800 mt-2">✎ Click to edit</p>
      </button>
    </>
  )
}
