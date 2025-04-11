"use client"

import { useEffect, useState } from "react"

type ServerStatusProps = {
  className?: string
}

type StatusData = {
  totalMembers: number
  activeToday: number
  discordMembers: number
  serverStatus: {
    online: boolean
    playerCount: number
  }
}

export function ServerStatus({ className = "" }: ServerStatusProps) {
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/metrics")

        if (!response.ok) {
          throw new Error("Failed to fetch server status")
        }

        const statusData = await response.json()
        setData(statusData)
      } catch (err) {
        console.error("Error fetching server status:", err)
        setError("Could not load server status")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Refresh data every 60 seconds
    const intervalId = setInterval(fetchData, 60000)

    return () => clearInterval(intervalId)
  }, [])

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 shadow-md p-5 border-l-4 border-blue-500 ${className}`}>
        <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">Server Status</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4"></div>
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-1 mx-auto w-16"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
            </div>
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-1 mx-auto w-16"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 shadow-md p-5 border-l-4 border-red-500 ${className}`}>
        <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">Server Status</h3>
        <p className="text-gray-700 dark:text-gray-300">{error}</p>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-md p-5 border-l-4 border-blue-500 ${className}`}>
      <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">Server Status</h3>
      <div className="flex items-center space-x-2 mb-4">
        <span className={`w-3 h-3 ${data?.serverStatus.online ? "bg-green-500" : "bg-red-500"} rounded-full`}></span>
        <span className="text-gray-700 dark:text-gray-300">
          {data?.serverStatus.online ? `Online: ${data.serverStatus.playerCount} players` : "Offline"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-6 text-center">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data?.totalMembers || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Members</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data?.discordMembers || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Discord</div>
        </div>
      </div>
    </div>
  )
}
