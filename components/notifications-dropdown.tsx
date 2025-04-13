"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import { useSession } from "next-auth/react"

interface Notification {
  id: number
  type: string
  message: string
  read: boolean
  createdAt: string
  link: string
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user) return

    async function fetchNotifications() {
      try {
        setLoading(true)
        const response = await fetch(`/api/notifications?limit=5`, {
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()
          setNotifications(data)
          setUnreadCount(data.filter((n: Notification) => !n.read).length)
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 60000) // Check every minute

    return () => clearInterval(interval)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    return date.toLocaleDateString()
  }

  if (!session?.user) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="bg-gray-800 text-gray-100 rounded-md overflow-hidden">
          <div className="p-3 border-b border-gray-700 flex justify-between items-center">
            <h4 className="font-medium">Notifications</h4>
            {unreadCount > 0 && (
              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{unreadCount} new</span>
            )}
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <Bell className="mx-auto h-8 w-8 opacity-50 mb-2" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-700 last:border-0 ${!notification.read ? "bg-gray-700" : ""}`}
                >
                  <Link
                    href={notification.link}
                    className="block"
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id)
                      }
                      setOpen(false)
                    }}
                  >
                    <p className="text-sm text-gray-200">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(notification.createdAt)}</p>
                  </Link>
                </div>
              ))
            )}
          </div>
          <div className="p-2 border-t border-gray-700">
            <Link
              href={`/profile/${session.user.id}`}
              className="block text-center text-xs text-blue-400 hover:text-blue-300 p-1"
              onClick={() => setOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
