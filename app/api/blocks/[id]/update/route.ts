import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { validateUrl, validateLength } from "@/lib/security"

export async function PATCH(
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

    const body = await request.json()
    const { title, url, type, icon, isActive, order, abGroup, abWeight } = body

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

    // Validate inputs if provided
    try {
      if (title !== undefined) {
        validateLength(title, 1, 100, "Le titre")
      }
      if (url !== undefined) {
        validateUrl(url)
      }
      if (icon !== undefined && icon !== null) {
        validateLength(icon, 1, 50, "L'icône")
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Données invalides"
      return NextResponse.json(
        { error: message },
        { status: 400 }
      )
    }

    // Update block
    const updatedBlock = await prisma.block.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(url !== undefined && { url }),
        ...(type !== undefined && { type }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
        ...(abGroup !== undefined && { abGroup }),
        ...(abWeight !== undefined && { abWeight }),
      } as any,
    })

    return NextResponse.json({ block: updatedBlock })
  } catch (error) {
    console.error("Error updating block:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du bloc" },
      { status: 500 }
    )
  }
}

