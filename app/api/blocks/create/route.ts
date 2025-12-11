import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { validateUrl, validateLength } from "@/lib/security"

/**
 * POST /api/blocks/create
 * 
 * Creates a new block for the authenticated user's page.
 * Automatically calculates order if not provided.
 * 
 * @param request - Request body: { title: string, url: string, type?: string, icon?: string, order?: number }
 * @returns Created block data
 */
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const headerEntries: [string, string][] = []
    headersList.forEach((value, key) => {
      headerEntries.push([key, value])
    })
    const authHeaders = new Headers(headerEntries)

    const session = await auth.api.getSession({
      headers: authHeaders,
    })

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, url, type = "standard", icon, order, abGroup, abWeight } = body

    if (!title || !url) {
      return NextResponse.json(
        { error: "Le titre et l'URL sont requis" },
        { status: 400 }
      )
    }

    // Validate input lengths
    try {
      validateLength(title, 1, 100, "Le titre")
      validateUrl(url)
      if (icon) {
        validateLength(icon, 1, 50, "L'icône")
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Données invalides"
      return NextResponse.json(
        { error: message },
        { status: 400 }
      )
    }

    const userPage = await prisma.userPage.findUnique({
      where: { userId: session.user.id },
      include: { blocks: true },
    })

    if (!userPage) {
      return NextResponse.json(
        { error: "Page utilisateur non trouvée" },
        { status: 404 }
      )
    }

    const maxOrder = userPage.blocks.length > 0
      ? Math.max(...userPage.blocks.map((b: { order: number }) => b.order))
      : -1
    const blockOrder = order !== undefined ? order : maxOrder + 1

    const block = await prisma.block.create({
      data: {
        userPageId: userPage.id,
        title,
        url,
        type,
        icon: icon || null,
        abGroup: abGroup || null,
        abWeight: abWeight ?? 100,
        order: blockOrder,
        isActive: true,
      } as any,
    })

    return NextResponse.json({ block }, { status: 201 })
  } catch (error: unknown) {
    console.error("Error creating block:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création du bloc" },
      { status: 500 }
    )
  }
}
