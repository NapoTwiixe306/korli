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
    const {
      socialHeaderEnabled,
      socialHeaderBlockIds,
      themeConfig,
    } = body

    if (socialHeaderBlockIds && !Array.isArray(socialHeaderBlockIds)) {
      return NextResponse.json(
        { error: "socialHeaderBlockIds doit être un tableau d'identifiants" },
        { status: 400 }
      )
    }

    const data: Record<string, unknown> = {}
    if (typeof socialHeaderEnabled === "boolean") data.socialHeaderEnabled = socialHeaderEnabled
    if (Array.isArray(socialHeaderBlockIds)) data.socialHeaderBlockIds = socialHeaderBlockIds
    if (themeConfig && typeof themeConfig === "object") data.themeConfig = themeConfig

    const userPage = await prisma.userPage.update({
      where: { userId: session.user.id },
      data,
    })

    return NextResponse.json({ userPage })
  } catch (error) {
    console.error("Error updating appearance:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'apparence" },
      { status: 500 }
    )
  }
}

