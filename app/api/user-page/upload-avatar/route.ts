import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

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

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Utilisez JPEG, PNG, GIF ou WebP" },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Le fichier est trop volumineux. Taille maximale : 5MB" },
        { status: 400 }
      )
    }

    // Validate minimum file size (prevent empty files)
    const minSize = 100 // 100 bytes
    if (file.size < minSize) {
      return NextResponse.json(
        { error: "Le fichier est trop petit" },
        { status: 400 }
      )
    }

    // Validate file extension matches MIME type
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    const extensionMap: Record<string, string[]> = {
      jpg: ["image/jpeg", "image/jpg"],
      jpeg: ["image/jpeg", "image/jpg"],
      png: ["image/png"],
      gif: ["image/gif"],
      webp: ["image/webp"],
    }
    
    if (fileExtension && extensionMap[fileExtension]) {
      if (!extensionMap[fileExtension].includes(file.type)) {
        return NextResponse.json(
          { error: "L'extension du fichier ne correspond pas au type MIME" },
          { status: 400 }
        )
      }
    }

    // Create avatars directory if it doesn't exist
    const avatarsDir = join(process.cwd(), "public", "avatars")
    if (!existsSync(avatarsDir)) {
      await mkdir(avatarsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const finalExtension = fileExtension || "jpg"
    const filename = `${session.user.id}-${timestamp}-${randomString}.${finalExtension}`
    const filepath = join(avatarsDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Generate public URL
    const avatarUrl = `/avatars/${filename}`

    // Update user page with avatar URL
    const userPage = await prisma.userPage.update({
      where: { userId: session.user.id },
      data: { avatar: avatarUrl },
    })

    return NextResponse.json({ 
      userPage,
      avatarUrl 
    })
  } catch (error) {
    console.error("Error uploading avatar:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'upload de l'avatar" },
      { status: 500 }
    )
  }
}

