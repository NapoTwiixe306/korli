"use client"

import { useState, useEffect } from "react"
import { X, Save } from "lucide-react"

interface SmartRule {
  id?: string
  name: string
  isActive: boolean
  priority: number
  conditions: {
    trafficSource?: string[]
    device?: string[]
    country?: string[]
    timeRange?: { start: string; end: string }
    dayOfWeek?: number[]
    visitorType?: "new" | "returning"
  }
  actions: {
    type: "show" | "hide" | "reorder"
    blockIds?: string[]
    order?: (string | number)[]
  }
}

interface SmartRuleFormProps {
  rule: SmartRule | null
  blocks: Array<{ id: string; title: string; url: string | null }>
  onClose: () => void
  onSuccess: () => void
}

const TRAFFIC_SOURCES = [
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter/X" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "pinterest", label: "Pinterest" },
  { value: "snapchat", label: "Snapchat" },
  { value: "google", label: "Google" },
  { value: "direct", label: "Direct" },
]

const DAYS_OF_WEEK = [
  { value: 0, label: "Dimanche" },
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
]

export function SmartRuleForm({ rule, blocks, onClose, onSuccess }: SmartRuleFormProps) {
  const conditions = rule?.conditions || {}
  const actions = rule?.actions || { type: "show" }
  
  const [name, setName] = useState(rule?.name || "")
  const [isActive, setIsActive] = useState(rule?.isActive ?? true)
  const [priority, setPriority] = useState(rule?.priority ?? 0)
  const [trafficSources, setTrafficSources] = useState<string[]>(conditions.trafficSource || [])
  const [devices, setDevices] = useState<string[]>(conditions.device || [])
  const [timeRange, setTimeRange] = useState<{ start: string; end: string } | null>(
    conditions.timeRange || null
  )
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(conditions.dayOfWeek || [])
  const [visitorType, setVisitorType] = useState<"new" | "returning" | undefined>(
    conditions.visitorType
  )
  const [actionType, setActionType] = useState<"show" | "hide" | "reorder">(
    actions.type || "show"
  )
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>(
    actions.blockIds || []
  )
  const [reorderBlockIds, setReorderBlockIds] = useState<string[]>(
    (actions.order || []).map(String)
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      alert("Le nom de la règle est requis")
      return
    }

    setLoading(true)
    try {
      const conditions: SmartRule["conditions"] = {}
      if (trafficSources.length > 0) conditions.trafficSource = trafficSources
      if (devices.length > 0) conditions.device = devices
      if (timeRange) conditions.timeRange = timeRange
      if (daysOfWeek.length > 0) conditions.dayOfWeek = daysOfWeek
      if (visitorType) conditions.visitorType = visitorType

      const actions: SmartRule["actions"] = {
        type: actionType,
      }
      if (actionType === "show" || actionType === "hide") {
        actions.blockIds = selectedBlockIds
      } else if (actionType === "reorder") {
        actions.order = reorderBlockIds.map((id) => id)
      }

      const url = rule?.id ? `/api/smart-rules/${rule.id}` : "/api/smart-rules"
      const method = rule?.id ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          isActive,
          priority,
          conditions,
          actions,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      onSuccess()
      onClose()
    } catch (error) {
      alert("Erreur lors de la sauvegarde de la règle")
    } finally {
      setLoading(false)
    }
  }

  const toggleTrafficSource = (source: string) => {
    setTrafficSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    )
  }

  const toggleDevice = (device: string) => {
    setDevices((prev) =>
      prev.includes(device) ? prev.filter((d) => d !== device) : [...prev, device]
    )
  }

  const toggleDayOfWeek = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const toggleBlock = (blockId: string) => {
    if (actionType === "reorder") {
      setReorderBlockIds((prev) =>
        prev.includes(blockId)
          ? prev.filter((id) => id !== blockId)
          : [...prev, blockId]
      )
    } else {
      setSelectedBlockIds((prev) =>
        prev.includes(blockId)
          ? prev.filter((id) => id !== blockId)
          : [...prev, blockId]
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {rule?.id ? "Modifier la règle" : "Nouvelle règle"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom et priorité */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Nom de la règle *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                placeholder="Ex: Afficher TikTok sur mobile"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Priorité
              </label>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                min="0"
              />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Plus la priorité est élevée, plus la règle est appliquée en premier
              </p>
            </div>
          </div>

          {/* Conditions */}
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
              Conditions
            </h3>

            {/* Source du trafic */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Source du trafic
              </label>
              <div className="flex flex-wrap gap-2">
                {TRAFFIC_SOURCES.map((source) => (
                  <button
                    key={source.value}
                    type="button"
                    onClick={() => toggleTrafficSource(source.value)}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      trafficSources.includes(source.value)
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "border border-zinc-300 bg-white text-black hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                    }`}
                  >
                    {source.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Device */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Device
              </label>
              <div className="flex gap-2">
                {["mobile", "desktop"].map((device) => (
                  <button
                    key={device}
                    type="button"
                    onClick={() => toggleDevice(device)}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      devices.includes(device)
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "border border-zinc-300 bg-white text-black hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                    }`}
                  >
                    {device === "mobile" ? "Mobile" : "Desktop"}
                  </button>
                ))}
              </div>
            </div>

            {/* Plage horaire */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Plage horaire (optionnel)
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={timeRange?.start || ""}
                  onChange={(e) =>
                    setTimeRange({
                      start: e.target.value,
                      end: timeRange?.end || "23:59",
                    })
                  }
                  className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                />
                <span className="flex items-center text-zinc-600 dark:text-zinc-400">à</span>
                <input
                  type="time"
                  value={timeRange?.end || ""}
                  onChange={(e) =>
                    setTimeRange({
                      start: timeRange?.start || "00:00",
                      end: e.target.value,
                    })
                  }
                  className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                />
                {timeRange && (
                  <button
                    type="button"
                    onClick={() => setTimeRange(null)}
                    className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-zinc-600 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>

            {/* Jours de la semaine */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Jours de la semaine
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDayOfWeek(day.value)}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      daysOfWeek.includes(day.value)
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "border border-zinc-300 bg-white text-black hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type de visiteur */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Type de visiteur
              </label>
              <div className="flex gap-2">
                {[
                  { value: "new", label: "Nouveau" },
                  { value: "returning", label: "Retournant" },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setVisitorType(
                        visitorType === type.value ? undefined : (type.value as "new" | "returning")
                      )
                    }
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      visitorType === type.value
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "border border-zinc-300 bg-white text-black hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">Action</h3>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Type d'action
              </label>
              <div className="flex gap-2">
                {[
                  { value: "show", label: "Afficher" },
                  { value: "hide", label: "Masquer" },
                  { value: "reorder", label: "Réordonner" },
                ].map((action) => (
                  <button
                    key={action.value}
                    type="button"
                    onClick={() => setActionType(action.value as "show" | "hide" | "reorder")}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      actionType === action.value
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "border border-zinc-300 bg-white text-black hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sélection des blocs */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                {actionType === "reorder"
                  ? "Ordre des blocs (glissez pour réordonner)"
                  : "Sélectionnez les blocs"}
              </label>
              <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
                {blocks.map((block) => {
                  const isSelected =
                    actionType === "reorder"
                      ? reorderBlockIds.includes(block.id)
                      : selectedBlockIds.includes(block.id)
                  return (
                    <label
                      key={block.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-md border p-2 transition-colors ${
                        isSelected
                          ? "border-black bg-zinc-100 dark:border-white dark:bg-zinc-800"
                          : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleBlock(block.id)}
                        className="rounded border-zinc-300"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-black dark:text-white">{block.title}</div>
                        {block.url && (
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                            {block.url}
                          </div>
                        )}
                      </div>
                      {actionType === "reorder" && isSelected && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          #{reorderBlockIds.indexOf(block.id) + 1}
                        </span>
                      )}
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Actif */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-zinc-300"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-black dark:text-white">
              Règle active
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              <Save className="h-4 w-4" />
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

