"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

export function ActivityTracker() {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user) return

    // Update activity when component mounts
    updateActivity()

    // Set up interval to update activity every 5 minutes
    const interval = setInterval(updateActivity, 5 * 60 * 1000)

    // Also update on visibility change (when user returns to the tab)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [session])

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      updateActivity()
    }
  }

  const updateActivity = async () => {
    if (!session?.user) return

    try {
      console.log("Updating user activity...")
      const response = await fetch("/api/users/update-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.error("Failed to update activity:", await response.text())
      }
    } catch (error) {
      console.error("Error updating activity:", error)
    }
  }

  return null // This component doesn't render anything
}
