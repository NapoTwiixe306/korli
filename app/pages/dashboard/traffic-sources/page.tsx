import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { Globe, Instagram, Youtube, Twitter, Link2 } from "lucide-react"

export default async function TrafficSourcesPage() {
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

  // Fetch userPage
  const userPage = await prisma.userPage.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })
  if (!userPage) {
    redirect("/register")
  }

  // Aggregate sources over last 30 days
  const end = new Date()
  const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const grouped = await prisma.pageView.groupBy({
    by: ["source"] as any,
    _count: { _all: true },
    where: {
      userPageId: userPage!.id,
      createdAt: { gte: start, lte: end },
    },
  })

  const total = grouped.reduce((sum, g) => sum + (g._count?._all ?? 0), 0)
  const sources = [
    { name: "Direct", key: "direct", icon: Link2 },
    { name: "Instagram", key: "instagram", icon: Instagram },
    { name: "YouTube", key: "youtube", icon: Youtube },
    { name: "Twitter/X", key: "twitter", icon: Twitter },
    { name: "Autre", key: "other", icon: Globe },
  ].map((s) => {
    const row = grouped.find((g) => (g.source || "direct") === s.key)
    const value = row?._count?._all ?? 0
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0
    return { ...s, value, percentage }
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Sources de trafic
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Analysez d'où viennent vos visiteurs
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-4">
            {sources.map((source) => {
              const Icon = source.icon
              return (
                <div
                  key={source.name}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                    <span className="font-medium text-black dark:text-white">
                      {source.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                      <div
                        className="bg-black dark:bg-white h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-black dark:text-white w-16 text-right">
                      {source.value}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

