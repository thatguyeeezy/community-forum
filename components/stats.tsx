"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatsData {
  userCount: number
  threadCount: number
  postCount: number
  onlineCount: number
}

export function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/metrics", {
          cache: "no-store",
          headers: {
            pragma: "no-cache",
            "cache-control": "no-cache",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch stats")
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Fallback data
        setStats({
          userCount: 0,
          threadCount: 0,
          postCount: 0,
          onlineCount: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-700 shadow-md">
            <CardContent className="p-4">
              <Skeleton className="h-8 w-24 bg-gray-700" />
              <Skeleton className="h-4 w-full mt-2 bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const statItems = [
    {
      title: stats.userCount.toLocaleString(),
      description: "Registered Users",
      icon: "👥",
    },
    {
      title: stats.threadCount.toLocaleString(),
      description: "Discussion Threads",
      icon: "📝",
    },
    {
      title: stats.postCount.toLocaleString(),
      description: "Total Posts",
      icon: "💬",
    },
    {
      title: stats.onlineCount.toLocaleString(),
      description: "Users Online",
      icon: "🟢",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {statItems.map((item, index) => (
        <Card key={index} className="bg-gray-800 border-gray-700 shadow-md hover:bg-gray-700 transition-colors">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="text-2xl font-bold text-gray-100">{item.title}</div>
            <p className="text-sm text-gray-400">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
