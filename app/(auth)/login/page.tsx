"use client"

import { useState, Suspense } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // First, check if identifier is email or username
      const isEmail = identifier.includes("@")
      let userEmail: string | null = null

      if (isEmail) {
        userEmail = identifier.toLowerCase().trim()
      } else {
        // Fetch user email from username
        const userResponse = await fetch(`/api/user/email?username=${encodeURIComponent(identifier.trim())}`)
        if (userResponse.ok) {
          const userData = await userResponse.json()
          userEmail = userData.email
        } else {
          setError("Email ou nom d'utilisateur incorrect")
          setLoading(false)
          return
        }
      }

      if (!userEmail) {
        setError("Email ou nom d'utilisateur incorrect")
        setLoading(false)
        return
      }

      // Use Better Auth client directly to handle cookies automatically
      const result = await authClient.signIn.email({
        email: userEmail,
        password,
      })

      if (result.error) {
        setError(result.error.message || "Mot de passe incorrect")
        setLoading(false)
        return
      }

      // Success - Better Auth sets the session cookie automatically
      const redirectTo = searchParams.get("redirect") || "/pages/dashboard"
      
      // Redirect after a short delay to ensure cookie is set
      setTimeout(() => {
        router.push(redirectTo)
        router.refresh()
      }, 100)
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="identifier"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email ou nom d'utilisateur
        </label>
        <input
          id="identifier"
          type="text"
          required
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          placeholder="vous@exemple.com ou votre-nom-utilisateur"
          autoComplete="username"
        />
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  )
}

export default function LoginPage() {

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8 dark:bg-black">
      <div className="w-full max-w-md space-y-6 sm:space-y-8 rounded-lg bg-white p-6 sm:p-8 shadow-lg dark:bg-zinc-900">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Connectez-vous à votre compte korli
          </p>
        </div>

        <Suspense fallback={<div className="space-y-6">Chargement...</div>}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-medium text-black hover:underline dark:text-white"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}

