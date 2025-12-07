import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET(request: NextRequest) {
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
      include: {
        blocks: {
          orderBy: {
            order: "asc",
          },
        },
      },
    })

    if (!userPage) {
      return NextResponse.json(
        { error: "Page utilisateur non trouvée" },
        { status: 404 }
      )
    }

    return NextResponse.json({ blocks: userPage.blocks })
  } catch (error) {
    console.error("Error fetching blocks:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des blocs" },
      { status: 500 }
    )
  }
}

