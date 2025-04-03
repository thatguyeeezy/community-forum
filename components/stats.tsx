// components/stats.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Activity, MessageCircle, GamepadIcon } from "lucide-react"

interface Metrics {
  totalMembers: number
  activeToday: number
  discordMembers: number
  serverStatus: {
    online: boolean
    playerCount: number
  }
}

export function Stats() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalMembers: 0,
    activeToday: 0,
    discordMembers: 0,
    serverStatus: {
      online: false,
      playerCount: 0,
    },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/metrics", {
          cache: "no-store",
          headers: {
            pragma: "no-cache",
            "cache-control": "no-cache",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch metrics")
        }

        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error("Failed to fetch metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    // Refresh metrics every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Total Members</span>
            <span className="text-2xl font-bold">
              {loading ? <span className="animate-pulse">...</span> : metrics.totalMembers.toLocaleString()}
            </span>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Users className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Active Today</span>
            <span className="text-2xl font-bold">
              {loading ? <span className="animate-pulse">...</span> : metrics.activeToday.toLocaleString()}
            </span>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Activity className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Discord Members</span>
            <span className="text-2xl font-bold">
              {loading ? <span className="animate-pulse">...</span> : metrics.discordMembers.toLocaleString()}
            </span>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Server Status</span>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${metrics.serverStatus.online ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-2xl font-bold">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : metrics.serverStatus.online ? (
                  `${metrics.serverStatus.playerCount} Online`
                ) : (
                  "Offline"
                )}
              </span>
            </div>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <GamepadIcon className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

