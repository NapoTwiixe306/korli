"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface SettingsPageClientProps {
  initialName: string | null
  initialUsername: string
  initialBio: string | null
  userEmail: string
}

export function SettingsPageClient({
  initialName,
  initialUsername,
  initialBio,
  userEmail,
}: SettingsPageClientProps) {
  const [name, setName] = useState(initialName || "")
  const [username, setUsername] = useState(initialUsername)
  const [bio, setBio] = useState(initialBio || "")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSaveName = async () => {
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

  const handleSaveUsername = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/user-page/update-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
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

  const handleSaveBio = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/user-page/update-bio", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio }),
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
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <Check className="h-4 w-4" />
          Enregistré avec succès
        </div>
      )}

      {/* Profile Settings */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
          Profil
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nom
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              />
              <button
                onClick={handleSaveName}
                disabled={loading || name === (initialName || "")}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                {loading ? "..." : "Enregistrer"}
              </button>
            </div>
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
        </div>
      </div>

      {/* Page Settings */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
          Page
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nom d'utilisateur
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              />
              <button
                onClick={handleSaveUsername}
                disabled={loading || username === initialUsername || username.length < 3}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                {loading ? "..." : "Modifier"}
              </button>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Votre URL : korli.fr/{username}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Bio
            </label>
            <div className="mt-1 flex gap-2">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                placeholder="Décrivez-vous en quelques mots..."
              />
              <button
                onClick={handleSaveBio}
                disabled={loading || bio === (initialBio || "")}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                {loading ? "..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
          Actions du compte
        </h2>
        <div className="space-y-3">
          <button className="w-full rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-900/20">
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  )
}

