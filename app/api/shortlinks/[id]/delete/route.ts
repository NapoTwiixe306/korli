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

    // Get shortlink and verify ownership
    const shortlink = await prisma.shortlink.findUnique({
      where: { id },
      include: {
        userPage: {
          select: { userId: true },
        },
      },
    })

    if (!shortlink) {
      return NextResponse.json(
        { error: "Shortlink non trouvé" },
        { status: 404 }
      )
    }

    if (shortlink.userPage.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      )
    }

    // Delete shortlink
    await prisma.shortlink.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting shortlink:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression du shortlink" },
      { status: 500 }
    )
  }
}

