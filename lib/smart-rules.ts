/**
 * Smart Rules - Logic for detecting traffic and applying rules
 */

export interface TrafficInfo {
  source: string // "tiktok" | "instagram" | "youtube" | "twitter" | "google" | "direct"
  device: "mobile" | "desktop"
  country: string | null
  time: {
    hour: number // 0-23
    dayOfWeek: number // 0-6 (0 = Sunday)
  }
  visitorType: "new" | "returning"
}

export interface RuleCondition {
  trafficSource?: string[]
  device?: string[]
  country?: string[]
  timeRange?: { start: string; end: string } // Format: "HH:mm"
  dayOfWeek?: number[] // 0-6
  visitorType?: "new" | "returning"
}

export interface RuleAction {
  type: "show" | "hide" | "reorder"
  blockIds?: string[]
  order?: number[] // For reorder action
}

/**
 * Detect traffic source from referer URL
 */
export function detectTrafficSource(referer: string | null | undefined): string {
  if (!referer) {
    console.log("⚠️ No referer detected, returning 'direct'")
    return "direct"
  }

  const refererLower = referer.toLowerCase()
  console.log("🔍 Analyzing referer:", refererLower)

  if (refererLower.includes("tiktok.com")) {
    console.log("✅ Detected: tiktok")
    return "tiktok"
  }
  if (refererLower.includes("instagram.com") || refererLower.includes("ig.me")) {
    console.log("✅ Detected: instagram")
    return "instagram"
  }
  if (refererLower.includes("youtube.com") || refererLower.includes("youtu.be")) {
    console.log("✅ Detected: youtube")
    return "youtube"
  }
  if (refererLower.includes("twitter.com") || refererLower.includes("x.com")) {
    console.log("✅ Detected: twitter")
    return "twitter"
  }
  if (refererLower.includes("google.com") || refererLower.includes("google.fr")) {
    console.log("✅ Detected: google")
    return "google"
  }
  if (refererLower.includes("facebook.com")) {
    console.log("✅ Detected: facebook")
    return "facebook"
  }
  if (refererLower.includes("linkedin.com")) {
    console.log("✅ Detected: linkedin")
    return "linkedin"
  }
  if (refererLower.includes("pinterest.com")) {
    console.log("✅ Detected: pinterest")
    return "pinterest"
  }
  if (refererLower.includes("snapchat.com")) {
    console.log("✅ Detected: snapchat")
    return "snapchat"
  }

  console.log("⚠️ Unknown referer, returning 'direct'")
  return "direct"
}

/**
 * Detect device type from user agent
 */
export function detectDevice(userAgent: string | null | undefined): "mobile" | "desktop" {
  if (!userAgent) return "desktop"

  const ua = userAgent.toLowerCase()
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i

  return mobileRegex.test(ua) ? "mobile" : "desktop"
}

/**
 * Detect country from IP (simplified - in production use a geolocation service)
 * For now, returns null. You can integrate with a service like MaxMind or ipapi.co
 */
export function detectCountry(ipAddress: string | null | undefined): string | null {
  // TODO: Integrate with geolocation service
  // For now, return null (no country filtering)
  return null
}

/**
 * Check if current time matches time range
 */
export function matchesTimeRange(
  hour: number,
  timeRange?: { start: string; end: string }
): boolean {
  if (!timeRange) return true

  const [startHourStr, startMinStr] = timeRange.start.split(":")
  const [endHourStr, endMinStr] = timeRange.end.split(":")
  const startHour = Number(startHourStr)
  const startMin = Number(startMinStr)
  const endHour = Number(endHourStr)
  const endMin = Number(endMinStr)

  const currentMinutes = hour * 60
  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

  if (startMinutes <= endMinutes) {
    // Normal range (e.g., 09:00 to 17:00)
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes
  } else {
    // Overnight range (e.g., 22:00 to 06:00)
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes
  }
}

/**
 * Check if traffic info matches rule conditions
 */
