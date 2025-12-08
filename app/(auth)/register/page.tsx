"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Register the user
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      })

      if (result.error) {
        setError(result.error.message || "Une erreur est survenue")
        setLoading(false)
        return
      }

      // Create user page automatically after registration
      const createPageResponse = await fetch("/api/user-page/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username && username.trim() ? username.trim() : undefined,
        }),
      })

      if (!createPageResponse.ok) {
        const errorData = await createPageResponse.json()
        // Don't fail registration if page creation fails, but show warning
        console.error("Page creation error:", errorData)
      }

      // Redirect to dashboard immediately
      window.location.href = "/pages/dashboard"
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8 dark:bg-black">
      <div className="w-full max-w-md space-y-6 sm:space-y-8 rounded-lg bg-white p-6 sm:p-8 shadow-lg dark:bg-zinc-900">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
            Créer un compte
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Rejoignez korli et créez votre page personnalisée
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Nom d'utilisateur (optionnel)
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              placeholder="jean-dupont"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Laissé vide, il sera généré automatiquement. Votre URL sera : korli.fr/{username || "votre-nom"}
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Minimum 8 caractères
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-medium text-black hover:underline dark:text-white"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

