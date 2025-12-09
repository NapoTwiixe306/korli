import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { SmartRulesPageClient } from "./page-client"

export default async function SmartRulesPage() {
  const headersList = await headers()
  
  const headerEntries: [string, string][] = []
  headersList.forEach((value, key) => {
    headerEntries.push([key, value])
  })
  
  const authHeaders = new Headers(headerEntries)
  
  let session
  try {
    session = await auth.api.getSession({
      headers: authHeaders,
    })
  } catch (error) {
    redirect("/login")
  }

  if (!session?.user) {
    redirect("/login")
  }

  const userPage = await prisma.userPage.findUnique({
    where: { userId: session.user.id },
    include: {
      smartRules: {
        orderBy: {
          priority: "desc",
        },
      },
      blocks: {
        orderBy: {
          order: "asc",
        },
      },
    } as any,
  }) as any

  if (!userPage) {
    redirect("/register")
  }

  const mappedRules = ((userPage as any)?.smartRules || []).map((rule: any) => {
    const conditions = (rule.conditions || {}) as {
      trafficSource?: string[]
      device?: string[]
      country?: string[]
      timeRange?: { start: string; end: string }
      dayOfWeek?: number[]
      visitorType?: "new" | "returning"
    }
    
    const actions = (rule.actions || { type: "show" }) as {
      type: "show" | "hide" | "reorder"
      blockIds?: string[]
      order?: (string | number)[]
    }

    return {
      id: rule.id,
      name: rule.name,
      isActive: rule.isActive,
      priority: rule.priority,
      conditions,
      actions,
    }
  })

  return (
    <SmartRulesPageClient
      initialRules={mappedRules}
      blocks={(userPage.blocks || []).map((b: any) => ({
        id: b.id,
        title: b.title,
        url: b.url,
      }))}
    />
  )
}

