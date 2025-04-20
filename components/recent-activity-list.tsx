import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Users, BellRing } from "lucide-react"

interface RecentUser {
  id: number
  name: string | null
  email: string | null
  role: string
  createdAt: Date
}

interface RecentAnnouncement {
  id: string
  title: string
  createdAt: Date
  author: {
    name: string | null
  }
  category: {
    name: string
  }
}

interface RecentActivityListProps {
  recentUsers: RecentUser[]
  recentAnnouncements: RecentAnnouncement[]
}

export function RecentActivityList({ recentUsers, recentAnnouncements }: RecentActivityListProps) {
  // Combine all activities and sort by date
  const allActivities = [
    ...recentUsers.map((user) => ({
      type: "user",
      data: user,
      date: new Date(user.createdAt),
    })),
    ...recentAnnouncements.map((announcement) => ({
      type: "announcement",
      data: announcement,
      date: new Date(announcement.createdAt),
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10)

  return (
    <div className="space-y-4">
      {allActivities.map((activity, index) => {
        if (activity.type === "user") {
          const user = activity.data as RecentUser
          return (
            <div key={`user-${user.id}-${index}`} className="rounded-md bg-muted p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">
                    <Link href={`/admin/users/${user.id}`} className="hover:underline">
                      {user.name || user.email || `User #${user.id}`}
                    </Link>{" "}
                    joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          )
        }

        if (activity.type === "announcement") {
          const announcement = activity.data as RecentAnnouncement
          return (
            <div key={`announcement-${announcement.id}-${index}`} className="rounded-md bg-muted p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <BellRing className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New announcement published</p>
                  <p className="text-xs text-muted-foreground">
                    <Link href={`/community/announcement/${announcement.id}`} className="hover:underline">
                      "{announcement.title}"
                    </Link>{" "}
                    in {announcement.category.name} by {announcement.author.name || "Anonymous"}{" "}
                    {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          )
        }

        return null
      })}

      {allActivities.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">No recent activity found</div>
      )}
    </div>
  )
}
