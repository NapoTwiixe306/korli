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
  type: z.enum(["show", "hide", "reorder"]).optional(),
  blockIds: z.array(z.string()).optional(),
  order: z.array(z.union([z.string(), z.number()])).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await request.json()
    const schema = z.object({
      name: z.string().min(1).optional(),
      isActive: z.boolean().optional(),
      priority: z.number().optional(),
      conditions: conditionsSchema.optional(),
      actions: actionsSchema.optional(),
    })
    const { name, isActive, priority, conditions, actions } = schema.parse(body)

    // Verify rule belongs to user
    const userPage = await prisma.userPage.findUnique({
      where: { userId: session.user.id },
      include: {
        smartRules: {
          where: { id },
        },
      },
    })

    if (!userPage || userPage.smartRules.length === 0) {
      return NextResponse.json(
        { error: "Règle non trouvée" },
        { status: 404 }
      )
    }

    const rule = await prisma.smartRule.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(isActive !== undefined && { isActive }),
        ...(priority !== undefined && { priority }),
        ...(conditions !== undefined && { conditions: conditions as any }),
        ...(actions !== undefined && { actions: actions as any }),
      },
    })

    return NextResponse.json({ rule })
  } catch (error: unknown) {
    console.error("Error updating smart rule:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la règle" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Verify rule belongs to user
    const userPage = await prisma.userPage.findUnique({
      where: { userId: session.user.id },
      include: {
        smartRules: {
          where: { id },
        },
      },
    })

    if (!userPage || userPage.smartRules.length === 0) {
      return NextResponse.json(
        { error: "Règle non trouvée" },
        { status: 404 }
      )
    }

    await prisma.smartRule.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Error deleting smart rule:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la règle" },
      { status: 500 }
    )
  }
}

