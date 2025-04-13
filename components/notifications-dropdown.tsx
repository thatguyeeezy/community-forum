"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: number
  type: string
  message: string
  read: boolean
  link: string | null
  createdAt: string
}

export function NotificationsDropdown() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (session?.user) {
      fetchNotifications()
    }
  }, [session])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/notifications?limit=5", {
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      })

      if (response.ok) {
        // Update local state
        setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "follow":
        return "👤"
      case "application":
        return "📝"
      case "mention":
        return "💬"
      default:
        return "🔔"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "recently"
    }
  }

  if (!session?.user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 dark:bg-gray-800 bg-white">
        <div className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700 border-gray-200">
          <h3 className="font-medium dark:text-gray-100 text-gray-900">Notifications</h3>
          <Link
            href={`/profile/${session.user.id}?tab=notifications`}
            className="text-sm dark:text-blue-400 text-blue-600 hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="p-4 text-center dark:text-gray-400 text-gray-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center dark:text-gray-400 text-gray-500">No notifications yet</div>
        ) : (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                asChild
                className={`px-4 py-3 cursor-pointer ${!notification.read ? "dark:bg-gray-700/50 bg-gray-100" : ""}`}
              >
                <Link href={notification.link || "#"} onClick={() => !notification.read && markAsRead(notification.id)}>
                  <div className="flex items-start gap-3">
                    <div className="text-xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm dark:text-gray-200 text-gray-800">{notification.message}</p>
                      <p className="text-xs dark:text-gray-400 text-gray-500">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1"></div>}
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="dark:bg-gray-700 bg-gray-200" />
            <DropdownMenuItem asChild className="justify-center">
              <Link
                href={`/profile/${session.user.id}?tab=notifications`}
                className="text-sm dark:text-gray-300 text-gray-600 py-2 text-center"
              >
                See all notifications
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
