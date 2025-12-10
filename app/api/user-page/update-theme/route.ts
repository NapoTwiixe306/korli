import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
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
    const { theme } = body

    if (!theme) {
      return NextResponse.json(
        { error: "Le thème est requis" },
        { status: 400 }
      )
    }

    const validThemes = ["default", "minimal", "dark", "colorful"]
    if (!validThemes.includes(theme)) {
      return NextResponse.json(
        { error: "Thème invalide" },
        { status: 400 }
      )
    }

    const userPage = await prisma.userPage.update({
      where: { userId: session.user.id },
      data: { 
        theme,
        // Réinitialiser themeConfig quand on change de thème pour appliquer les valeurs par défaut
        themeConfig: Prisma.DbNull,
      } as any,
    })

    return NextResponse.json({ userPage })
  } catch (error) {
    console.error("Error updating theme:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du thème" },
      { status: 500 }
    )
  }
}

