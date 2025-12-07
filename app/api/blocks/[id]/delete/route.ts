import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Get block and verify ownership
    const block = await prisma.block.findUnique({
      where: { id },
      include: {
        userPage: {
          select: { userId: true },
        },
      },
    })

    if (!block) {
      return NextResponse.json(
        { error: "Bloc non trouvé" },
        { status: 404 }
      )
    }

    if (block.userPage.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      )
    }

    // Delete block
    await prisma.block.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting block:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression du bloc" },
      { status: 500 }
    )
  }
}

