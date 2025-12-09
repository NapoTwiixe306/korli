"use client"

import { getThemeClasses, type Theme } from "@/lib/themes"
import { getLayoutConfig, type LayoutType } from "@/lib/layouts"
import { getAnimationClasses, type AnimationLevel } from "@/lib/animations"
import { getSocialIcon } from "@/lib/social-icons"
import Image from "next/image"
import Link from "next/link"
import { BlocksGrid } from "./blocks-grid"

interface Block {
  id: string
  title: string
  url: string | null
  icon: string | null
  type?: string | null
  order: number
}

interface ThemedPageProps {
  userName: string
  username: string
  avatar: string | null
  userImage: string | null
  subtitle: string | null
  bio: string | null
  blocks: Block[]
  theme: Theme
  layout: string
  animations?: string
  socialHeaderEnabled?: boolean
  socialHeaderBlockIds?: string[]
  themeConfig?: Record<string, unknown> | null
}

export function ThemedPage({
  userName,
  username,
  avatar,
  userImage,
  subtitle,
  bio,
  blocks,
  theme,
  layout,
  animations = "all",
  socialHeaderEnabled = false,
  socialHeaderBlockIds = [],
  themeConfig = null,
}: ThemedPageProps) {
  const styles = getThemeClasses(theme)
  const animClasses = getAnimationClasses(animations as AnimationLevel)
  const displayAvatar = avatar || userImage
  const layoutType = (layout || "list") as LayoutType
  const isGridLayout = layoutType !== "list"
  const maxWidth = isGridLayout ? "max-w-4xl" : "max-w-md"
  const socialLinks = socialHeaderEnabled
    ? blocks
        .filter(
          (b) =>
            b.url &&
            b.icon &&
            b.icon.startsWith("icon:") &&
            (socialHeaderBlockIds.length === 0 ||
              socialHeaderBlockIds.includes(b.id))
        )
        .slice(0, 5)
    : []

  const displayedBlocks =
    socialHeaderEnabled && socialHeaderBlockIds.length > 0
      ? blocks.filter(
          (b) =>
            !(
              b.icon &&
              b.icon.startsWith("icon:") &&
              socialHeaderBlockIds.includes(b.id)
            )
        )
      : blocks

  const themeOverrides = {
    backgroundColor: "#ffffff",
    textPrimary: "#111111",
    textSecondary: "#4b5563",
    cardBackground: "#ffffff",
    borderColor: "#e5e7eb",
    iconBackground: "#ffffff",
    iconHoverBackground: "#f1f5f9",
    usernameColor: "#111111",
    iconRadius: 9999,
    ...(themeConfig as Record<string, unknown> | null),
  } as {
    backgroundColor: string
    textPrimary: string
    textSecondary: string
    cardBackground: string
    borderColor: string
    iconBackground: string
    iconHoverBackground: string
    usernameColor: string
    iconRadius: number
  }
  // Garantit le fond des icônes header en blanc si non défini
  if (!themeOverrides.iconBackground) {
    themeOverrides.iconBackground = "#ffffff"
  }

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-4 py-8 sm:py-12 ${styles.background} ${animClasses.pageTransition}`}
      style={{
        backgroundColor: themeOverrides.backgroundColor,
        color: themeOverrides.textPrimary,
      }}
    >
      <div className={`w-full ${maxWidth} space-y-6 sm:space-y-8`}>
        {/* Avatar & Bio */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          {displayAvatar ? (
            <div
              className={`relative h-20 w-20 sm:h-24 sm:w-24 md:h-[120px] md:w-[120px] overflow-hidden rounded-full border-2 sm:border-4 ${styles.avatarBorder} shadow-lg`}
              style={{ borderColor: themeOverrides.borderColor }}
            >
              <Image
                src={displayAvatar}
                alt={userName || username}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className={`flex h-20 w-20 sm:h-24 sm:w-24 md:h-[120px] md:w-[120px] items-center justify-center rounded-full bg-zinc-200 text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 ${theme === "colorful" ? "bg-gradient-to-br from-purple-200 to-pink-200 text-purple-700 dark:from-purple-800 dark:to-pink-800 dark:text-purple-200" : ""}`}>
              {(userName || username).charAt(0).toUpperCase()}
            </div>
          )}

          <div className="text-center px-2">
            <h1 className={`text-xl sm:text-2xl font-bold ${styles.textPrimary}`}>
              <span style={{ color: themeOverrides.usernameColor }}>{userName || username}</span>
            </h1>
            {subtitle && (
              <div
                className={`mt-1 text-sm sm:text-base ${styles.textSecondary} break-words`}
                style={{ color: themeOverrides.textSecondary }}
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}
            {bio && (
              <p
                className={`mt-2 text-sm sm:text-base ${styles.textSecondary} break-words`}
                style={{ color: themeOverrides.textSecondary }}
              >
                {bio}
              </p>
            )}
          </div>

          {socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {socialLinks.map((link) => {
                const iconCfg = getSocialIcon(link.icon || "")
                if (!iconCfg) return null
                const IconComp = iconCfg.icon
                return (
                  <Link
                    key={link.id}
                    href={link.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.title || iconCfg.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                    style={{
                      color: iconCfg.color,
                      backgroundColor: themeOverrides.iconBackground,
                      borderColor: themeOverrides.borderColor,
                      borderRadius: themeOverrides.iconRadius,
                    }}
                  >
                    <IconComp className="h-5 w-5" aria-hidden="true" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Blocks */}
        <BlocksGrid
          blocks={displayedBlocks}
          layout={layoutType}
          theme={theme}
          styles={styles}
          animations={animations as "all" | "minimal" | "none"}
          onBlockClick={async (blockId) => {
            fetch("/api/analytics/block-click", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ blockId }),
            }).catch(console.error)
          }}
        />

        {/* Footer */}
        <div className={`text-center text-xs ${styles.textSecondary}`}>
          Créé avec{" "}
          <Link
            href="/"
            className={`font-medium ${styles.textPrimary} hover:underline`}
          >
            korli
          </Link>
        </div>
      </div>
    </div>
  )
}

