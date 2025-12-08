"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface AuthState {
  session: unknown | null
  loading: boolean
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

/**
 * React hook for authentication state and actions.
 * 
 * @returns Auth state with session, loading status, signOut function, and authentication flag
 * 
 * @example
 * ```tsx
 * const { session, loading, signOut, isAuthenticated } = useAuth()
 * if (loading) return <Loading />
 * if (!isAuthenticated) return <Login />
 * ```
 */
export function useAuth(): AuthState {
  const router = useRouter()
  const [session, setSession] = useState<unknown | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authClient.getSession().then((result) => {
      setSession(result.data?.session || null)
      setLoading(false)
    })
  }, [])

  const signOut = async () => {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  return {
    session,
    loading,
    signOut,
    isAuthenticated: !!session,
  }
}
