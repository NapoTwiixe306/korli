import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getRedis } from "@/lib/redis"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { z } from "zod"

const DEFAULT_RANGE_DAYS = 7

const querySchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
  format: z.enum(["json", "csv"]).optional(),
})

type BreakdownRow = { label: string; count: number }

async function countDistinct(table: "PageView" | "BlockClick", whereSql: string, params: any[]) {
  // Try with sessionId (new schema). Fallback to visitorId/ipAddress if column missing.
  const sqlWithSession = `SELECT COUNT(DISTINCT COALESCE(sessionId, visitorId, ipAddress)) as count FROM ${table} ${whereSql}`
  const sqlFallback = `SELECT COUNT(DISTINCT COALESCE(visitorId, ipAddress)) as count FROM ${table} ${whereSql}`

  const run = async (sql: string) => {
    const res = (await prisma.$queryRawUnsafe(sql, ...params)) as Array<{ count: bigint | number }>
    const first = res[0]?.count ?? 0
    return typeof first === "bigint" ? Number(first) : first
  }

  try {
    return await run(sqlWithSession)
  } catch {
    return await run(sqlFallback)
  }
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const parsed = querySchema.parse({
      start: searchParams.get("start") || undefined,
      end: searchParams.get("end") || undefined,
      format: searchParams.get("format") || undefined,
    })

    const endDate = parsed.end ? new Date(parsed.end) : new Date()
    const startDate = parsed.start
      ? new Date(parsed.start)
      : new Date(Date.now() - DEFAULT_RANGE_DAYS * 24 * 60 * 60 * 1000)

    const whereRange = {
      userPageId: userPage.id,
      createdAt: { gte: startDate, lte: endDate },
    } as any

    const cacheKey = `adv:${userPage.id}:${startDate.toISOString()}:${endDate.toISOString()}`
    const redis = (() => {
      try {
        return getRedis()
      } catch {
        return null
      }
    })()

    if (redis) {
      const cached = await redis.get(cacheKey)
      if (cached) {
        return NextResponse.json(cached)
      }
    }

    const [views, clicks, sources, devices, countries, variantsViews, variantsClicks, topBlocks] =
      await Promise.all([
        prisma.pageView.count({ where: whereRange }),
        prisma.blockClick.count({ where: { userPageId: userPage.id, createdAt: whereRange.createdAt } as any }),
        prisma.pageView.groupBy({
          by: ["source"] as any,
          _count: true,
          where: { ...whereRange, source: { not: null } } as any,
        }) as any,
        prisma.pageView.groupBy({
          by: ["device"] as any,
          _count: true,
          where: { ...whereRange, device: { not: null } } as any,
        }) as any,
        prisma.pageView.groupBy({
          by: ["country"] as any,
          _count: true,
          where: { ...whereRange, country: { not: null } } as any,
        }) as any,
        prisma.pageView.groupBy({
          by: ["variant"] as any,
          _count: true,
          where: { ...whereRange, variant: { not: null } } as any,
        }) as any,
        prisma.blockClick.groupBy({
          by: ["variant"] as any,
          _count: true,
          where: { userPageId: userPage.id, createdAt: whereRange.createdAt, variant: { not: null } } as any,
        }) as any,
        prisma.block.findMany({
          where: { userPageId: userPage.id },
          select: {
            id: true,
            title: true,
            clicks: {
              where: { createdAt: whereRange.createdAt } as any,
              select: { id: true },
            },
          },
        }),
      ])

    const uniqueViews = await countDistinct("PageView", "WHERE userPageId = ? AND createdAt BETWEEN ? AND ?", [
      userPage.id,
      startDate,
      endDate,
    ])
    const uniqueClicks = await countDistinct(
      "BlockClick",
      "WHERE userPageId = ? AND createdAt BETWEEN ? AND ?",
      [userPage.id, startDate, endDate]
    )

    const ctr = views > 0 ? Number(((clicks / views) * 100).toFixed(1)) : 0

    const toBreakdown = (rows: any[], key: "source" | "device" | "country"): BreakdownRow[] =>
      rows
        .map((r: any) => ({
          label: (r as any)[key] || "unknown",
          count: (r as any)._count as number,
        }))
        .sort((a: BreakdownRow, b: BreakdownRow) => b.count - a.count)

    const variants = variantsViews.map((v: any) => {
      const clickCount = variantsClicks.find((c: any) => c.variant === v.variant)?._count ?? 0
      const viewCount = Number(v._count) || 0
      const variantCtr = viewCount > 0 ? Number(((Number(clickCount) / viewCount) * 100).toFixed(1)) : 0
      return {
        variant: (v as any).variant || "unknown",
        views: viewCount,
        clicks: clickCount,
        ctr: variantCtr,
      }
    });

    const blocks = topBlocks
      .map((b: any) => {
        const clicksCount = Array.isArray(b.clicks) ? b.clicks.length : 0
        const blockCtr = views > 0 ? Number(((clicksCount / views) * 100).toFixed(1)) : 0
        return { id: b.id, title: b.title, clicks: clicksCount, ctr: blockCtr }
      })
      .sort((a: any, b: any) => b.clicks - a.clicks)
      .slice(0, 5)

    const result = {
      range: { start: startDate.toISOString(), end: endDate.toISOString() },
      totals: {
        views,
        clicks,
        ctr,
        uniqueViews,
        uniqueClicks,
      },
      breakdowns: {
        sources: toBreakdown(sources, "source"),
        devices: toBreakdown(devices, "device"),
        countries: toBreakdown(countries, "country"),
      },
      variants,
      blocks,
    }

    if (parsed.format === "csv") {
      const lines: string[] = []
      lines.push("metric,label,count")
      lines.push(`totals,views,${views}`)
      lines.push(`totals,clicks,${clicks}`)
      lines.push(`totals,uniqueViews,${uniqueViews}`)
      lines.push(`totals,uniqueClicks,${uniqueClicks}`)
      lines.push(`totals,ctr,${ctr}`)
      result.breakdowns.sources.forEach((row: BreakdownRow) => lines.push(`source,${row.label},${row.count}`))
      result.breakdowns.devices.forEach((row: BreakdownRow) => lines.push(`device,${row.label},${row.count}`))
      result.breakdowns.countries.forEach((row: BreakdownRow) => lines.push(`country,${row.label},${row.count}`))
      result.variants.forEach((row: any) => lines.push(`variant-${row.variant},views,${row.views}`))
      result.variants.forEach((row: any) => lines.push(`variant-${row.variant},clicks,${row.clicks}`))
      return new NextResponse(lines.join("\n"), {
        status: 200,
        headers: { "Content-Type": "text/csv" },
      })
    }

    if (redis) {
      await redis.set(cacheKey, result, { ex: 60 })
    }

    const response = NextResponse.json(result)
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    return response
  } catch (error) {
    console.error("Error in analytics advanced:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
