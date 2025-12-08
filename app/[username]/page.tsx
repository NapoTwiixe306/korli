import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { PageViewTracker, BlockClickTracker } from "./components/tracking"
import { ThemedPage } from "./components/themed-page"

interface PageProps {
  params: Promise<{
    username: string
  }>
}

export default async function UserPage({ params }: PageProps) {
  const { username } = await params

  const userPage = await prisma.userPage.findUnique({
    where: { username },
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
    notFound()
  }

  return (
    <>
      <PageViewTracker userPageId={userPage.id} />
      <ThemedPage
        userName={userPage.user.name || ""}
        username={username}
        avatar={userPage.avatar}
        userImage={userPage.user.image}
        bio={userPage.bio}
        blocks={userPage.blocks.map((block) => ({
          id: block.id,
          title: block.title,
          url: block.url,
          icon: block.icon,
          order: block.order,
        }))}
        theme={userPage.theme as "default" | "minimal" | "dark" | "colorful"}
        layout={userPage.layout || "list"}
        animations={userPage.animations || "all"}
      />
    </>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { username } = await params
  const siteUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://korli.fr"

  const userPage = await prisma.userPage.findUnique({
    where: { username },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  })

  if (!userPage) {
    return {
      title: "Page not found | korli",
      description: "The page you are looking for does not exist.",
    }
  }

  const displayName = userPage.user.name || username
  const description = userPage.bio || `${displayName}'s korli - Discover all my links in one place`
  const pageUrl = `${siteUrl}/${username}`
  const avatarUrl = userPage.avatar || userPage.user.image || `${siteUrl}/default-avatar.png`

  return {
    title: `${displayName} | korli`,
    description,
    openGraph: {
      title: `${displayName} | korli`,
      description,
      url: pageUrl,
      siteName: "korli",
      images: [
        {
          url: avatarUrl,
          width: 400,
          height: 400,
          alt: `${displayName}'s profile`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${displayName} | korli`,
      description,
      images: [avatarUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
  }
}

