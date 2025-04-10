"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Role } from "@prisma/client"

interface OnlineUser {
  id: number
  name: string
  image: string | null
  role: Role
  discordId?: string
  discordJoinedAt?: string
}

export function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [guestCount, setGuestCount] = useState(0) // Add state for guest count
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // Update user activity when component mounts
  useEffect(() => {
    if (session?.user) {
      fetch("/api/users/update-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((err) => console.error("Failed to update activity:", err))
    }
  }, [session])

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/users/online", {
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
          // For each user, try to fetch their Discord join date if they have a discordId
          const usersWithDiscordInfo = await Promise.all(
            data.users.map(async (user: OnlineUser) => {
              if (user.discordId) {
                try {
                  const discordResponse = await fetch(`/api/discord/member/${user.discordId}`, {
                    cache: "no-store",
                  })

                  if (discordResponse.ok) {
                    const discordData = await discordResponse.json()
                    return {
                      ...user,
                      discordJoinedAt: discordData.joinedAt,
                    }
                  }
                } catch (error) {
                  console.error(`Failed to fetch Discord info for user ${user.id}:`, error)
                }
              }
              return user
            }),
          )

          setOnlineUsers(usersWithDiscordInfo)
        } else {
          setOnlineUsers([])
        }

        // Set the guest count from the API response
        setGuestCount(data.guestCount || 0)
      } catch (error) {
        console.error("Failed to fetch online users:", error)
        // Use fallback data if API fails
        if (session?.user) {
          setOnlineUsers([
            {
              id: Number(session.user.id),
              name: session.user.name || "User",
              image: session.user.image || null,
              role: (session.user.role as Role) || "MEMBER",
            },
          ])
        } else {
          setOnlineUsers([])
        }
        setGuestCount(0) // Reset guest count on error
      } finally {
        setLoading(false)
      }
    }

    fetchOnlineUsers()

    // Refresh online users every 60 seconds
    const interval = setInterval(fetchOnlineUsers, 60000)
    return () => clearInterval(interval)
  }, [status, session]) // Re-fetch when session status changes

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700 shadow-md">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // If no users are online, show a message
  if (onlineUsers.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700 shadow-md">
        <CardHeader className="pb-2 space-y-1 border-b border-gray-700">
          <h2 className="text-base font-semibold text-gray-100">Online Users</h2>
          <p className="text-sm text-gray-400">0 users currently online</p>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-gray-300">No users are currently online</p>
          <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-700">
            {guestCount > 0 ? `${guestCount} guest${guestCount === 1 ? "" : "s"} browsing` : "No guests browsing"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700 shadow-md">
      <CardHeader className="pb-2 space-y-1 border-b border-gray-700">
        <h2 className="text-base font-semibold text-gray-100">Online Users</h2>
        <p className="text-sm text-gray-400">{onlineUsers.length} users currently online</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {onlineUsers.map((user) => {
            const initials = user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)

            // Get role badge text and color
            const getRoleBadge = () => {
              switch (user.role) {
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

            const roleBadge = getRoleBadge()

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
                className="flex items-center gap-3 cursor-pointer py-2 hover:bg-gray-700 rounded-md px-2 transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8 border border-gray-700 bg-blue-900 text-blue-300">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-800"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-200">{user.name}</span>
                    <Badge className={roleBadge.color}>{roleBadge.text}</Badge>
                  </div>
                  <p className="text-sm text-gray-400">
                    {joinDate ? `Joined ${joinDate}` : pathname === "/" ? "Browsing forums" : "Online"}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-700">
          {guestCount > 0 ? `and ${guestCount} guest${guestCount === 1 ? "" : "s"} browsing` : "No guests browsing"}
        </p>
      </CardContent>
    </Card>
  )
}
