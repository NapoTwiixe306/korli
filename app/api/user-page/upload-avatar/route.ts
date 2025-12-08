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
      console.error("Upload avatar: No file provided")
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      )
    }

    console.log("Upload avatar: File received", {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      console.error("Upload avatar: Invalid file type", file.type)
      return NextResponse.json(
        { error: `Type de fichier non autorisé: ${file.type}. Utilisez JPEG, PNG, GIF ou WebP` },
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
        console.error("Upload avatar: Extension mismatch", {
          extension: fileExtension,
          mimeType: file.type,
        })
        return NextResponse.json(
          { error: `L'extension du fichier (.${fileExtension}) ne correspond pas au type MIME (${file.type})` },
          { status: 400 }
        )
      }
    } else if (!fileExtension) {
      console.error("Upload avatar: No file extension")
      return NextResponse.json(
        { error: "Le fichier doit avoir une extension valide (.jpg, .png, .gif, .webp)" },
        { status: 400 }
      )
    }

    // Create avatars directory if it doesn't exist
    const avatarsDir = join(process.cwd(), "public", "avatars")
    try {
      if (!existsSync(avatarsDir)) {
        await mkdir(avatarsDir, { recursive: true })
        console.log("Created avatars directory:", avatarsDir)
      }
    } catch (dirError) {
      console.error("Error creating avatars directory:", dirError)
      return NextResponse.json(
        { error: "Erreur lors de la création du répertoire d'avatars" },
        { status: 500 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const finalExtension = fileExtension || "jpg"
    const filename = `${session.user.id}-${timestamp}-${randomString}.${finalExtension}`
    const filepath = join(avatarsDir, filename)

    console.log("Saving avatar to:", filepath)

    // Convert file to buffer and save
    try {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)
      console.log("Avatar saved successfully:", filename)
    } catch (writeError) {
      console.error("Error writing avatar file:", writeError)
      return NextResponse.json(
        { error: "Erreur lors de l'écriture du fichier avatar" },
        { status: 500 }
      )
    }

    // Generate public URL (use API route for serving)
    const avatarUrl = `/api/avatars/${filename}`

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
      { error: error instanceof Error ? error.message : "Erreur lors de l'upload de l'avatar" },
      { status: 500 }
    )
  }
}

