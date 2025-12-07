import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://korli.app"

  // Get all public user pages
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
  const userPageEntries: MetadataRoute.Sitemap = userPages.map((page) => ({
    url: `${siteUrl}/${page.username}`,
    lastModified: page.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Static pages
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

  return [...staticPages, ...userPageEntries]
}

