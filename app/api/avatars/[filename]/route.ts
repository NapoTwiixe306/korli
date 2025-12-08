import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params

    // Security: prevent directory traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json(
        { error: "Nom de fichier invalide" },
        { status: 400 }
      )
    }

    const filepath = join(process.cwd(), "public", "avatars", filename)

    if (!existsSync(filepath)) {
      return NextResponse.json(
        { error: "Avatar non trouvé" },
        { status: 404 }
      )
    }

    const file = await readFile(filepath)
    const ext = filename.split(".").pop()?.toLowerCase()
    
    // Determine content type
    const contentType = 
      ext === "png" ? "image/png" :
      ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
      ext === "gif" ? "image/gif" :
      ext === "webp" ? "image/webp" :
      "application/octet-stream"

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error serving avatar:", error)
    return NextResponse.json(
      { error: "Erreur lors du chargement de l'avatar" },
      { status: 500 }
    )
  }
}

