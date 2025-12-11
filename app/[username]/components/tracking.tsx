"use client"

import { useEffect } from "react"

export function PageViewTracker({
  userPageId,
  visitorId,
  ruleIds,
}: {
  userPageId: string
  visitorId?: string
  ruleIds?: string[]
}) {
  useEffect(() => {
    // Track page view
    fetch("/api/analytics/page-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userPageId, visitorId, ruleIds }),
    }).catch(console.error)
  }, [userPageId, visitorId, ruleIds])

  return null
}

export function BlockClickTracker({ blockId, children }: { blockId: string; children: React.ReactNode }) {
  return <>{children}</>
}

