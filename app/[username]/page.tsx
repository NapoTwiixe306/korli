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
      smartRules: {
        where: {
          isActive: true,
        },
        orderBy: {
          priority: "desc",
        },
      },
    } as any,
  }) as any

  if (!userPage) {
    notFound()
  }

  // Safely get subtitle, defaulting to null if column doesn't exist
  let subtitle: string | null = null
  try {
    subtitle = (userPage as unknown as { subtitle?: string | null }).subtitle ?? null
  } catch {
    // Column doesn't exist yet, use null
    subtitle = null
  }

  const initialBlocks = userPage.blocks.map((block: typeof userPage.blocks[number]) => ({
    id: block.id,
    title: block.title,
    url: block.url,
    icon: block.icon,
    type: block.type,
    order: block.order,
  }))

  const smartRules = (userPage.smartRules || []).map((rule: typeof userPage.smartRules[number]) => ({
    id: rule.id,
    isActive: rule.isActive,
    priority: rule.priority,
    conditions: rule.conditions as unknown as {
      trafficSource?: string[]
      device?: string[]
      country?: string[]
      timeRange?: { start: string; end: string }
      dayOfWeek?: number[]
      visitorType?: "new" | "returning"
    },
    actions: rule.actions as unknown as {
      type: "show" | "hide" | "reorder"
      blockIds?: string[]
      order?: number[]
    },
  }))

  return (
    <>
      <PageViewTracker userPageId={userPage.id} />
      <ThemedPage
        userName={userPage.user.name || ""}
        username={username}
        avatar={userPage.avatar}
        userImage={userPage.user.image}
        subtitle={subtitle}
        bio={userPage.bio}
        blocks={initialBlocks}
        smartRules={smartRules}
        theme={userPage.theme as "default" | "minimal" | "dark" | "colorful"}
        layout={userPage.layout || "list"}
        animations={userPage.animations || "all"}
        socialHeaderEnabled={(userPage as unknown as { socialHeaderEnabled?: boolean }).socialHeaderEnabled ?? false}
        socialHeaderBlockIds={
          Array.isArray((userPage as unknown as { socialHeaderBlockIds?: unknown }).socialHeaderBlockIds)
            ? ((userPage as unknown as { socialHeaderBlockIds: string[] }).socialHeaderBlockIds)
            : []
        }
        themeConfig={
          (userPage as unknown as { themeConfig?: unknown }).themeConfig
            ? ((userPage as unknown as { themeConfig: Record<string, unknown> }).themeConfig)
            : null
        }
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

