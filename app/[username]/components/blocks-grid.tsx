"use client"

import { getLayoutConfig, type LayoutType } from "@/lib/layouts"
import { getThemeClasses, type Theme } from "@/lib/themes"
import { getAnimationClasses, type AnimationLevel } from "@/lib/animations"
import { BlockIcon } from "./block-icon"

interface Block {
  id: string
  title: string
  url: string | null
  icon: string | null
  order: number
}

interface BlocksGridProps {
  blocks: Block[]
  layout: LayoutType
  theme: Theme
  styles: ReturnType<typeof getThemeClasses>
  animations?: AnimationLevel
  onBlockClick?: (blockId: string) => void
}

export function BlocksGrid({
  blocks,
  layout,
  theme,
  styles,
  animations = "all",
  onBlockClick,
}: BlocksGridProps) {
  const animClasses = getAnimationClasses(animations)
  if (blocks.length === 0) {
    return (
      <div className={`rounded-lg border ${styles.border} ${styles.cardBackground} p-6 text-center ${styles.textSecondary}`}>
        <p className="text-sm sm:text-base">
          Aucun lien disponible pour le moment
        </p>
        <p className="mt-2 text-xs opacity-75">
          Cette page n'a pas encore de liens à afficher
        </p>
      </div>
    )
  }

  // Pour le layout "list", on garde l'affichage vertical classique
  if (layout === "list") {
    return (
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <a
            key={block.id}
            href={block.url || "#"}
            target={block.url?.startsWith("http") ? "_blank" : undefined}
            rel={block.url?.startsWith("http") ? "noopener noreferrer" : undefined}
            onClick={() => onBlockClick?.(block.id)}
            className={`flex items-center justify-center gap-2 rounded-lg border ${styles.border} ${styles.cardBackground} p-3 sm:p-4 font-medium ${styles.textPrimary} ${animClasses.blockTransition} ${animClasses.blockTransform} ${animClasses.blockHover} ${
              theme === "colorful"
                ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/50 dark:hover:to-pink-800/50"
                : `${styles.buttonHoverBg}`
            }`}
            style={
              animations === "all"
                ? {
                    animationDelay: `${index * 0.05}s`,
                    animation: "slide-up 0.4s ease-out both",
                  }
                : undefined
            }
          >
            <BlockIcon icon={block.icon} className="text-lg" animations={animations} />
            <span>{block.title}</span>
          </a>
        ))}
      </div>
    )
  }

  // Pour les layouts Bento/Grid, on utilise CSS Grid
  const config = getLayoutConfig(layout)

  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: config.gridColumns,
        gridTemplateRows: config.gridRows || "auto",
      }}
    >
      {blocks.map((block, index) => {
        // Déterminer la taille du bloc selon le layout
        const span = config.blockSpans?.[index]
        const colSpan = span?.colSpan || 1
        const rowSpan = span?.rowSpan || 1

        return (
          <a
            key={block.id}
            href={block.url || "#"}
            target={block.url?.startsWith("http") ? "_blank" : undefined}
            rel={block.url?.startsWith("http") ? "noopener noreferrer" : undefined}
            onClick={() => onBlockClick?.(block.id)}
            className={`flex flex-col items-center justify-center rounded-lg border ${styles.border} ${styles.cardBackground} p-3 sm:p-4 text-center font-medium ${styles.textPrimary} ${animClasses.blockTransition} ${animClasses.blockTransform} ${animClasses.blockHover} ${
              theme === "colorful"
                ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/50 dark:hover:to-pink-800/50"
                : `${styles.buttonHoverBg}`
            }`}
            style={{
              gridColumn: `span ${colSpan}`,
              gridRow: `span ${rowSpan}`,
              ...(animations === "all"
                ? {
                    animationDelay: `${index * 0.05}s`,
                    animation: "scale-in 0.3s ease-out both",
                  }
                : {}),
            }}
          >
            <BlockIcon icon={block.icon} className="mb-2 text-2xl" animations={animations} />
            <span className="text-sm">{block.title}</span>
          </a>
        )
      })}
    </div>
  )
}

