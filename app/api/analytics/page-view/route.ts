import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userPageId } = body

    if (!userPageId) {
      return NextResponse.json(
        { error: "userPageId est requis" },
        { status: 400 }
      )
    }

    // Verify page exists
    const userPage = await prisma.userPage.findUnique({
      where: { id: userPageId },
    })

    if (!userPage) {
      return NextResponse.json(
        { error: "Page non trouvée" },
        { status: 404 }
      )
    }

    // Get request info
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     null
    const userAgent = request.headers.get("user-agent") || null
    const referer = request.headers.get("referer") || null

    // Create page view
    await prisma.pageView.create({
      data: {
        userPageId,
        ipAddress,
        userAgent,
        referer,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking page view:", error)
    return NextResponse.json(
      { error: "Erreur lors du tracking" },
      { status: 500 }
    )
  }
}

