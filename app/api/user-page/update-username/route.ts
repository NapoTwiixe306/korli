import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const body = await request.json()
    const { username } = body

    if (!username || !username.trim()) {
      return NextResponse.json(
        { error: "Le nom d'utilisateur est requis" },
        { status: 400 }
      )
    }

    const trimmedUsername = username.trim().toLowerCase()

    // Validate username format
    if (!/^[a-z0-9-]+$/.test(trimmedUsername)) {
      return NextResponse.json(
        { error: "Le nom d'utilisateur ne peut contenir que des lettres minuscules, chiffres et tirets" },
        { status: 400 }
      )
    }

    if (trimmedUsername.length < 3) {
      return NextResponse.json(
        { error: "Le nom d'utilisateur doit contenir au moins 3 caractères" },
        { status: 400 }
      )
    }

    // Check if username is already taken
    const existingPage = await prisma.userPage.findUnique({
      where: { username: trimmedUsername },
    })

    if (existingPage && existingPage.userId !== userId) {
      return NextResponse.json(
        { error: "Ce nom d'utilisateur est déjà pris" },
        { status: 400 }
      )
    }

    // Get or create user page
    let userPage = await prisma.userPage.findUnique({
      where: { userId },
    })

    if (!userPage) {
      // Create page if it doesn't exist (shouldn't happen, but handle edge case)
      userPage = await prisma.userPage.create({
        data: {
          userId,
          username: trimmedUsername,
          bio: null,
          theme: "default",
        },
      })
    } else {
      // Update username
      userPage = await prisma.userPage.update({
        where: { userId },
        data: { username: trimmedUsername },
      })
    }

    // Update user with username
    await prisma.user.update({
      where: { id: userId },
      data: { username: trimmedUsername },
    })

    return NextResponse.json({
      success: true,
      username: userPage.username,
    })
  } catch (error) {
    console.error("Error updating username:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du nom d'utilisateur" },
      { status: 500 }
    )
  }
}

