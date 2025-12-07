import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { SettingsPageClient } from "./page-client"

export default async function SettingsPage() {
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
      user: true,
    },
  })

  if (!userPage) {
    redirect("/register")
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Paramètres
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Gérez les paramètres de votre compte et de votre page
          </p>
        </div>

        <SettingsPageClient
          initialName={session.user.name}
          initialUsername={userPage.username}
          initialBio={userPage.bio}
          userEmail={session.user.email}
        />
      </div>
    </div>
  )
}

