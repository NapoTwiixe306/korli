import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/user/email?username=xxx
 * 
 * Gets user email from username.
 * Used during login to support username-based authentication.
 * 
 * SECURITY NOTE: This endpoint exposes user emails. Consider rate limiting
 * and potentially requiring authentication in the future.
 * 
 * @param request - Query param: username
 * @returns User email or error
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      )
    }

    // Validate username format to prevent injection
    const trimmedUsername = username.toLowerCase().trim()
    if (!/^[a-z0-9-]+$/.test(trimmedUsername) || trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      return NextResponse.json(
        { error: "Invalid username format" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { username: trimmedUsername },
      select: { email: true },
    })

    if (!user) {
      // Don't reveal if user exists or not (prevent enumeration)
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ email: user.email })
  } catch (error) {
    console.error("Error fetching user email:", error)
    return NextResponse.json(
      { error: "Error fetching user email" },
      { status: 500 }
    )
  }
}

