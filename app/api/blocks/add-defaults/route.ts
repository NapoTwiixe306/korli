import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { getDefaultBlocks } from "@/lib/default-blocks"

/**
 * POST /api/blocks/add-defaults
 * 
 * Adds default blocks to the authenticated user's page if they don't have any blocks yet.
 * Useful for existing users who registered before default blocks were implemented.
 * 
 * @returns Success response
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

    // Get default blocks
    const defaultBlocks = getDefaultBlocks()

    // Get existing block titles to avoid duplicates
    const existingTitles = new Set(
      userPage.blocks.map((b: { title: string }) => b.title.toLowerCase())
    )

    // Filter out default blocks that already exist
    const blocksToAdd = defaultBlocks.filter(
      (block) => !existingTitles.has(block.title.toLowerCase())
    )

    if (blocksToAdd.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Tous les blocs par défaut sont déjà présents",
        blocksAdded: 0,
      })
    }

    // Calculate the max order to append new blocks after existing ones
    const maxOrder =
      userPage.blocks.length > 0
        ? Math.max(...userPage.blocks.map((b: { order: number }) => b.order))
        : -1

    // Create default blocks with adjusted order
    await prisma.block.createMany({
      data: blocksToAdd.map((block, index) => ({
        userPageId: userPage.id,
        title: block.title,
        url: block.url,
        type: block.type,
        icon: block.icon,
        order: maxOrder + 1 + index,
        isActive: block.isActive,
      })),
    })

    return NextResponse.json({
      success: true,
      message: `${blocksToAdd.length} blocs par défaut ajoutés`,
      blocksAdded: blocksToAdd.length,
    })
  } catch (error) {
    console.error("Error adding default blocks:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'ajout des blocs par défaut" },
      { status: 500 }
    )
  }
}

