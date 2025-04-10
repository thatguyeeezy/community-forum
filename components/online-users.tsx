"use client"

import { useEffect, useState } from "react"

type OnlineUser = {
  id: number
  name: string
  image: string | null
  role: string
  lastActive: Date
}

export function OnlineUsers() {
  const [users, setUsers] = useState<OnlineUser[]>([])
  const [guestCount, setGuestCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOnlineUsers() {
      try {
        const response = await fetch("/api/users/online")
        const data = await response.json()
        setUsers(data.users)
        setGuestCount(data.guestCount)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching online users:", error)
        setLoading(false)
      }
    }

    fetchOnlineUsers()
    const interval = setInterval(fetchOnlineUsers, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#1e2330] rounded-md overflow-hidden">
      <div className="border-b border-[#2d3139] px-4 py-3">
        <h2 className="text-lg font-bold">Online Users</h2>
      </div>
      <div className="p-4">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-10 bg-[#2d3139] rounded"></div>
            <div className="h-10 bg-[#2d3139] rounded"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
                <div className="text-xs text-gray-400">{user.role}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No users are currently online</p>
        )}
        <div className="mt-4 pt-4 border-t border-[#2d3139]">
          <p className="text-xs text-gray-500">
            {guestCount > 0 ? `${guestCount} guest${guestCount !== 1 ? "s" : ""} browsing` : "No guests browsing"}
          </p>
        </div>
      </div>
    </div>
  )
}
