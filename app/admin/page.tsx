import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { Users, BellRing, Activity } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { hasStaffPermission } from "@/lib/roles"
import { AdminSidebar } from "@/components/admin-sidebar"
import { prisma } from "@/lib/prisma"
import { RecentActivityList } from "@/components/recent-activity-list"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  // Check if user is authorized to access admin panel
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/admin")
  }

  const userRole = session.user.role as string

  // Allow staff roles to access the panel
  if (!hasStaffPermission(userRole)) {
    redirect("/auth/error?error=AccessDenied")
  }

  // Fetch real stats from the database
  const userCount = await prisma.user.count()

  // Count announcements (threads in announcement categories)
  const announcementCount = await prisma.thread.count({
    where: {
      category: {
        isAnnouncement: true,
      },
    },
  })

  // Get active users in the last 24 hours
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  const activeUsers = await prisma.user.count({
    where: {
      OR: [
        { threads: { some: { createdAt: { gte: oneDayAgo } } } },
        { posts: { some: { createdAt: { gte: oneDayAgo } } } },
        { lastActive: { gte: oneDayAgo } },
      ],
    },
  })

  // Fetch recent users
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  // Fetch recent announcements
  const recentAnnouncements = await prisma.thread.findMany({
    take: 5,
    where: {
      category: {
        isAnnouncement: true,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  })

  // Fetch recent posts
  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      thread: {
        select: {
          title: true,
        },
      },
    },
  })

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage your community forum</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <h2 className="text-3xl font-bold">{userCount}</h2>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Announcements</p>
                <h2 className="text-3xl font-bold">{announcementCount}</h2>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <BellRing className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Active Today</p>
                <h2 className="text-3xl font-bold">{activeUsers}</h2>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-sm text-muted-foreground mb-4">Recent activity across the forum</p>

          <RecentActivityList recentUsers={recentUsers} recentThreads={recentAnnouncements} recentPosts={recentPosts} />
        </div>
      </div>
    </div>
  )
}