export function matchesConditions(
  trafficInfo: TrafficInfo,
  conditions: RuleCondition
): boolean {
  // Traffic source
  if (conditions.trafficSource && conditions.trafficSource.length > 0) {
    if (!conditions.trafficSource.includes(trafficInfo.source)) {
      return false
    }
  }

  // Device
  if (conditions.device && conditions.device.length > 0) {
    if (!conditions.device.includes(trafficInfo.device)) {
      return false
    }
  }

  // Country
  if (conditions.country && conditions.country.length > 0) {
    if (!trafficInfo.country || !conditions.country.includes(trafficInfo.country)) {
      return false
    }
  }

  // Time range
  if (conditions.timeRange) {
    if (!matchesTimeRange(trafficInfo.time.hour, conditions.timeRange)) {
      return false
    }
  }

  // Day of week
  if (conditions.dayOfWeek && conditions.dayOfWeek.length > 0) {
    if (!conditions.dayOfWeek.includes(trafficInfo.time.dayOfWeek)) {
      return false
    }
  }

  // Visitor type
  if (conditions.visitorType) {
    if (trafficInfo.visitorType !== conditions.visitorType) {
      return false
    }
  }

  return true
}

/**
 * Apply rule actions to blocks
 */
export function applyRuleAction<T extends { id: string }>(
  blocks: T[],
  action: RuleAction
): T[] {
  if (action.type === "show") {
    // Show only specified blocks
    if (action.blockIds && action.blockIds.length > 0) {
      return blocks.filter((block) => action.blockIds!.includes(block.id))
    }
    return blocks
  }

  if (action.type === "hide") {
    // Hide specified blocks
    if (action.blockIds && action.blockIds.length > 0) {
      return blocks.filter((block) => !action.blockIds!.includes(block.id))
    }
    return blocks
  }

  if (action.type === "reorder") {
    // Reorder blocks according to order array
    if (action.order && action.order.length > 0) {
      const blockMap = new Map(blocks.map((block) => [block.id, block]))
      const reordered: T[] = []

      // Add blocks in specified order
      for (const blockId of action.order) {
        const block = blockMap.get(String(blockId))
        if (block) {
          reordered.push(block)
          blockMap.delete(String(blockId))
        }
      }

      // Add remaining blocks
      for (const block of blockMap.values()) {
        reordered.push(block)
      }

      return reordered
    }
    return blocks
  }

  return blocks
}

/**
 * Auto-reorder blocks based on traffic source
 * If traffic comes from TikTok, show TikTok links first, etc.
 */
export function autoReorderByTrafficSource<T extends { id: string; url: string | null }>(
  blocks: T[],
  trafficSource: string
): T[] {
  const sourceDomains: Record<string, string[]> = {
    tiktok: ["tiktok.com"],
    instagram: ["instagram.com", "ig.me"],
    youtube: ["youtube.com", "youtu.be"],
    twitter: ["twitter.com", "x.com"],
    facebook: ["facebook.com", "fb.com"],
    linkedin: ["linkedin.com"],
    pinterest: ["pinterest.com"],
    snapchat: ["snapchat.com"],
  }

  const relevantDomains = sourceDomains[trafficSource] || []
  if (relevantDomains.length === 0) return blocks

  const matching: T[] = []
  const others: T[] = []

  for (const block of blocks) {
    const url = (block.url || "").toLowerCase()
    const matches = relevantDomains.some((domain) => url.includes(domain))

    if (matches) {
      matching.push(block)
    } else {
      others.push(block)
    }
  }

  return [...matching, ...others]
}

/**
 * Get traffic info from request headers
 */
export function getTrafficInfo(
  referer: string | null | undefined,
  userAgent: string | null | undefined,
  ipAddress: string | null | undefined,
  isReturningVisitor: boolean
): TrafficInfo {
  const now = new Date()

  return {
    source: detectTrafficSource(referer),
    device: detectDevice(userAgent),
    country: detectCountry(ipAddress),
    time: {
      hour: now.getHours(),
      dayOfWeek: now.getDay(),
    },
    visitorType: isReturningVisitor ? "returning" : "new",
  }
}

