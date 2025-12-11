import { prisma } from "@/lib/prisma"
import { detectCountryServer, detectDevice, detectTrafficSource } from "@/lib/smart-rules"
import { rateLimit } from "@/lib/rate-limit"
import { rateLimitRedis } from "@/lib/rate-limit-redis"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export async function POST(request: NextRequest) {
  try {
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      null

    let limitedOk = true
    try {
      limitedOk = await rateLimitRedis(`pv:${ipAddress ?? "anon"}`, 60, 60) // 60 req/min
    } catch {
      // Redis non dispo -> fallback local best effort
      limitedOk = rateLimit(`page-view:${ipAddress ?? "anon"}`, 30, 60_000)
    }
    if (!limitedOk) {
      return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 })
    }

    const json = await request.json()
    const schema = z.object({
      userPageId: z.string().min(1),
      visitorId: z.string().optional(),
      sessionId: z.string().optional(),
      variant: z.string().optional(),
      ruleIds: z.array(z.string()).optional(),
    })
    const { userPageId, visitorId, sessionId, variant, ruleIds } = schema.parse(json)

    // Bot filter (lightweight UA check)
    const userAgent = request.headers.get("user-agent") || ""
    const botRegex = /(bot|crawl|spider|slurp|facebookexternalhit|preview)/i
    if (botRegex.test(userAgent)) {
      return NextResponse.json({ skipped: "bot_detected" }, { status: 200 })
    }

    // Verify page exists
    const userPage = (await prisma.userPage.findUnique({
      where: { id: userPageId },
    })) as any

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
      } as any)
      if (recent) {
        return NextResponse.json({ skipped: "duplicate" }, { status: 200 })
      }
    }

    const referer = request.headers.get("referer") || null
    const customSources =
      ((userPage as any)?.customTrafficSources as unknown as Array<{ name: string; domains: string[] }>) ||
      []
    const source = detectTrafficSource(referer, customSources)
    const device = detectDevice(userAgent)
    const country = await detectCountryServer(ipAddress)

    // Create page view
    await prisma.pageView.create({
      data: {
        userPageId,
        visitorId: visitorId || null,
        sessionId: sessionId || null,
        variant: variant || null,
        ruleIds: ruleIds && ruleIds.length > 0 ? ruleIds : undefined,
        source,
        device,
        country,
        isReturning: Boolean(request.cookies.get("korli_returning")?.value),
        ipAddress,
        userAgent: userAgent || null,
        referer,
      } as any,
    })

    const response = NextResponse.json({ success: true, country })
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
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

