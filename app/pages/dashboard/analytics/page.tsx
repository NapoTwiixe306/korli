"use client"

import { useEffect, useState } from "react"
import { AnalyticsFilters } from "@/app/pages/dashboard/analytics/components/analytics-filters"
import { AdvancedAnalytics } from "@/app/pages/dashboard/analytics/components/advanced-analytics"

export default function AnalyticsPage() {
  const [range, setRange] = useState<{ start?: string; end?: string }>({})

  useEffect(() => {
    // default: last 7 days
    if (!range.start && !range.end) {
      const end = new Date()
      const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      setRange({ start: start.toISOString(), end: end.toISOString() })
    }
  }, [range.start, range.end])

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">Analytics</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Suivez les performances de votre page
            </p>
          </div>
          <AnalyticsFilters range={range} onChange={setRange} />
        </div>

        {range.start && range.end ? (
          <AdvancedAnalytics start={range.start} end={range.end} />
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            Chargement des dates…
          </div>
        )}
      </div>
    </div>
  )
}

