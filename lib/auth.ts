import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/prisma"

/**
 * Better Auth configuration and initialization.
 * 
 * Provides authentication services with email/password support,
 * session management, and Prisma integration.
 * 
 * @remarks
 * - Uses shared PrismaClient instance to avoid connection pool exhaustion
 * - Lazy initialization prevents early database connection
 * - Server-side only (throws error if imported on client)
 */

let authInstance: ReturnType<typeof betterAuth> | null = null

/**
 * Initializes Better Auth instance with Prisma adapter.
 * 
 * @returns Configured Better Auth instance
 * @throws {Error} If DATABASE_URL is missing or initialization fails
 */
const initializeAuth = () => {
  if (authInstance) return authInstance
  
  if (typeof window !== 'undefined') {
    throw new Error('Better Auth can only be initialized on the server-side')
  }
  
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl || typeof databaseUrl !== 'string' || databaseUrl.trim() === '') {
    throw new Error(
      'DATABASE_URL is not set or is empty. ' +
      'Please ensure your .env file exists in the project root and contains: ' +
      'DATABASE_URL="mysql://user:password@host:port/database"\n' +
      `Current DATABASE_URL value: ${JSON.stringify(databaseUrl)}`
    )
  }
  
  if (databaseUrl === 'undefined' || databaseUrl === 'null') {
    throw new Error(
      'DATABASE_URL appears to be the string "undefined" or "null". ' +
      'Please check your .env file and ensure DATABASE_URL is properly quoted.'
    )
  }
  
  try {
    authInstance = betterAuth({
      database: prismaAdapter(prisma, {
        provider: "mysql",
      }),
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
      },
      session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
      },
    })
    
    return authInstance
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to initialize Better Auth: ${errorMsg}`)
  }
}

/**
 * Exported Better Auth instance.
 * 
 * @example
 * ```ts
 * import { auth } from '@/lib/auth'
 * const session = await auth.api.getSession({ headers })
 * ```
 */
export const auth = initializeAuth()

export type Session = typeof auth.$Infer.Session
