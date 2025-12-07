import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { AppearancePageClient } from "./page-client"

export default async function AppearancePage() {
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
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      blocks: {
        where: {
          isActive: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  })

  if (!userPage) {
    redirect("/register")
  }

  return (
    <AppearancePageClient
      initialTheme={userPage.theme}
      initialLayout={userPage.layout || "list"}
      initialAnimations={(userPage.animations || "all") as "all" | "minimal" | "none"}
      initialBio={userPage.bio}
      userName={userPage.user.name || ""}
      username={userPage.username}
      avatar={userPage.avatar}
      userImage={userPage.user.image}
      blocks={userPage.blocks}
    />
  )
}

