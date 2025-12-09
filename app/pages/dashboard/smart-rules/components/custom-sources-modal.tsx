"use client"

import { useState } from "react"
import { X, Plus, Trash2 } from "lucide-react"

interface CustomTrafficSource {
  name: string
  domains: string[]
}

interface CustomSourcesModalProps {
  customSources: CustomTrafficSource[]
  onClose: () => void
  onSave: (sources: CustomTrafficSource[]) => void
}

export function CustomSourcesModal({
  customSources: initialSources,
  onClose,
  onSave,
}: CustomSourcesModalProps) {
  const [sources, setSources] = useState<CustomTrafficSource[]>(initialSources)
  const [newSourceName, setNewSourceName] = useState("")
  const [newSourceDomains, setNewSourceDomains] = useState("")

  const handleAddSource = () => {
    if (!newSourceName.trim()) {
      alert("Le nom est requis")
      return
    }
    if (!newSourceDomains.trim()) {
      alert("Au moins un domaine est requis")
      return
    }

    const domains = newSourceDomains
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0)

    if (domains.length === 0) {
      alert("Au moins un domaine valide est requis")
      return
    }

    // Check if name already exists
    if (sources.some((s) => s.name.toLowerCase() === newSourceName.toLowerCase())) {
      alert("Ce nom existe déjà")
      return
    }

    setSources([...sources, { name: newSourceName.trim(), domains }])
    setNewSourceName("")
    setNewSourceDomains("")
  }

  const handleRemoveSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    onSave(sources)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Réseaux personnalisés
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              Ajoutez vos propres réseaux sociaux ou sources de trafic. Utilisez le nom du réseau
              et les domaines associés (séparés par des virgules).
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Nom du réseau (ex: Discord, Twitch)"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black placeholder-zinc-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400 dark:focus:border-white dark:focus:ring-white"
                />
                <input
                  type="text"
                  placeholder="Domaines (ex: discord.com, discord.gg)"
                  value={newSourceDomains}
                  onChange={(e) => setNewSourceDomains(e.target.value)}
                  className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black placeholder-zinc-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400 dark:focus:border-white dark:focus:ring-white"
                />
                <button
                  onClick={handleAddSource}
                  className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-black dark:text-white">
              Réseaux personnalisés ({sources.length})
            </h3>
            {sources.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Aucun réseau personnalisé ajouté
              </p>
            ) : (
              <div className="space-y-2">
                {sources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50"
                  >
                    <div>
                      <div className="font-medium text-black dark:text-white">{source.name}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">
                        {source.domains.join(", ")}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveSource(index)}
                      className="rounded-md p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-zinc-200 p-6 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}

