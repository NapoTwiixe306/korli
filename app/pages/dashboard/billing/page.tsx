import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { CreditCard, Check } from "lucide-react"

export default async function BillingPage() {
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
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Facturation
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Gérez votre abonnement et vos méthodes de paiement
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Plan actuel
            </h2>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-black dark:text-white">
                  Free
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Plan gratuit
                </div>
              </div>
              <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                Mettre à niveau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

