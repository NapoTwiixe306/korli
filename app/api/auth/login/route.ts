import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

/**
 * POST /api/auth/login
 * 
 * Authenticates user with email or username and password.
 * Supports both email addresses and usernames as identifiers.
 * 
 * @param request - Request body: { identifier: string, password: string }
 * @returns Success response or error message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, password } = body

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/nom d'utilisateur et mot de passe requis" },
        { status: 400 }
      )
    }

    const isEmail = identifier.includes("@")
    let userEmail: string | null = null

    if (isEmail) {
      userEmail = identifier.toLowerCase().trim()
    } else {
      const user = await prisma.user.findUnique({
        where: { username: identifier.toLowerCase().trim() },
        select: { email: true },
      })

      if (!user) {
        return NextResponse.json(
          { error: "Email ou nom d'utilisateur incorrect" },
          { status: 401 }
        )
      }

      userEmail = user.email
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "Email ou nom d'utilisateur incorrect" },
        { status: 401 }
      )
    }

    const headersList = await headers()
    const headerEntries: [string, string][] = []
    headersList.forEach((value, key) => {
      headerEntries.push([key, value])
    })
    const authHeaders = new Headers(headerEntries)

    const result = await auth.api.signInEmail({
      body: {
        email: userEmail,
        password,
      },
      headers: authHeaders,
    })

    // Better Auth handles cookies automatically
    return NextResponse.json({ success: true, user: result.user })
  } catch (error: unknown) {
    console.error("Login error:", error)
    
    const message = error instanceof Error ? error.message : ""
    // Handle authentication errors
    if (message.includes("Invalid") || message.includes("password") || message.includes("email")) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la connexion" },
      { status: 500 }
    )
  }
}
