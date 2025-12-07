/**
 * Theme system for user pages.
 * 
 * Provides predefined themes with consistent styling across all page elements.
 * Each theme includes colors, backgrounds, borders, and hover states.
 */

export type Theme = "default" | "minimal" | "dark" | "colorful"

/**
 * CSS class mappings for theme styling.
 */
export interface ThemeStyles {
  background: string
  cardBackground: string
  textPrimary: string
  textSecondary: string
  border: string
  buttonBackground: string
  buttonText: string
  buttonHover: string
  buttonHoverBg: string
  avatarBorder: string
}

/**
 * Available themes with their style configurations.
 */
export const themes: Record<Theme, ThemeStyles> = {
  default: {
    background: "bg-zinc-50 dark:bg-black",
    cardBackground: "bg-white dark:bg-zinc-900",
    textPrimary: "text-black dark:text-white",
    textSecondary: "text-zinc-600 dark:text-zinc-400",
    border: "border-zinc-200 dark:border-zinc-800",
    buttonBackground: "bg-black dark:bg-white",
    buttonText: "text-white dark:text-black",
    buttonHover: "hover:bg-zinc-100 dark:hover:bg-zinc-800",
    buttonHoverBg: "hover:bg-zinc-100 dark:hover:bg-zinc-800",
    avatarBorder: "border-white dark:border-zinc-800",
  },
  minimal: {
    background: "bg-white",
    cardBackground: "bg-white",
    textPrimary: "text-black",
    textSecondary: "text-zinc-500",
    border: "border-zinc-100",
    buttonBackground: "bg-black",
    buttonText: "text-white",
    buttonHover: "hover:bg-zinc-50",
    buttonHoverBg: "hover:bg-zinc-50",
    avatarBorder: "border-zinc-100",
  },
  dark: {
    background: "bg-black",
    cardBackground: "bg-zinc-950",
    textPrimary: "text-white",
    textSecondary: "text-zinc-400",
    border: "border-zinc-800",
    buttonBackground: "bg-white",
    buttonText: "text-black",
    buttonHover: "hover:bg-zinc-900",
    buttonHoverBg: "hover:bg-zinc-900",
    avatarBorder: "border-zinc-800",
  },
  colorful: {
    background: "bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950",
    cardBackground: "bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80",
    textPrimary: "text-gray-900 dark:text-white",
    textSecondary: "text-gray-600 dark:text-gray-300",
    border: "border-purple-200 dark:border-purple-800",
    buttonBackground: "bg-gradient-to-r from-purple-600 to-pink-600",
    buttonText: "text-white",
    buttonHover: "hover:from-purple-500 hover:to-pink-500",
    buttonHoverBg: "hover:bg-purple-100 dark:hover:bg-purple-900/50",
    avatarBorder: "border-4 border-purple-300 dark:border-purple-700",
  },
}

/**
 * Retrieves CSS classes for a given theme.
 * 
 * @param theme - Theme identifier
 * @returns ThemeStyles object with Tailwind CSS classes
 */
export function getThemeClasses(theme: Theme): ThemeStyles {
  return themes[theme] || themes.default
}
