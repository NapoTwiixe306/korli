"use client"

import { useState } from "react"

interface Props {
  range: { start?: string; end?: string }
  onChange: (range: { start?: string; end?: string }) => void
}

export function AnalyticsFilters({ range, onChange }: Props) {
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")

  const setPreset = (days: number) => {
    const end = new Date()
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    onChange({ start: start.toISOString(), end: end.toISOString() })
  }

  const applyCustom = () => {
    if (customStart && customEnd) {
      onChange({ start: new Date(customStart).toISOString(), end: new Date(customEnd).toISOString() })
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-800 dark:text-white dark:border-zinc-700 dark:bg-zinc-900"
        onClick={() => setPreset(7)}
      >
        7 jours
      </button>
      <button
        className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-800 dark:text-white dark:border-zinc-700 dark:bg-zinc-900"
        onClick={() => setPreset(30)}
      >
        30 jours
      </button>
      <div className="flex items-center gap-2">
        <input
          type="date"
          className="rounded-md border border-zinc-200 px-2 py-1 text-sm text-zinc-800 placeholder:text-zinc-500 dark:text-white dark:placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
          value={customStart}
          onChange={(e) => setCustomStart(e.target.value)}
        />
        <span className="text-xs text-zinc-500">→</span>
        <input
          type="date"
          className="rounded-md border border-zinc-200 px-2 py-1 text-sm text-zinc-800 placeholder:text-zinc-500 dark:text-white dark:placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
          value={customEnd}
          onChange={(e) => setCustomEnd(e.target.value)}
        />
        <button
          className="rounded-md bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
          onClick={applyCustom}
        >
          Appliquer
        </button>
      </div>
    </div>
  )
}
