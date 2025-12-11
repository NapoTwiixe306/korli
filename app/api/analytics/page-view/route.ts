import { prisma } from "@/lib/prisma"
import { detectCountryServer, detectDevice, detectTrafficSource } from "@/lib/smart-rules"
import { rateLimit } from "@/lib/rate-limit"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export async function POST(request: NextRequest) {
  try {
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      null

    const limited = rateLimit(`page-view:${ipAddress ?? "anon"}`, 30, 60_000)
    if (!limited) {
      return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 })
    }

    const json = await request.json()
    const schema = z.object({
      userPageId: z.string().min(1),
      visitorId: z.string().optional(),
      ruleIds: z.array(z.string()).optional(),
    })
    const { userPageId, visitorId, ruleIds } = schema.parse(json)

    // Bot filter (lightweight UA check)
    const userAgent = request.headers.get("user-agent") || ""
    const botRegex = /(bot|crawl|spider|slurp|facebookexternalhit|preview)/i
    if (botRegex.test(userAgent)) {
      return NextResponse.json({ skipped: "bot_detected" }, { status: 200 })
    }

    // Verify page exists
    const userPage = await prisma.userPage.findUnique({
      where: { id: userPageId },
      select: {
        id: true,
        customTrafficSources: true,
      },
    })

    if (!userPage) {
      return NextResponse.json(
        { error: "Page non trouvée" },
        { status: 404 }
      )
    }

    // Deduplicate (per visitorId within 30 min)
    if (visitorId) {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
      const recent = await prisma.pageView.findFirst({
        where: {
          userPageId,
          visitorId,
          createdAt: { gte: thirtyMinutesAgo },
        },
      })
      if (recent) {
        return NextResponse.json({ skipped: "duplicate" }, { status: 200 })
      }
    }

    const referer = request.headers.get("referer") || null
    const source = detectTrafficSource(
      referer,
      (userPage.customTrafficSources as any) || []
    )
    const device = detectDevice(userAgent)
    const country = await detectCountryServer(ipAddress)

    // Create page view
    await prisma.pageView.create({
      data: {
        userPageId,
        visitorId: visitorId || null,
        ruleIds: ruleIds && ruleIds.length > 0 ? ruleIds : null,
        source,
        device,
        country,
        isReturning: Boolean(request.cookies.get("korli_returning")?.value),
        ipAddress,
        userAgent: userAgent || null,
        referer,
      },
    })

    const response = NextResponse.json({ success: true, country })
    if (!request.cookies.get("korli_returning")) {
      response.cookies.set("korli_returning", "1", {
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
      })
    }
    return response
  } catch (error) {
    console.error("Error tracking page view:", error)
    return NextResponse.json(
      { error: "Erreur lors du tracking" },
      { status: 500 }
    )
  }
}

