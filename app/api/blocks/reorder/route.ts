import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

export async function PATCH(request: NextRequest) {
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
    const { blockOrders } = body // Array of { id: string, order: number }

    if (!Array.isArray(blockOrders)) {
      return NextResponse.json(
        { error: "blockOrders doit être un tableau" },
        { status: 400 }
      )
    }

    // Get user page
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

    // Verify all blocks belong to user
    const blockIds = blockOrders.map((bo: { id: string }) => bo.id)
    const userBlockIds = userPage.blocks.map((b) => b.id)
    const allBlocksBelongToUser = blockIds.every((id: string) =>
      userBlockIds.includes(id)
    )

    if (!allBlocksBelongToUser) {
      return NextResponse.json(
        { error: "Certains blocs n'appartiennent pas à l'utilisateur" },
        { status: 403 }
      )
    }

    // Update all blocks in a transaction
    await prisma.$transaction(
      blockOrders.map((bo: { id: string; order: number }) =>
        prisma.block.update({
          where: { id: bo.id },
          data: { order: bo.order },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error reordering blocks:", error)
    return NextResponse.json(
      { error: "Erreur lors du réordonnancement des blocs" },
      { status: 500 }
    )
  }
}

