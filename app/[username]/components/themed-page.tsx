"use client"

import { getThemeClasses, type Theme } from "@/lib/themes"
import { getLayoutConfig, type LayoutType } from "@/lib/layouts"
import { getAnimationClasses, type AnimationLevel } from "@/lib/animations"
import Image from "next/image"
import { BlocksGrid } from "./blocks-grid"

interface Block {
  id: string
  title: string
  url: string | null
  icon: string | null
  order: number
}

interface ThemedPageProps {
  userName: string
  username: string
  avatar: string | null
  userImage: string | null
  bio: string | null
  blocks: Block[]
  theme: Theme
  layout: string
  animations?: string
}

export function ThemedPage({
  userName,
  username,
  avatar,
  userImage,
  bio,
  blocks,
  theme,
  layout,
  animations = "all",
}: ThemedPageProps) {
  const styles = getThemeClasses(theme)
  const animClasses = getAnimationClasses(animations as AnimationLevel)
  const displayAvatar = avatar || userImage
  const layoutType = (layout || "list") as LayoutType
  const isGridLayout = layoutType !== "list"
  const maxWidth = isGridLayout ? "max-w-4xl" : "max-w-md"

  return (
    <div className={`flex min-h-screen items-center justify-center px-4 py-8 sm:py-12 ${styles.background} ${animClasses.pageTransition}`}>
      <div className={`w-full ${maxWidth} space-y-6 sm:space-y-8`}>
        {/* Avatar & Bio */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          {displayAvatar ? (
            <div className={`relative h-20 w-20 sm:h-24 sm:w-24 md:h-[120px] md:w-[120px] overflow-hidden rounded-full border-2 sm:border-4 ${styles.avatarBorder} shadow-lg`}>
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
              {userName || username}
            </h1>
            {bio && (
              <p className={`mt-2 text-sm sm:text-base ${styles.textSecondary} break-words`}>
                {bio}
              </p>
            )}
          </div>
        </div>

        {/* Blocks */}
        <BlocksGrid
          blocks={blocks}
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
          <a
            href="/"
            className={`font-medium ${styles.textPrimary} hover:underline`}
          >
            korli
          </a>
        </div>
      </div>
    </div>
  )
}

