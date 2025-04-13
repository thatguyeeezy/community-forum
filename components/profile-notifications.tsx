"use client"

import { useEffect, useState } from "react"
import { Bell, Check, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Notification {
  id: number
  type: string
  message: string
  read: boolean
  createdAt: string
  link: string | null
}

export function ProfileNotifications({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true)
        const response = await fetch(`/api/notifications?limit=20`, {
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [userId])

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
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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

  if (loading) {
    return (
      <div className="bg-gray-800 shadow-md rounded-md overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="font-bold text-gray-100">Notifications</h3>
        </div>
        <div className="p-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-start space-x-4 mb-4 pb-4 border-b border-gray-700 last:border-0 last:mb-0 last:pb-0"
            >
              <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-gray-700" />
                <Skeleton className="h-3 w-1/4 bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 shadow-md rounded-md overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-bold text-gray-100">Notifications</h3>
        <p className="text-sm text-gray-400">Your recent notifications</p>
      </div>
      <div className="p-4">
        {notifications.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="mx-auto h-12 w-12 text-gray-500 mb-3" />
            <h3 className="text-lg font-medium text-gray-300">No notifications yet</h3>
            <p className="text-gray-400 mt-1">When you get notifications, they'll appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-4 p-3 rounded-md ${
                  notification.read ? "bg-gray-800" : "bg-gray-700"
                }`}
              >
                <div className="text-xl">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <p className="text-gray-200">{notification.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(notification.createdAt)}
                    </p>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-3 w-3 mr-1" /> Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
