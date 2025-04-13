"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Notification {
  id: number
  type: string
  message: string
  read: boolean
  link: string | null
  createdAt: string
}

interface NotificationsListProps {
  userId: number | string
}

export function NotificationsList({ userId }: NotificationsListProps) {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const limit = 20

  const isOwnProfile = session?.user?.id === Number(userId)

  useEffect(() => {
    if (isOwnProfile) {
      fetchNotifications()
    }
  }, [isOwnProfile, page])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/notifications?limit=${limit}&page=${page}`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (response.ok) {
        const data = await response.json()

        if (page === 1) {
          setNotifications(data.notifications)
        } else {
          setNotifications((prev) => [...prev, ...data.notifications])
        }

        setHasMore(data.notifications.length === limit)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read)

      for (const notification of unreadNotifications) {
        await fetch(`/api/notifications/${notification.id}/read`, {
          method: "POST",
        })
      }

      // Update local state
      setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
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

  if (!isOwnProfile) {
    return (
      <div className="bg-gray-800 shadow-md rounded-md overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="font-bold text-gray-100">Notifications</h3>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-400">You can only view your own notifications</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 shadow-md rounded-md overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-bold text-gray-100">Notifications</h3>
        {notifications.some((n) => !n.read) && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600"
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className="divide-y divide-gray-700">
        {loading && page === 1 ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="p-4 flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-gray-700" />
                  <Skeleton className="h-3 w-1/4 bg-gray-700" />
                </div>
              </div>
            ))
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-400">No notifications yet</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <div key={notification.id} className={`p-4 ${!notification.read ? "bg-gray-700/50" : ""}`}>
                <Link href={notification.link || "#"} className="flex items-start gap-3">
                  <div className="text-xl">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-200">{notification.message}</p>
                    <p className="text-xs text-gray-400">{formatTimeAgo(notification.createdAt)}</p>
                  </div>
                  {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1"></div>}
                </Link>
              </div>
            ))}

            {hasMore && (
              <div className="p-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={loading}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600"
                >
                  {loading ? "Loading..." : "Load more"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
