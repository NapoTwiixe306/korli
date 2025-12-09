import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { Folder } from "lucide-react"

export default async function FilesPage() {
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
              Files
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Gérez vos fichiers et ressources
            </p>
          </div>
        </div>

        <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <Folder className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
          <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
            Bientôt disponible
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Cette fonctionnalité arrive très prochainement. Vous pourrez gérer et organiser vos fichiers depuis cette page.
          </p>
        </div>
      </div>
    </div>
  )
}

