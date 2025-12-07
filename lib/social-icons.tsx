import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaPinterest,
  FaDiscord,
  FaSnapchat,
  FaTwitch,
  FaBehance,
  FaGithub,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLink,
  FaCreditCard,
  FaShoppingCart,
  FaBlog,
  FaPodcast,
  FaNewspaper,
} from "react-icons/fa"
import type { IconType } from "react-icons"

/**
 * Social media icon configuration.
 */
export interface SocialIconConfig {
  name: string
  icon: IconType
  color: string
}

/**
 * Map of social icon names to their configurations.
 * Supports both "twitter" and "twitter/x" for backward compatibility.
 */
export const SOCIAL_ICONS_MAP: Record<string, SocialIconConfig> = {
  facebook: { name: "Facebook", icon: FaFacebook, color: "#1877F2" },
  instagram: { name: "Instagram", icon: FaInstagram, color: "#E4405F" },
  "twitter/x": { name: "Twitter/X", icon: FaTwitter, color: "#1DA1F2" },
  twitter: { name: "Twitter/X", icon: FaTwitter, color: "#1DA1F2" },
  linkedin: { name: "LinkedIn", icon: FaLinkedin, color: "#0077B5" },
  youtube: { name: "YouTube", icon: FaYoutube, color: "#FF0000" },
  tiktok: { name: "TikTok", icon: FaTiktok, color: "#000000" },
  pinterest: { name: "Pinterest", icon: FaPinterest, color: "#BD081C" },
  discord: { name: "Discord", icon: FaDiscord, color: "#5865F2" },
  snapchat: { name: "Snapchat", icon: FaSnapchat, color: "#FFFC00" },
  twitch: { name: "Twitch", icon: FaTwitch, color: "#9146FF" },
  behance: { name: "Behance", icon: FaBehance, color: "#1769FF" },
  github: { name: "GitHub", icon: FaGithub, color: "#181717" },
  "site web": { name: "Site web", icon: FaGlobe, color: "#4A90E2" },
  email: { name: "Email", icon: FaEnvelope, color: "#EA4335" },
  téléphone: { name: "Téléphone", icon: FaPhone, color: "#34A853" },
  localisation: { name: "Localisation", icon: FaMapMarkerAlt, color: "#EA4335" },
  lien: { name: "Lien", icon: FaLink, color: "#6B7280" },
  paiement: { name: "Paiement", icon: FaCreditCard, color: "#6366F1" },
  boutique: { name: "Boutique", icon: FaShoppingCart, color: "#10B981" },
  blog: { name: "Blog", icon: FaBlog, color: "#8B5CF6" },
  podcast: { name: "Podcast", icon: FaPodcast, color: "#9333EA" },
  newsletter: { name: "Newsletter", icon: FaNewspaper, color: "#F59E0B" },
}

/**
 * List of social icons for UI display (no duplicates).
 * Used in block form for icon selection.
 */
export const SOCIAL_ICONS_LIST: SocialIconConfig[] = [
  { name: "Facebook", icon: FaFacebook, color: "#1877F2" },
  { name: "Instagram", icon: FaInstagram, color: "#E4405F" },
  { name: "Twitter/X", icon: FaTwitter, color: "#1DA1F2" },
  { name: "LinkedIn", icon: FaLinkedin, color: "#0077B5" },
  { name: "YouTube", icon: FaYoutube, color: "#FF0000" },
  { name: "TikTok", icon: FaTiktok, color: "#000000" },
  { name: "Pinterest", icon: FaPinterest, color: "#BD081C" },
  { name: "Discord", icon: FaDiscord, color: "#5865F2" },
  { name: "Snapchat", icon: FaSnapchat, color: "#FFFC00" },
  { name: "Twitch", icon: FaTwitch, color: "#9146FF" },
  { name: "Behance", icon: FaBehance, color: "#1769FF" },
  { name: "GitHub", icon: FaGithub, color: "#181717" },
  { name: "Site web", icon: FaGlobe, color: "#4A90E2" },
  { name: "Email", icon: FaEnvelope, color: "#EA4335" },
  { name: "Téléphone", icon: FaPhone, color: "#34A853" },
  { name: "Localisation", icon: FaMapMarkerAlt, color: "#EA4335" },
  { name: "Lien", icon: FaLink, color: "#6B7280" },
  { name: "Paiement", icon: FaCreditCard, color: "#6366F1" },
  { name: "Boutique", icon: FaShoppingCart, color: "#10B981" },
  { name: "Blog", icon: FaBlog, color: "#8B5CF6" },
  { name: "Podcast", icon: FaPodcast, color: "#9333EA" },
  { name: "Newsletter", icon: FaNewspaper, color: "#F59E0B" },
]

/**
 * Retrieves social icon configuration from icon string.
 * 
 * @param iconString - Icon identifier in format "icon:name" or emoji
 * @returns SocialIconConfig if found, null otherwise
 * 
 * @example
 * ```ts
 * getSocialIcon("icon:instagram") // Returns Instagram config
 * getSocialIcon("🔥") // Returns null (emoji)
 * ```
 */
export function getSocialIcon(iconString: string | null): SocialIconConfig | null {
  if (!iconString) return null
  
  if (iconString.startsWith("icon:")) {
    const iconName = iconString.replace("icon:", "").toLowerCase()
    return SOCIAL_ICONS_MAP[iconName] || null
  }
  
  return null
}
