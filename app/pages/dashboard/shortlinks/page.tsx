import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { ShortlinksPageClient } from "./page-client"

export default async function ShortlinksPage() {
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
      shortlinks: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!userPage) {
    redirect("/register")
  }

  return (
    <ShortlinksPageClient
      initialShortlinks={userPage.shortlinks.map((sl) => ({
        ...sl,
        createdAt: sl.createdAt.toISOString(),
      }))}
    />
  )
}

