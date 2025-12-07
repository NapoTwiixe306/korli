import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { validateUrl, validateLength } from "@/lib/security"

export async function POST(request: NextRequest) {
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
    const { url, alias } = body

    if (!url) {
      return NextResponse.json(
        { error: "L'URL est requise" },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      validateUrl(url)
      if (alias) {
        validateLength(alias, 3, 50, "L'alias")
        // Alias should only contain alphanumeric and hyphens
        if (!/^[a-zA-Z0-9-]+$/.test(alias)) {
          throw new Error("L'alias ne peut contenir que des lettres, chiffres et tirets")
        }
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Données invalides" },
        { status: 400 }
      )
    }

    // Get user page
    const userPage = await prisma.userPage.findUnique({
      where: { userId: session.user.id },
    })

    if (!userPage) {
      return NextResponse.json(
        { error: "Page utilisateur non trouvée" },
        { status: 404 }
      )
    }

    // Generate alias if not provided
    let finalAlias = alias
    if (!finalAlias) {
      // Generate random 6-character alias
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let generated = ""
      for (let i = 0; i < 6; i++) {
        generated += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      finalAlias = generated
    }

    // Check if alias already exists
    const existing = await prisma.shortlink.findUnique({
      where: { alias: finalAlias },
    })

    if (existing) {
      // If alias was provided and exists, return error
      if (alias) {
        return NextResponse.json(
          { error: "Cet alias est déjà utilisé" },
          { status: 400 }
        )
      }
      // If auto-generated, try again (max 10 attempts)
      let attempts = 0
      while (existing && attempts < 10) {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let generated = ""
        for (let i = 0; i < 6; i++) {
          generated += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        finalAlias = generated
        const check = await prisma.shortlink.findUnique({
          where: { alias: finalAlias },
        })
        if (!check) break
        attempts++
      }
      if (attempts >= 10) {
        return NextResponse.json(
          { error: "Impossible de générer un alias unique" },
          { status: 500 }
        )
      }
    }

    // Create shortlink
    const shortlink = await prisma.shortlink.create({
      data: {
        userPageId: userPage.id,
        alias: finalAlias,
        url,
      },
    })

    return NextResponse.json({ shortlink }, { status: 201 })
  } catch (error) {
    console.error("Error creating shortlink:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création du shortlink" },
      { status: 500 }
    )
  }
}

