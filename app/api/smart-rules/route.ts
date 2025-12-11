import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { z } from "zod"

const conditionsSchema = z.object({
  trafficSource: z.array(z.string()).optional(),
  device: z.array(z.string()).optional(),
  country: z.array(z.string()).optional(),
  timeRange: z
    .object({
      start: z.string(),
      end: z.string(),
    })
    .optional(),
  dayOfWeek: z.array(z.number()).optional(),
  visitorType: z.enum(["new", "returning"]).optional(),
})

const actionsSchema = z.object({
  type: z.enum(["show", "hide", "reorder"]),
  blockIds: z.array(z.string()).optional(),
  order: z.array(z.union([z.string(), z.number()])).optional(),
})

export async function GET(request: NextRequest) {
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
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userPage = await prisma.userPage.findUnique({
      where: { userId: session.user.id },
      include: {
        smartRules: {
          orderBy: {
            priority: "desc",
          },
        },
      },
    })

    if (!userPage) {
      return NextResponse.json(
        { error: "Page utilisateur non trouvée" },
        { status: 404 }
      )
    }

    return NextResponse.json({ rules: userPage.smartRules })
  } catch (error: unknown) {
    console.error("Error fetching smart rules:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des règles" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const schema = z.object({
      name: z.string().min(1),
      isActive: z.boolean().optional(),
      priority: z.number().optional(),
      conditions: conditionsSchema,
      actions: actionsSchema,
    })
    const { name, isActive, priority, conditions, actions } = schema.parse(body)

    const userPage = await prisma.userPage.findUnique({
      where: { userId: session.user.id },
    })

    if (!userPage) {
      return NextResponse.json(
        { error: "Page utilisateur non trouvée" },
        { status: 404 }
      )
    }

    const rule = await prisma.smartRule.create({
      data: {
        userPageId: userPage.id,
        name,
        isActive: isActive ?? true,
        priority: priority ?? 0,
        conditions: conditions as any,
        actions: actions as any,
      },
    })

    return NextResponse.json({ rule })
  } catch (error: unknown) {
    console.error("Error creating smart rule:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la règle" },
      { status: 500 }
    )
  }
}

