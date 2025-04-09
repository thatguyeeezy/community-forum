"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Role } from "@prisma/client"

interface OnlineUser {
  id: number
  name: string | null
  image: string | null
  role: Role
  discordId?: string
  discordJoinedAt?: string
  status?: string
  department?: string
}

export function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [guestCount, setGuestCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/discord/online-users", {
          cache: "no-store",
          headers: {
            pragma: "no-cache",
            "cache-control": "no-cache",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch online users")
        }

        const data = await response.json()

        if (Array.isArray(data.users)) {
          setOnlineUsers(data.users)
        } else {
          setOnlineUsers([])
        }

        setGuestCount(data.guestCount || 0)
      } catch (error) {
        console.error("Failed to fetch online users:", error)
        setOnlineUsers([])
        setGuestCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchOnlineUsers()

    // Refresh online users every 60 seconds
    const interval = setInterval(fetchOnlineUsers, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="bg-background border-border">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // If no users are online, show a message
  if (onlineUsers.length === 0) {
    return (
      <Card className="bg-background border-border">
        <CardHeader className="pb-2 space-y-1">
          <h2 className="text-base font-semibold">Online Users</h2>
          <p className="text-sm text-muted-foreground">0 users currently online</p>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">No users are currently online</p>
          <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
            {guestCount > 0 ? `${guestCount} guest${guestCount === 1 ? "" : "s"} browsing` : "No guests browsing"}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Get role badge text and color
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case "HEAD_ADMIN":
        return { text: "Head Admin", color: "bg-cyan-500 text-white" }
      case "SENIOR_ADMIN":
        return { text: "Sr Admin", color: "bg-purple-500 text-white" }
      case "ADMIN":
        return { text: "Admin", color: "bg-red-800 text-white" }
      case "JUNIOR_ADMIN":
        return { text: "Jr Admin", color: "bg-blue-800 text-white" }
      case "SENIOR_STAFF":
        return { text: "Sr Staff", color: "bg-green-800 text-white" }
      case "STAFF":
        return { text: "Staff", color: "bg-yellow-500 text-black" }
      case "STAFF_IN_TRAINING":
        return { text: "Trainee", color: "bg-red-400 text-white" }
      case "MEMBER":
        return { text: "Member", color: "bg-blue-400 text-white" }
      default:
        return { text: "Member", color: "bg-blue-400 text-white" }
    }
  }

  // Get status indicator color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "dnd":
        return "bg-red-500"
      default:
        return "bg-green-500" // Default to online
    }
  }

  return (
    <Card className="bg-background border-border">
      <CardHeader className="pb-2 space-y-1">
        <h2 className="text-base font-semibold">Online Users</h2>
        <p className="text-sm text-muted-foreground">{onlineUsers.length} users currently online</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {onlineUsers.map((user) => {
            const initials = user.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "??"

            const roleBadge = getRoleBadge(user.role)
            const statusColor = getStatusColor(user.status)

            // Format join date if available
            const joinDate = user.discordJoinedAt
              ? new Date(user.discordJoinedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })
              : null

            return (
              <div
                key={user.id}
                onClick={() => router.push(`/profile/${user.id}`)}
                className="flex items-center gap-3 cursor-pointer py-2"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${statusColor} rounded-full border-2 border-background`}
                  ></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{user.name}</span>
                    <Badge className={roleBadge.color}>{roleBadge.text}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user.department && user.department !== "N_A"
                      ? user.department
                      : joinDate
                        ? `Joined ${joinDate}`
                        : "Online"}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
          {guestCount > 0 ? `and ${guestCount} guest${guestCount === 1 ? "" : "s"} browsing` : "No guests browsing"}
        </p>
      </CardContent>
    </Card>
  )
}
