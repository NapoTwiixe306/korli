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
    const { animations } = body

    if (!animations || !["all", "minimal", "none"].includes(animations)) {
      return NextResponse.json(
        { error: "Niveau d'animation invalide" },
        { status: 400 }
      )
    }

    const userPage = await prisma.userPage.update({
      where: { userId: session.user.id },
      data: { animations },
    })

    return NextResponse.json({ userPage })
  } catch (error) {
    console.error("Error updating animations:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des animations" },
      { status: 500 }
    )
  }
}

