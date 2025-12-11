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

    const session = await auth.api.getSession({ headers: authHeaders })
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userPage = await prisma.userPage.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })

    if (!userPage) {
      return NextResponse.json({ error: "No page" }, { status: 404 })
    }

    const [views, clicks, topBlocks] = await Promise.all([
      prisma.pageView.count({ where: { userPageId: userPage.id } }),
      prisma.blockClick.count({
        where: { userPageId: userPage.id },
      }),
      prisma.block.findMany({
        where: { userPageId: userPage.id },
        select: {
          id: true,
          title: true,
          clicks: { select: { id: true } },
        },
      }),
    ])

    const totalViews = views
    const totalClicks = clicks
    const ctr = totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(1)) : 0

    const blockStats = topBlocks
      .map((block) => ({
        id: block.id,
        title: block.title,
        clicks: block.clicks.length,
        ctr: totalViews > 0 ? Number(((block.clicks.length / totalViews) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)

    return NextResponse.json({
      totalViews,
      totalClicks,
      ctr,
      blockStats,
    })
  } catch (error) {
    console.error("Error fetching analytics overview", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
