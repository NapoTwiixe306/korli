/**
 * Default blocks templates that are created when a user page is first created.
 * These blocks can be modified, customized, or deleted by the user.
 */

export interface DefaultBlockTemplate {
  title: string
  url: string
  type: string
  icon: string | null
  order: number
  isActive: boolean
}

export const DEFAULT_BLOCKS: DefaultBlockTemplate[] = [
  {
    title: "Instagram",
    url: "https://instagram.com",
    type: "social",
    icon: "icon:instagram",
    order: 0,
    isActive: true,
  },
  {
    title: "YouTube",
    url: "https://youtube.com",
    type: "social",
    icon: "icon:youtube",
    order: 1,
    isActive: true,
  },
  {
    title: "Twitter/X",
    url: "https://twitter.com",
    type: "social",
    icon: "icon:twitter/x",
    order: 2,
    isActive: true,
  },
  {
    title: "TikTok",
    url: "https://tiktok.com",
    type: "social",
    icon: "icon:tiktok",
    order: 3,
    isActive: true,
  },
  {
    title: "Mon site web",
    url: "https://example.com",
    type: "standard",
    icon: "🌐",
    order: 4,
    isActive: false, // Inactive by default, user needs to add their URL
  },
  {
    title: "Contact",
    url: "mailto:your@email.com",
    type: "standard",
    icon: "✉️",
    order: 5,
    isActive: false, // Inactive by default, user needs to add their email
  },
]

/**
 * Creates default blocks for a new user page.
 * These blocks are fully customizable and can be modified or deleted.
 */
export function getDefaultBlocks(): DefaultBlockTemplate[] {
  return DEFAULT_BLOCKS.map(block => ({ ...block }))
}

