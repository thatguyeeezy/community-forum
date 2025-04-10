import { formatDistanceToNow } from "date-fns"
import { Users, MessageSquare, FileText } from "lucide-react"
import Link from "next/link"

interface RecentUser {
  id: number
  name: string | null
  email: string | null
  role: string
  createdAt: Date
}

interface RecentThread {
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

interface RecentPost {
  id: string
  createdAt: Date
  author: {
    name: string | null
  }
  thread: {
    title: string
  }
}

interface RecentActivityListProps {
  recentUsers: RecentUser[]
  recentThreads: RecentThread[]
  recentPosts: RecentPost[]
}

export function RecentActivityList({ recentUsers, recentThreads, recentPosts }: RecentActivityListProps) {
  // Combine all activities and sort by date
  const allActivities = [
    ...recentUsers.map((user) => ({
      type: "user",
      data: user,
      date: new Date(user.createdAt),
    })),
    ...recentThreads.map((thread) => ({
      type: "thread",
      data: thread,
      date: new Date(thread.createdAt),
    })),
    ...recentPosts.map((post) => ({
      type: "post",
      data: post,
      date: new Date(post.createdAt),
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)

  return (
    <div className="space-y-4">
      {allActivities.map((activity, index) => {
        if (activity.type === "user") {
          const user = activity.data as RecentUser
          return (
            <div key={`user-${user.id}`} className="rounded-md bg-muted p-4">
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

        if (activity.type === "thread") {
          const thread = activity.data as RecentThread
          return (
            <div key={`thread-${thread.id}`} className="rounded-md bg-muted p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New thread created</p>
                  <p className="text-xs text-muted-foreground">
                    <Link href={`/community/thread/${thread.id}`} className="hover:underline">
                      "{thread.title}"
                    </Link>{" "}
                    in {thread.category.name} by {thread.author.name || "Anonymous"}{" "}
                    {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          )
        }

        if (activity.type === "post") {
          const post = activity.data as RecentPost
          return (
            <div key={`post-${post.id}`} className="rounded-md bg-muted p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New post in thread</p>
                  <p className="text-xs text-muted-foreground">
                    {post.author.name || "Anonymous"} replied to "{post.thread.title}"{" "}
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
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
