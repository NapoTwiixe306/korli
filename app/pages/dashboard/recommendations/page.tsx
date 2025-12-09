import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { Lightbulb, Sparkles, Target } from "lucide-react"

export default async function RecommendationsPage() {
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Recommandations
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Suggestions pour améliorer votre page
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Optimisations suggérées
              </h2>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Fonctionnalité à venir
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

