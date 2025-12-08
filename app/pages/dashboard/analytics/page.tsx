import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export default async function AnalyticsPage() {
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
      blocks: {
        include: {
          clicks: true,
        },
      },
      pageViews: true,
    },
  })

  if (!userPage) {
    redirect("/register")
  }

  // Calculate stats
  const totalViews = userPage.pageViews.length
  const totalClicks = userPage.blocks.reduce(
    (sum: number, block: (typeof userPage.blocks)[number]) => sum + block.clicks.length,
    0
  )
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0"
  
  // Get unique visitors (by IP) - simplified
  const uniqueIPs = new Set(
    userPage.pageViews
      .map((pv: (typeof userPage.pageViews)[number]) => pv.ipAddress)
      .filter((ip): ip is string => ip !== null)
  )
  const uniqueVisitors = uniqueIPs.size

  // Calculate clicks per block
  const blockStats = userPage.blocks.map((block) => ({
    id: block.id,
    title: block.title,
    clicks: block.clicks.length,
    ctr: totalViews > 0 ? ((block.clicks.length / totalViews) * 100).toFixed(1) : "0",
  }))

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Analytics
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Suivez les performances de votre page
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Vues totales
            </div>
            <div className="mt-2 text-3xl font-bold text-black dark:text-white">
              {totalViews}
            </div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Toutes les vues
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Clics totaux
            </div>
            <div className="mt-2 text-3xl font-bold text-black dark:text-white">
              {totalClicks}
            </div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Sur tous les blocs
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Taux de clic
            </div>
            <div className="mt-2 text-3xl font-bold text-black dark:text-white">
              {ctr}%
            </div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Moyenne globale
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Visiteurs uniques
            </div>
            <div className="mt-2 text-3xl font-bold text-black dark:text-white">
              {uniqueVisitors}
            </div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Adresses IP uniques
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Traffic Sources */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
              Sources de trafic
            </h2>
            <div className="space-y-3">
              {[
                { name: "Direct", value: 0, percentage: 0 },
                { name: "Instagram", value: 0, percentage: 0 },
                { name: "TikTok", value: 0, percentage: 0 },
                { name: "YouTube", value: 0, percentage: 0 },
                { name: "Autre", value: 0, percentage: 0 },
              ].map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {source.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                      <div
                        className="bg-black dark:bg-white h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-black dark:text-white w-12 text-right">
                      {source.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Block Performance */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
              Performance des blocs
            </h2>
            {userPage.blocks.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Aucun bloc pour le moment
              </p>
            ) : (
              <div className="space-y-3">
                {blockStats
                  .sort((a, b) => b.clicks - a.clicks)
                  .map((stat) => (
                    <div
                      key={stat.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                    >
                      <div>
                        <div className="font-medium text-black dark:text-white">
                          {stat.title}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-500">
                          {stat.clicks} clic{stat.clicks > 1 ? "s" : ""} • {stat.ctr}% CTR
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

