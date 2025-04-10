"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, MessageSquare, FileText, Activity } from "lucide-react"

type StatsData = {
  userCount: number
  threadCount: number
  postCount: number
  activeUsers: number
}

export function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/metrics")
        const data = await response.json()
        setStats(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching stats:", error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2 bg-gray-700" />
              <Skeleton className="h-8 w-16 bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Members */}
      <Card className="bg-gray-800 border-gray-700 shadow-md">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-400">Total Members</div>
            <div className="text-xl font-bold text-gray-100">{stats?.userCount.toLocaleString() || 0}</div>
          </div>
          <div className="text-blue-400">
            <Users className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* Active Today */}
      <Card className="bg-gray-800 border-gray-700 shadow-md">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-400">Active Today</div>
            <div className="text-xl font-bold text-gray-100">{stats?.activeUsers.toLocaleString() || 0}</div>
          </div>
          <div className="text-blue-400">
            <Activity className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* Threads */}
      <Card className="bg-gray-800 border-gray-700 shadow-md">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-400">Threads</div>
            <div className="text-xl font-bold text-gray-100">{stats?.threadCount.toLocaleString() || 0}</div>
          </div>
          <div className="text-blue-400">
            <MessageSquare className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <Card className="bg-gray-800 border-gray-700 shadow-md">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-400">Posts</div>
            <div className="text-xl font-bold text-gray-100">{stats?.postCount.toLocaleString() || 0}</div>
          </div>
          <div className="text-blue-400">
            <FileText className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
