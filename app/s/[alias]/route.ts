import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ alias: string }> }
) {
  try {
    const { alias } = await params

    // Find shortlink
    const shortlink = await prisma.shortlink.findUnique({
      where: { alias },
    })

    if (!shortlink) {
      return NextResponse.json(
        { error: "Shortlink non trouvé" },
        { status: 404 }
      )
    }

    // Get request info for tracking
    const headersList = await headers()
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     null
    const userAgent = request.headers.get("user-agent") || null
    const referer = request.headers.get("referer") || null

    // Increment click count and track (fire and forget)
    prisma.shortlink.update({
      where: { id: shortlink.id },
      data: { clicks: { increment: 1 } },
    }).catch(console.error)

    // Redirect to URL
    return NextResponse.redirect(shortlink.url)
  } catch (error) {
    console.error("Error redirecting shortlink:", error)
    return NextResponse.json(
      { error: "Erreur lors de la redirection" },
      { status: 500 }
    )
  }
}

