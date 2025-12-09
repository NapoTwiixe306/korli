import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET() {
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userPage = await prisma.userPage.findUnique({
      where: { userId: session.user.id },
    })

    if (!userPage) {
      return NextResponse.json({ error: "User page not found" }, { status: 404 })
    }

    const customSources = ((userPage as any).customTrafficSources || []) as Array<{
      name: string
      domains: string[]
    }>

    return NextResponse.json({ customSources })
  } catch (error) {
    console.error("Error fetching custom traffic sources:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { customSources } = body

    if (!Array.isArray(customSources)) {
      return NextResponse.json(
        { error: "customSources must be an array" },
        { status: 400 }
      )
    }

    // Validate each custom source
    for (const source of customSources) {
      if (!source.name || typeof source.name !== "string") {
        return NextResponse.json(
          { error: "Each source must have a name" },
          { status: 400 }
        )
      }
      if (!Array.isArray(source.domains) || source.domains.length === 0) {
        return NextResponse.json(
          { error: "Each source must have at least one domain" },
          { status: 400 }
        )
      }
    }

    const userPage = await prisma.userPage.update({
      where: { userId: session.user.id },
      data: {
        customTrafficSources: customSources as any,
      },
    })

    return NextResponse.json({
      success: true,
      customSources: (userPage as any).customTrafficSources,
    })
  } catch (error) {
    console.error("Error updating custom traffic sources:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

