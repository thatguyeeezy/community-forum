"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

type Notification = {
  id: number
  title: string
  content: string
  read: boolean
  createdAt: string
  recipientId: number
  type: string
  linkUrl?: string
}

export function NotificationsDropdown() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user) return

      try {
        setIsLoading(true)
        const response = await fetch("/api/notifications?limit=5")

        if (response.ok) {
          const data = await response.json()
          console.log("Notifications response:", data)

          if (data.notifications && Array.isArray(data.notifications)) {
            setNotifications(data.notifications)
            setUnreadCount(data.unreadCount || 0)
          } else {
            console.error("Invalid notifications format:", data)
            setNotifications([])
            setUnreadCount(0)
          }
        } else {
          console.error("Failed to fetch notifications:", response.statusText)
          setNotifications([])
          setUnreadCount(0)
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
        setNotifications([])
        setUnreadCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user) {
      fetchNotifications()

      // Refresh notifications every minute
      const interval = setInterval(fetchNotifications, 60000)
      return () => clearInterval(interval)
    }
  }, [session])

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      })

      if (response.ok) {
        setNotifications(
          notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
          ),
        )
        setUnreadCount(Math.max(0, unreadCount - 1))
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
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
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Notifications</p>
            <p className="text-xs leading-none text-gray-500">
              {unreadCount} unread notification{unreadCount !== 1 && "s"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-400"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b border-gray-700 last:border-0 ${!notification.read ? "bg-gray-700" : ""}`}
              >
                <DropdownMenuItem
                  className="cursor-pointer flex flex-col items-start p-0"
                  onClick={() => markAsRead(notification.id)}
                >
                  {notification.linkUrl ? (
                    <Link href={notification.linkUrl} className="w-full">
                      <div className="w-full">
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-gray-400">{notification.content}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="w-full">
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-gray-400">{notification.content}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  )}
                </DropdownMenuItem>
              </div>
            ))
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="w-full cursor-pointer text-center">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
