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

    const limited = rateLimit(`block-click:${ipAddress ?? "anon"}`, 60, 60_000)
    if (!limited) {
      return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 })
    }

    const json = await request.json()
    const schema = z.object({
      blockId: z.string().min(1),
      userPageId: z.string().optional(),
      visitorId: z.string().optional(),
      sessionId: z.string().optional(),
      variant: z.string().optional(),
      ruleIds: z.array(z.string()).optional(),
    })
    const { blockId, userPageId, visitorId, sessionId, variant, ruleIds } = schema.parse(json)

    // Verify block exists
    const block = await prisma.block.findUnique({
      where: { id: blockId },
      select: { id: true, userPageId: true },
    })

    if (!block) {
      return NextResponse.json(
        { error: "Bloc non trouvé" },
        { status: 404 }
      )
    }

    // Bot filter
    const userAgent = request.headers.get("user-agent") || ""
    const botRegex = /(bot|crawl|spider|slurp|facebookexternalhit|preview)/i
    if (botRegex.test(userAgent)) {
      return NextResponse.json({ skipped: "bot_detected" }, { status: 200 })
    }

    const referer = request.headers.get("referer") || null
    const userPageIdResolved = userPageId || block.userPageId
    const userPage = userPageIdResolved
      ? ((await prisma.userPage.findUnique({
          where: { id: userPageIdResolved },
        })) as any)
      : null

    const source = detectTrafficSource(referer, (userPage?.customTrafficSources as any) || [])
    const device = detectDevice(userAgent)
    const country = await detectCountryServer(ipAddress)

    // Create block click
    await prisma.blockClick.create({
      data: {
        blockId,
        visitorId: visitorId || null,
        sessionId: sessionId || null,
        variant: variant || null,
        ruleIds: ruleIds && ruleIds.length > 0 ? ruleIds : undefined,
        source,
        device,
        country,
        ipAddress,
        userAgent: userAgent || null,
        referer,
      },
    } as any)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking block click:", error)
    return NextResponse.json(
      { error: "Erreur lors du tracking" },
      { status: 500 }
    )
  }
}

