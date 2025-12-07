import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

// Force dynamic generation (don't pre-render during build)
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://korli.app"

  // Static pages (always included)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Try to get user pages from database
  // If database is not available (e.g., during build), return only static pages
  let userPageEntries: MetadataRoute.Sitemap = []
  
  try {
    const userPages = await prisma.userPage.findMany({
      select: {
        username: true,
        updatedAt: true,
      },
      where: {
        // Only include pages that have at least one active block
        blocks: {
          some: {
            isActive: true,
          },
        },
      },
    })

    // Generate sitemap entries for user pages
    userPageEntries = userPages.map((page) => ({
      url: `${siteUrl}/${page.username}`,
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    // Database not available (e.g., during build time)
    // Return only static pages
    console.warn('Could not fetch user pages for sitemap:', error)
  }

  return [...staticPages, ...userPageEntries]
}

