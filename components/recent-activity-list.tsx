import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface RecentActivityListProps {
  recentUsers: any[]
  recentThreads: any[]
  recentPosts: any[]
}

export function RecentActivityList({ recentUsers, recentThreads, recentPosts }: RecentActivityListProps) {
  return (
    <div className="space-y-4">
      {/* Recent Users */}
      <div>
        <h4 className="font-semibold mb-2">Newest Members</h4>
        <ul className="space-y-2">
          {recentUsers.map((user) => (
            <li key={user.id} className="flex items-center justify-between">
              <Link href={`/profile/${user.id}`} className="hover:underline">
                {user.name}
              </Link>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Announcements */}
      <div>
        <h4 className="font-semibold mb-2">Recent Announcements</h4>
        <ul className="space-y-2">
          {recentThreads.map((thread) => (
            <li key={thread.id} className="flex items-center justify-between">
              <Link href={`/community/thread/${thread.id}`} className="hover:underline">
                {thread.title}
              </Link>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      <div>
        <h4 className="font-semibold mb-2">Recent Posts</h4>
        <ul className="space-y-2">
          {recentPosts.map((post) => (
            <li key={post.id} className="flex items-center justify-between">
              <Link href={`/community/thread/${post.thread.id}`} className="hover:underline">
                {post.thread.title}
              </Link>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
