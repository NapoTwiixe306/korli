"use client"

import { useEffect } from "react"

export function PageViewTracker({
  userPageId,
  visitorId,
  sessionId,
  variant,
  ruleIds,
}: {
  userPageId: string
  visitorId?: string
  sessionId?: string
  variant?: string
  ruleIds?: string[]
}) {
  useEffect(() => {
    // Track page view
    fetch("/api/analytics/page-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userPageId, visitorId, sessionId, variant, ruleIds }),
    }).catch(console.error)
  }, [userPageId, visitorId, sessionId, variant, ruleIds])

  return null
}

export function BlockClickTracker({ blockId, children }: { blockId: string; children: React.ReactNode }) {
  return <>{children}</>
}

