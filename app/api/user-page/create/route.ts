import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateUsername, makeUsernameUnique } from "@/lib/utils"
import { getDefaultBlocks } from "@/lib/default-blocks"

/**
 * POST /api/user-page/create
 * 
 * Creates a user page automatically after registration.
 * Generates unique username if not provided, or validates requested username.
 * 
 * @param request - Request body: { username?: string }
 * @returns Created user page data
 */
export async function POST(request: NextRequest) {
  try {
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
    const { username: requestedUsername } = body

    const existingPage = await prisma.userPage.findUnique({
      where: { userId },
    })

    if (existingPage) {
      return NextResponse.json(
        { error: "Vous avez déjà une page" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      )
    }

    let finalUsername: string

    if (requestedUsername && requestedUsername.trim()) {
      const exists = await prisma.userPage.findUnique({
        where: { username: requestedUsername.trim() },
      })

      if (exists) {
        return NextResponse.json(
          { error: "Ce nom d'utilisateur est déjà pris" },
          { status: 400 }
        )
      }

      finalUsername = requestedUsername.trim()
    } else {
      const baseUsername = generateUsername(user.email, user.name)
      finalUsername = await makeUsernameUnique(
        baseUsername,
        async (username) => {
          const exists = await prisma.userPage.findUnique({
            where: { username },
          })
          return !!exists
        }
      )
    }

    // Create user page with default blocks in a transaction
    const defaultBlocks = getDefaultBlocks()
    
    const userPage = await prisma.userPage.create({
      data: {
        userId,
        username: finalUsername,
        bio: null,
        avatar: user.image || null,
        theme: "default",
        blocks: {
          create: defaultBlocks.map(block => ({
            title: block.title,
            url: block.url,
            type: block.type,
            icon: block.icon,
            order: block.order,
            isActive: block.isActive,
          })),
        },
      },
    })

    await prisma.user.update({
      where: { id: userId },
      data: { username: finalUsername },
    })

    return NextResponse.json({
      success: true,
      userPage: {
        id: userPage.id,
        username: userPage.username,
      },
    })
  } catch (error) {
    console.error("Error creating user page:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la page" },
      { status: 500 }
    )
  }
}
