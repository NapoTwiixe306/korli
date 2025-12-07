import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { Sparkles, Plus } from "lucide-react"

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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Smart Rules
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Configurez des règles conditionnelles pour vos blocs
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-md bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            <Plus className="h-4 w-4" />
            Nouvelle règle
          </button>
        </div>

        <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <Sparkles className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
          <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
            Aucune règle configurée
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Créez des règles pour personnaliser l'affichage de vos blocs selon différents critères
          </p>
          <button className="rounded-md bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            Créer votre première règle
          </button>
        </div>
      </div>
    </div>
  )
}

