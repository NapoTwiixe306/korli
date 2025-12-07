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
    const { name } = body

    // Name can be null/empty
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name || null },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error updating name:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du nom" },
      { status: 500 }
    )
  }
}

