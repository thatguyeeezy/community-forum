"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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

  function getRoleColor(role: string) {
    switch (role) {
      case "ADMIN":
        return "text-red-400"
      case "MODERATOR":
        return "text-blue-400"
      default:
        return "text-gray-400"
    }
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card className="bg-gray-800 border-gray-700 shadow-md">
      <CardHeader className="border-b border-gray-700 px-4 py-3">
        <CardTitle className="text-xl font-bold text-gray-100">Online Users</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
          </div>
        ) : users.length > 0 ? (
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                <div className="relative">
                  <Avatar className="h-8 w-8 bg-blue-900 text-blue-300">
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-gray-800"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{user.name}</p>
                </div>
                <div className={`text-xs ${getRoleColor(user.role)}`}>{user.role}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No users are currently online</p>
        )}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            {guestCount > 0 ? `${guestCount} guest${guestCount !== 1 ? "s" : ""} browsing` : "No guests browsing"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
