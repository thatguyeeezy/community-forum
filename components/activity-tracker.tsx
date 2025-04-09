// components/activity-tracker.tsx
"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

export function ActivityTracker() {
  const pathname = usePathname()
  const { status } = useSession()

  useEffect(() => {
    // Track user activity on page load and navigation
    const trackActivity = async () => {
      try {
        if (status === "authenticated") {
          await fetch("/api/users/update-activity", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })
        } else {
          // For anonymous users, just ping the activity endpoint
          await fetch("/api/activity", {
            method: "GET",
            cache: "no-store",
            headers: {
              pragma: "no-cache",
              "cache-control": "no-cache",
            },
          })
        }
      } catch (error) {
        console.error("Failed to track activity:", error)
      }
    }

    trackActivity()

    // Set up an interval to update activity every 2 minutes
    const interval = setInterval(trackActivity, 2 * 60 * 1000)

    return () => clearInterval(interval)
  }, [pathname, status])

  // This component doesn't render anything
  return null
}
