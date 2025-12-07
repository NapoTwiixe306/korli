import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { ProfilePageClient } from "./page-client"

export default async function ProfilePage() {
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
            Profile
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Gérez vos informations personnelles
          </p>
        </div>

        <ProfilePageClient
          initialName={session.user.name}
          userEmail={session.user.email}
        />
      </div>
    </div>
  )
}

