"use client"

import { useEffect, useState } from "react"

interface BreakdownRow {
  label: string
  count: number
}

interface VariantRow {
  variant: string
  views: number
  clicks: number
  ctr: number
}

interface Data {
  range: { start: string; end: string }
  totals: { views: number; clicks: number; ctr: number; uniqueViews: number; uniqueClicks: number }
  breakdowns: { sources: BreakdownRow[]; devices: BreakdownRow[]; countries: BreakdownRow[] }
  variants: VariantRow[]
}

export function AdvancedAnalytics({ start, end }: { start: string; end: string }) {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ start, end })
        const res = await fetch(`/api/analytics/advanced?${params.toString()}`)
        if (!res.ok) throw new Error("Erreur de chargement")
        const json = (await res.json()) as Data
        setData(json)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [start, end])

  const handleExportCsv = async () => {
    try {
      setDownloading(true)
      const params = new URLSearchParams({ start, end, format: "csv" })
      const res = await fetch(`/api/analytics/advanced?${params.toString()}`)
      if (!res.ok) throw new Error("Export CSV indisponible")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `analytics-${start}-${end}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
        Chargement…
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
        {error || "Impossible de charger les données"}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Période : {new Date(data.range.start).toLocaleDateString()} →{" "}
            {new Date(data.range.end).toLocaleDateString()}
          </div>
          <button
            onClick={handleExportCsv}
            disabled={downloading}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          >
            {downloading ? "Export..." : "Exporter en CSV"}
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Vues" value={data.totals.views} />
        <StatCard label="Clics" value={data.totals.clicks} />
        <StatCard label="Uniques (vues)" value={data.totals.uniqueViews} />
        <StatCard label="CTR" value={`${data.totals.ctr}%`} />
      </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Breakdown title="Sources" rows={data.breakdowns.sources} />
        <Breakdown title="Appareils" rows={data.breakdowns.devices} />
        <Breakdown title="Pays" rows={data.breakdowns.countries} />
      </div>

      <VariantsTable variants={data.variants} />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">{label}</div>
      <div className="mt-2 text-3xl font-bold text-black dark:text-white">{value}</div>
    </div>
  )
}

function Breakdown({ title, rows }: { title: string; rows: BreakdownRow[] }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Aucune donnée</p>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">{row.label}</span>
              <span className="font-medium text-black dark:text-white">{row.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function VariantsTable({ variants }: { variants: VariantRow[] }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">A/B testing</h3>
      {variants.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Aucune variante servie</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 dark:text-zinc-400">
                <th className="py-2">Variante</th>
                <th className="py-2">Vues</th>
                <th className="py-2">Clics</th>
                <th className="py-2">CTR</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v.variant} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="py-2 font-medium text-black dark:text-white">{v.variant}</td>
                  <td className="py-2">{v.views}</td>
                  <td className="py-2">{v.clicks}</td>
                  <td className="py-2">{v.ctr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
