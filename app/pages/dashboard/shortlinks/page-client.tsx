"use client"

import { useState, useEffect } from "react"
import { Link2, Plus, Trash2, Copy, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { CopyButton } from "../components/copy-button"

interface Shortlink {
  id: string
  alias: string
  url: string
  clicks: number
  createdAt: string
}

interface ShortlinkFormProps {
  onClose: () => void
  onSuccess: () => void
}

function ShortlinkForm({ onClose, onSuccess }: ShortlinkFormProps) {
  const [url, setUrl] = useState("")
  const [alias, setAlias] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/shortlinks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          alias: alias || undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
          Nouveau shortlink
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              URL *
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Alias (optionnel)
            </label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              placeholder="mon-lien"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Laissé vide, un alias sera généré automatiquement
            </p>
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
              {loading ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface ShortlinksPageClientProps {
  initialShortlinks: Shortlink[]
}

export function ShortlinksPageClient({
  initialShortlinks,
}: ShortlinksPageClientProps) {
  const [shortlinks, setShortlinks] = useState<Shortlink[]>(initialShortlinks)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const refreshShortlinks = async () => {
    const response = await fetch("/api/shortlinks")
    if (response.ok) {
      const data = await response.json()
      setShortlinks(data.shortlinks || [])
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce shortlink ?")) {
      return
    }

    setLoading(id)
    try {
      const response = await fetch(`/api/shortlinks/${id}/delete`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      refreshShortlinks()
    } catch (error) {
      alert("Erreur lors de la suppression du shortlink")
    } finally {
      setLoading(null)
    }
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Shortlinks
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Créez, suivez et gérez vos liens courts
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-md bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4" />
            Nouveau lien
          </button>
        </div>

        {shortlinks.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <Link2 className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
            <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
              Aucun lien court
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Créez votre premier lien court pour commencer à suivre vos clics
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="rounded-md bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Créer votre premier lien
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {shortlinks.map((shortlink) => (
              <div
                key={shortlink.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-sm font-semibold text-black dark:text-white">
                      {baseUrl}/s/{shortlink.alias}
                    </div>
                    <CopyButton url={`${baseUrl}/s/${shortlink.alias}`} />
                  </div>
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {shortlink.url.length > 60
                      ? `${shortlink.url.substring(0, 60)}...`
                      : shortlink.url}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                    <span>{shortlink.clicks} clic{shortlink.clicks > 1 ? "s" : ""}</span>
                    <span>
                      Créé le{" "}
                      {new Date(shortlink.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/s/${shortlink.alias}`}
                    target="_blank"
                    className="rounded-md border border-zinc-300 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    title="Tester le lien"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(shortlink.id)}
                    disabled={loading === shortlink.id}
                    className="rounded-md border border-zinc-300 p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-zinc-700 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ShortlinkForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            refreshShortlinks()
            setShowForm(false)
          }}
        />
      )}
    </div>
  )
}

