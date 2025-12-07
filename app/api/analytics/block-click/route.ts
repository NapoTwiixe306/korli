import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blockId } = body

    if (!blockId) {
      return NextResponse.json(
        { error: "blockId est requis" },
        { status: 400 }
      )
    }

    // Verify block exists
    const block = await prisma.block.findUnique({
      where: { id: blockId },
    })

    if (!block) {
      return NextResponse.json(
        { error: "Bloc non trouvé" },
        { status: 404 }
      )
    }

    // Get request info
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     null
    const userAgent = request.headers.get("user-agent") || null
    const referer = request.headers.get("referer") || null

    // Create block click
    await prisma.blockClick.create({
      data: {
        blockId,
        ipAddress,
        userAgent,
        referer,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking block click:", error)
    return NextResponse.json(
      { error: "Erreur lors du tracking" },
      { status: 500 }
    )
  }
}

