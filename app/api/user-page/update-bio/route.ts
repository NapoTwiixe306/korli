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
    const { bio } = body

    // Bio can be null/empty
    const userPage = await prisma.userPage.update({
      where: { userId: session.user.id },
      data: { bio: bio || null },
    })

    return NextResponse.json({ userPage })
  } catch (error) {
    console.error("Error updating bio:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la bio" },
      { status: 500 }
    )
  }
}

