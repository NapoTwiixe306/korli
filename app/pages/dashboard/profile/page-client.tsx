"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfilePageClientProps {
  initialName: string | null
  userEmail: string
}

export function ProfilePageClient({
  initialName,
  userEmail,
}: ProfilePageClientProps) {
  const [name, setName] = useState(initialName || "")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/user/update-name", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur lors de la sauvegarde")
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <Check className="h-4 w-4" />
          Enregistré avec succès
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nom
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input
            type="email"
            value={userEmail}
            disabled
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-500"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
            L'email ne peut pas être modifié
          </p>
        </div>
        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={loading || name === (initialName || "")}
            className="rounded-md bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </div>
  )
}

