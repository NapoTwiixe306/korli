"use client"

import { useEffect } from "react"

interface TrackingProps {
  userPageId: string
  blockId?: string
}

export function PageViewTracker({ userPageId }: { userPageId: string }) {
  useEffect(() => {
    // Track page view
    fetch("/api/analytics/page-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userPageId }),
    }).catch(console.error)
  }, [userPageId])

  return null
}

export function BlockClickTracker({ blockId, children }: { blockId: string; children: React.ReactNode }) {
  return <>{children}</>
}

