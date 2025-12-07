"use client"

import Image from "next/image"
import { getThemeClasses, type Theme } from "@/lib/themes"
import { getAnimationClasses, type AnimationLevel } from "@/lib/animations"
import { BlockIcon } from "@/app/[username]/components/block-icon"

interface Block {
  id: string
  title: string
  url: string | null
  icon: string | null
  order: number
  isActive: boolean
}

interface PagePreviewProps {
  userName: string
  username: string
  avatar: string | null
  userImage: string | null
  bio: string | null
  blocks: Block[]
  theme: string
  layout?: string
  animations?: string
}

export function PagePreview({
  userName,
  username,
  avatar,
  userImage,
  bio,
  blocks,
  theme,
  layout = "list",
  animations = "all",
}: PagePreviewProps) {
  const activeBlocks = blocks.filter((b) => b.isActive).sort((a, b) => a.order - b.order)
  const displayAvatar = avatar || userImage
  const styles = getThemeClasses(theme as Theme)
  const animClasses = getAnimationClasses(animations as AnimationLevel)

  return (
    <div className={`flex items-center justify-center rounded-lg border ${styles.border} ${styles.background} p-4`}>
      <div className={`w-full max-w-[320px] space-y-6 rounded-lg px-4 py-8 ${styles.background}`}>
        {/* Avatar & Bio */}
        <div className="flex flex-col items-center space-y-4">
          {displayAvatar ? (
            <div className={`relative h-20 w-20 overflow-hidden rounded-full border-2 ${styles.avatarBorder} shadow-lg`}>
              <Image
                src={displayAvatar}
                alt={userName || username}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className={`flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold ${
              theme === "colorful" 
                ? "bg-gradient-to-br from-purple-200 to-pink-200 text-purple-700 dark:from-purple-800 dark:to-pink-800 dark:text-purple-200"
                : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}>
              {(userName || username).charAt(0).toUpperCase()}
            </div>
          )}

          <div className="text-center">
            <h2 className={`text-lg font-bold ${styles.textPrimary}`}>
              {userName || username}
            </h2>
            {bio && (
              <p className={`mt-1 text-sm ${styles.textSecondary} line-clamp-2`}>
                {bio}
              </p>
            )}
          </div>
        </div>

        {/* Blocks - Simplified preview */}
        <div className="space-y-2">
          {activeBlocks.length === 0 ? (
            <div className={`rounded-lg border ${styles.border} ${styles.cardBackground} p-3 text-center text-xs ${styles.textSecondary}`}>
              Aucun lien disponible
            </div>
          ) : (
            activeBlocks.slice(0, layout === "list" ? 4 : 6).map((block) => (
              <div
                key={block.id}
                className={`flex items-center justify-center rounded-lg border ${styles.border} ${styles.cardBackground} px-3 py-2 text-center text-sm font-medium ${styles.textPrimary} ${animClasses.blockTransition} ${
                  theme === "colorful" 
                    ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50"
                    : ""
                }`}
              >
                <BlockIcon icon={block.icon} className="mr-1.5 text-base" animations={animations as AnimationLevel} />
                <span className="truncate">{block.title}</span>
              </div>
            ))
          )}
          {activeBlocks.length > (layout === "list" ? 4 : 6) && (
            <div className={`text-center text-xs ${styles.textSecondary}`}>
              +{activeBlocks.length - (layout === "list" ? 4 : 6)} autre{activeBlocks.length - (layout === "list" ? 4 : 6) > 1 ? "s" : ""} bloc
              {activeBlocks.length - (layout === "list" ? 4 : 6) > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

