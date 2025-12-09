"use client"

import { useState, useEffect } from "react"
import { Sparkles, Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Settings, X } from "lucide-react"
import { SmartRuleForm } from "./components/smart-rule-form"
import { CustomSourcesModal } from "./components/custom-sources-modal"

interface SmartRule {
  id: string
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

interface CustomTrafficSource {
  name: string
  domains: string[]
}

interface SmartRulesPageClientProps {
  initialRules: SmartRule[]
  initialCustomSources: CustomTrafficSource[]
  blocks: Array<{ id: string; title: string; url: string | null }>
}

export function SmartRulesPageClient({
  initialRules,
  initialCustomSources,
  blocks,
}: SmartRulesPageClientProps) {
  const [rules, setRules] = useState<SmartRule[]>(initialRules)
  const [customSources, setCustomSources] = useState<CustomTrafficSource[]>(initialCustomSources)
  const [editingRule, setEditingRule] = useState<SmartRule | null | undefined>(undefined)
  const [showCustomSourcesModal, setShowCustomSourcesModal] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const refreshRules = async () => {
    const response = await fetch("/api/smart-rules")
    if (response.ok) {
      const data = await response.json()
      setRules(data.rules || [])
    }
  }

  const handleToggleActive = async (rule: SmartRule) => {
    setLoading(rule.id)
    try {
      const response = await fetch(`/api/smart-rules/${rule.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !rule.isActive,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour")
      }

      refreshRules()
    } catch (error) {
      alert("Erreur lors de la mise à jour de la règle")
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (ruleId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette règle ?")) {
      return
    }

    setLoading(ruleId)
    try {
      const response = await fetch(`/api/smart-rules/${ruleId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      refreshRules()
    } catch (error) {
      alert("Erreur lors de la suppression de la règle")
    } finally {
      setLoading(null)
    }
  }

  const handlePriorityChange = async (ruleId: string, direction: "up" | "down") => {
    const rule = rules.find((r) => r.id === ruleId)
    if (!rule) return

    const newPriority = direction === "up" ? rule.priority + 1 : rule.priority - 1

    setLoading(ruleId)
    try {
      const response = await fetch(`/api/smart-rules/${ruleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priority: newPriority,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour")
      }

      refreshRules()
    } catch (error) {
      alert("Erreur lors de la mise à jour de la priorité")
    } finally {
      setLoading(null)
    }
  }

  const formatConditions = (conditions: SmartRule["conditions"]): string => {
    const parts: string[] = []

    if (conditions.trafficSource && conditions.trafficSource.length > 0) {
      parts.push(`Source: ${conditions.trafficSource.join(", ")}`)
    }
    if (conditions.device && conditions.device.length > 0) {
      parts.push(`Appareil: ${conditions.device.join(", ")}`)
    }
    if (conditions.country && conditions.country.length > 0) {
      parts.push(`Pays: ${conditions.country.join(", ")}`)
    }
    if (conditions.timeRange) {
      parts.push(`Heure: ${conditions.timeRange.start} - ${conditions.timeRange.end}`)
    }
    if (conditions.dayOfWeek && conditions.dayOfWeek.length > 0) {
      const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
      parts.push(`Jours: ${conditions.dayOfWeek.map((d) => days[d]).join(", ")}`)
    }
    if (conditions.visitorType) {
      parts.push(`Visiteur: ${conditions.visitorType === "new" ? "Nouveau" : "Retournant"}`)
    }

    return parts.length > 0 ? parts.join(" • ") : "Aucune condition"
  }

  const formatAction = (action: SmartRule["actions"]): string => {
    if (action.type === "show") {
      return `Afficher ${action.blockIds?.length || 0} bloc(s)`
    }
    if (action.type === "hide") {
      return `Masquer ${action.blockIds?.length || 0} bloc(s)`
    }
    if (action.type === "reorder") {
      return `Réordonner ${action.order?.length || 0} bloc(s)`
    }
    return "Aucune action"
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
              Règles intelligentes
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Configurez des règles conditionnelles pour personnaliser l'affichage de vos blocs
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCustomSourcesModal(true)}
              className="flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              <Settings className="h-4 w-4" />
              Réseaux personnalisés
            </button>
            <button
              onClick={() => setEditingRule(null as any)}
              className="flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
              Nouvelle règle
            </button>
          </div>
        </div>

        {rules.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <Sparkles className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
            <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
              Aucune règle configurée
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Créez des règles pour personnaliser l'affichage de vos blocs selon différents critères
            </p>
            <button
              onClick={() => setEditingRule({} as SmartRule)}
              className="rounded-md bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Créer votre première règle
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`rounded-lg border p-4 sm:p-6 ${
                  rule.isActive
                    ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                    : "border-zinc-200 bg-zinc-50 opacity-60 dark:border-zinc-800 dark:bg-zinc-900"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-black dark:text-white">{rule.name}</h3>
                      <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        Priorité: {rule.priority}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      <strong>Conditions:</strong> {formatConditions(rule.conditions)}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      <strong>Action:</strong> {formatAction(rule.actions)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handlePriorityChange(rule.id, "up")}
                      disabled={loading === rule.id}
                      className="rounded-md border border-zinc-300 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      title="Augmenter la priorité"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePriorityChange(rule.id, "down")}
                      disabled={loading === rule.id}
                      className="rounded-md border border-zinc-300 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      title="Diminuer la priorité"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(rule)}
                      disabled={loading === rule.id}
                      className="rounded-md border border-zinc-300 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      title={rule.isActive ? "Désactiver" : "Activer"}
                    >
                      {rule.isActive ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingRule(rule as SmartRule | null)}
                      disabled={loading === rule.id}
                      className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium text-black transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      disabled={loading === rule.id}
                      className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-zinc-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingRule !== undefined && (
        <SmartRuleForm
          rule={editingRule}
          blocks={blocks}
          customTrafficSources={customSources}
          onClose={() => setEditingRule(undefined)}
          onSuccess={() => {
            setEditingRule(undefined)
            refreshRules()
          }}
        />
      )}

      {showCustomSourcesModal && (
        <CustomSourcesModal
          customSources={customSources}
          onClose={() => setShowCustomSourcesModal(false)}
          onSave={async (sources) => {
            const response = await fetch("/api/user-page/custom-traffic-sources", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ customSources: sources }),
            })
            if (response.ok) {
              setCustomSources(sources)
              setShowCustomSourcesModal(false)
            } else {
              alert("Erreur lors de la sauvegarde")
            }
          }}
        />
      )}
    </div>
  )
}

