import { createAuthClient } from "better-auth/react"

/**
 * Better Auth client instance for React components.
 * 
 * Provides client-side authentication methods (signIn, signOut, getSession).
 * 
 * @example
 * ```tsx
 * import { authClient } from '@/lib/auth-client'
 * const session = await authClient.getSession()
 * ```
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
})
