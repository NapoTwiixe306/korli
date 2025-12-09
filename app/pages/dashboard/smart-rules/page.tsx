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
    },
  })

  if (!userPage) {
    redirect("/register")
  }

  return (
    <SmartRulesPageClient
      initialRules={userPage.smartRules as Array<{
        id: string
        name: string
        isActive: boolean
        priority: number
        conditions: unknown
        actions: unknown
      }>}
      blocks={userPage.blocks.map((b) => ({
        id: b.id,
        title: b.title,
        url: b.url,
      }))}
    />
  )
}

