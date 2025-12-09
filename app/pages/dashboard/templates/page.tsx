import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { LayoutTemplate } from "lucide-react"

export default async function TemplatesPage() {
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
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Templates
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Choisissez parmi nos modèles de page prédéfinis
            </p>
          </div>
        </div>

        <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <LayoutTemplate className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
          <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
            Bientôt disponible
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Cette fonctionnalité arrive très prochainement. Vous pourrez choisir parmi une sélection de templates de page personnalisés.
          </p>
        </div>
      </div>
    </div>
  )
}

