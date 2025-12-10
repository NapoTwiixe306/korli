"use client"

import { useState, useEffect } from "react"
import { getThemeClasses, type Theme } from "@/lib/themes"
import { getLayoutConfig, type LayoutType } from "@/lib/layouts"
import { getAnimationClasses, type AnimationLevel } from "@/lib/animations"
import { getSocialIcon } from "@/lib/social-icons"
import {
  getTrafficInfo,
  matchesConditions,
  applyRuleAction,
  autoReorderByTrafficSource,
  type TrafficInfo,
  type RuleCondition,
  type RuleAction,
} from "@/lib/smart-rules"
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

interface SmartRule {
  id: string
  name: string
  isActive: boolean
  priority: number
  conditions: RuleCondition
  actions: RuleAction
}

interface CustomTrafficSource {
  name: string
  domains: string[]
}

interface ThemedPageProps {
  userName: string
  username: string
  avatar: string | null
  userImage: string | null
  subtitle: string | null
  bio: string | null
  blocks: Block[]
  smartRules?: SmartRule[]
  customTrafficSources?: CustomTrafficSource[]
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
  blocks: initialBlocks,
  smartRules = [],
  customTrafficSources = [],
  theme,
  layout,
  animations = "all",
  socialHeaderEnabled = false,
  socialHeaderBlockIds = [],
  themeConfig = null,
}: ThemedPageProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [trafficInfo, setTrafficInfo] = useState<TrafficInfo | null>(null)

  useEffect(() => {
    // Get referer and user agent from browser
    const referer = document.referrer || null
    const userAgent = navigator.userAgent || null

    // Check URL parameters for traffic source (useful when referer is blocked)
    const urlParams = new URLSearchParams(window.location.search)
    const sourceParam = urlParams.get("utm_source") || urlParams.get("source")

    // Check if returning visitor (using localStorage)
    const visitorId = `visitor_${window.location.pathname}`
    const isReturningVisitor = localStorage.getItem(visitorId) !== null
    if (!isReturningVisitor) {
      localStorage.setItem(visitorId, Date.now().toString())
    }

    // Get IP from headers (will be null on client, but structure is ready)
    const ipAddress = null

    // Use source param if referer is not available
    const effectiveReferer = referer || (sourceParam ? `https://${sourceParam}.com` : null)

    const info = getTrafficInfo(
      effectiveReferer,
      userAgent,
      ipAddress,
      isReturningVisitor,
      customTrafficSources
    )
    
    // Debug logging (development only)
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Smart Rules Debug:", {
        referer,
        sourceParam,
        effectiveReferer,
        detectedSource: info.source,
        device: info.device,
        visitorType: info.visitorType,
        rulesCount: smartRules.length,
        activeRulesCount: smartRules.filter((r) => r.isActive).length,
      })
    }
    
    setTrafficInfo(info)
  }, [smartRules])

  useEffect(() => {
    if (!trafficInfo) return

    let processedBlocks = [...initialBlocks]

    // Sort rules by priority (highest first)
    const activeRules = smartRules
      .filter((r) => r.isActive)
      .sort((a, b) => b.priority - a.priority)

    // Apply each matching rule
    for (const rule of activeRules) {
      const matches = matchesConditions(trafficInfo, rule.conditions)
      
      if (process.env.NODE_ENV === "development") {
        console.log(`🔍 Rule "${rule.name}":`, {
          matches,
          conditions: rule.conditions,
          trafficInfo,
        })
      }
      
      if (matches) {
        processedBlocks = applyRuleAction(processedBlocks, rule.actions)
        if (process.env.NODE_ENV === "development") {
          console.log(`✅ Rule "${rule.name}" applied`)
        }
      }
    }

    // Auto-reorder by traffic source if no reorder rule was applied
    const hasReorderRule = activeRules.some(
      (r) =>
        matchesConditions(trafficInfo, r.conditions) &&
        r.actions.type === "reorder"
    )

    if (!hasReorderRule && trafficInfo.source !== "direct") {
      processedBlocks = autoReorderByTrafficSource(
        processedBlocks,
        trafficInfo.source,
        customTrafficSources
      )
      if (process.env.NODE_ENV === "development") {
        console.log("🔄 Auto-reorder applied for source:", trafficInfo.source)
      }
    }

    setBlocks(processedBlocks)
  }, [trafficInfo, smartRules, initialBlocks])

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

  // Valeurs par défaut selon le thème
  const getDefaultThemeOverrides = () => {
    switch (theme) {
      case "dark":
        return {
          backgroundColor: "#000000",
          textPrimary: "#ffffff",
          textSecondary: "#a1a1aa",
          cardBackground: "#18181b",
          borderColor: "#27272a",
          iconBackground: "#18181b",
          iconHoverBackground: "#27272a",
          usernameColor: "#ffffff",
          iconRadius: 9999,
        }
      case "minimal":
        return {
          backgroundColor: "#ffffff",
          textPrimary: "#111111",
          textSecondary: "#71717a",
          cardBackground: "#ffffff",
          borderColor: "#f4f4f5",
          iconBackground: "#ffffff",
          iconHoverBackground: "#fafafa",
          usernameColor: "#111111",
          iconRadius: 9999,
        }
      case "colorful":
        return {
          backgroundColor: "#faf5ff",
          textPrimary: "#1e1b4b",
          textSecondary: "#6b7280",
          cardBackground: "#ffffff",
          borderColor: "#e9d5ff",
          iconBackground: "#ffffff",
          iconHoverBackground: "#f3e8ff",
          usernameColor: "#1e1b4b",
          iconRadius: 9999,
        }
      default:
        return {
          backgroundColor: "#ffffff",
          textPrimary: "#111111",
          textSecondary: "#4b5563",
          cardBackground: "#ffffff",
          borderColor: "#e5e7eb",
          iconBackground: "#ffffff",
          iconHoverBackground: "#f1f5f9",
          usernameColor: "#111111",
          iconRadius: 9999,
        }
    }
  }

  // Toujours utiliser les valeurs par défaut du thème comme base
  const defaultOverrides = getDefaultThemeOverrides()
  
  // Si themeConfig existe, l'utiliser pour personnaliser, mais garder les valeurs par défaut si une propriété n'est pas définie
  const themeOverrides = {
    ...defaultOverrides,
    ...(themeConfig && typeof themeConfig === 'object' && themeConfig !== null
      ? Object.fromEntries(
          Object.entries(themeConfig).filter(([key]) => 
            key in defaultOverrides
          )
        )
      : {}),
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
  
  // Garantit que toutes les propriétés ont une valeur
  if (!themeOverrides.iconBackground) {
    themeOverrides.iconBackground = defaultOverrides.iconBackground
  }

  // Pour le thème colorful, utiliser les classes CSS Tailwind qui gèrent le dark mode
  const getBackgroundStyle = () => {
    if (theme === "colorful") {
      // Pour colorful, on utilise les classes CSS, pas de style inline pour le background
      return {
        color: themeOverrides.textPrimary,
        minHeight: "100vh",
        width: "100%",
      }
    }
    return {
      backgroundColor: themeOverrides.backgroundColor,
      color: themeOverrides.textPrimary,
      minHeight: "100vh",
      width: "100%",
    }
  }

  // Classes CSS pour le thème colorful (gère automatiquement le dark mode)
  const colorfulBackgroundClass = theme === "colorful" 
    ? "bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950"
    : ""

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-4 py-8 sm:py-12 ${animClasses.pageTransition} ${colorfulBackgroundClass}`}
      style={theme === "colorful" ? {
        color: themeOverrides.textPrimary,
        minHeight: "100vh",
        width: "100%",
      } : getBackgroundStyle()}
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
          themeOverrides={themeOverrides}
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
            className="font-medium hover:underline"
            style={{
              color: (() => {
                // Fonction helper pour calculer la luminosité d'une couleur
                const getLuminance = (color: string): number => {
                  // Gérer les formats hex (#ffffff, ffffff)
                  if (color.startsWith('#')) {
                    const hex = color.replace('#', '')
                    if (hex.length === 6) {
                      const r = parseInt(hex.substring(0, 2), 16)
                      const g = parseInt(hex.substring(2, 4), 16)
                      const b = parseInt(hex.substring(4, 6), 16)
                      return (0.299 * r + 0.587 * g + 0.114 * b) / 255
                    }
                  }
                  // Gérer rgb/rgba
                  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
                  if (rgbMatch) {
                    const r = parseInt(rgbMatch[1])
                    const g = parseInt(rgbMatch[2])
                    const b = parseInt(rgbMatch[3])
                    return (0.299 * r + 0.587 * g + 0.114 * b) / 255
                  }
                  return 0.5 // Par défaut, considérer comme moyen
                }

                // Obtenir la couleur de fond réelle
                const bgColor = themeOverrides.backgroundColor

                // Pour le thème colorful, utiliser une couleur de marque
                if (theme === "colorful") {
                  return "#9333ea" // purple-600 pour un bon contraste
                }

                // Pour tous les autres cas, calculer en fonction de la luminosité du fond
                const luminance = getLuminance(bgColor)
                // Si le fond est sombre (luminance < 0.5), utiliser blanc, sinon noir
                return luminance < 0.5 ? "#ffffff" : "#111111"
              })(),
            }}
          >
            korli
          </Link>
        </div>
      </div>
    </div>
  )
}

