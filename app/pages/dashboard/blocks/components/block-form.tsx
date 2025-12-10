"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { SOCIAL_ICONS_LIST } from "@/lib/social-icons"
import { LocationPicker } from "./location-picker"

interface BlockFormData {
  title: string
  url: string
  type: string
  icon: string
}

interface BlockFormProps {
  block?: {
    id: string
    title: string
    url: string | null
    type: string
    icon: string | null
  } | null
  onClose: () => void
  onSuccess: () => void
}

export function BlockForm({ block, onClose, onSuccess }: BlockFormProps) {
  const [formData, setFormData] = useState<BlockFormData>({
    title: block?.title || "",
    url: block?.url || "",
    type: block?.type || "standard",
    icon: block?.icon || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validation pour les blocs de localisation
    if (formData.type === "location" && !formData.url) {
      setError("Veuillez sélectionner une localisation sur la carte ou rechercher une adresse")
      return
    }

    setLoading(true)

    try {
      const url = block
        ? `/api/blocks/${block.id}/update`
        : "/api/blocks/create"
      const method = block ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          url: formData.url,
          type: formData.type,
          icon: formData.icon || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Une erreur est survenue")
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className={`w-full rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900 my-auto ${
        formData.type === "location" ? "max-w-2xl" : "max-w-md"
      }`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {block ? "Modifier le bloc" : "Nouveau bloc"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Titre *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              placeholder="Mon lien"
            />
          </div>

          {formData.type === "location" ? (
            <LocationPicker
              initialUrl={formData.url || null}
              initialTitle={formData.title}
              onLocationChange={(url, title) => {
                setFormData({
                  ...formData,
                  url,
                  title: title || formData.title,
                })
              }}
            />
          ) : (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                URL *
              </label>
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                placeholder="https://example.com"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            >
              <option value="standard">Lien standard</option>
              <option value="social">Réseau social</option>
              <option value="location">Géolocalisation</option>
            </select>
          </div>


          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Icône
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                placeholder="Emoji ou logo de réseau social"
                maxLength={50}
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                {showEmojiPicker ? "Masquer" : "Choisir"}
              </button>
            </div>
            {showEmojiPicker && (
              <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="mb-3 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Logos de réseaux sociaux
                </p>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                  {SOCIAL_ICONS_LIST.map((item, index) => {
                    const IconComponent = item.icon
                    // Utiliser le nom du réseau social pour déterminer la clé de stockage
                    const storageKey = item.name.toLowerCase().replace("/", "/")
                    return (
                      <button
                        key={`${item.name}-${index}`}
                        type="button"
                        onClick={() => {
                          // Pour Twitter/X, utiliser "twitter/x", sinon utiliser le nom en minuscules
                          const iconKey = item.name === "Twitter/X" ? "twitter/x" : storageKey
                          setFormData({ ...formData, icon: `icon:${iconKey}` })
                          setShowEmojiPicker(false)
                        }}
                        className="group flex flex-col items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 p-2 transition-all hover:border-zinc-400 hover:bg-zinc-100 hover:scale-105 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
                        title={item.name}
                      >
                        <IconComponent 
                          className="text-xl" 
                          style={{ color: item.color }}
                        />
                        <span className="text-[9px] text-zinc-500 dark:text-zinc-400">
                          {item.name.length > 8 ? item.name.substring(0, 8) + "..." : item.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {loading ? "Enregistrement..." : block ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

