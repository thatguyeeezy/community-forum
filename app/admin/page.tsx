import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { Users, BellRing, Activity } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { hasStaffPermission } from "@/lib/roles"
import { AdminSidebar } from "@/components/admin-sidebar"
import { prisma } from "@/lib/prisma"

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
      OR: [{ threads: { some: { createdAt: { gte: oneDayAgo } } } }, { lastActive: { gte: oneDayAgo } }],
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

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-100">Staff Dashboard</h1>
        <p className="text-gray-400 mb-8">Manage your community forum</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 shadow border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <h2 className="text-3xl font-bold text-gray-100">{userCount}</h2>
              </div>
              <div className="bg-gray-700 p-2 rounded-full">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 shadow border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Total Announcements</p>
                <h2 className="text-3xl font-bold text-gray-100">{announcementCount}</h2>
              </div>
              <div className="bg-gray-700 p-2 rounded-full">
                <BellRing className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 shadow border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Active Today</p>
                <h2 className="text-3xl font-bold text-gray-100">{activeUsers}</h2>
              </div>
              <div className="bg-gray-700 p-2 rounded-full">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Recent Activity</h2>
          <p className="text-sm text-gray-400 mb-4">Recent activity across the forum</p>

          <div className="space-y-4">
            {recentUsers.length > 0 && (
              <div>
                <h3 className="text-md font-medium text-gray-300 mb-2">New Users</h3>
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg mb-2">
                    <div className="bg-gray-700 p-2 rounded-full">
                      <Users className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-200">{user.name}</p>
                      <p className="text-sm text-gray-400">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {recentAnnouncements.length > 0 && (
              <div>
                <h3 className="text-md font-medium text-gray-300 mb-2">New Announcements</h3>
                {recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg mb-2">
                    <div className="bg-gray-700 p-2 rounded-full">
                      <BellRing className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-200">{announcement.title}</p>
                      <p className="text-sm text-gray-400">
                        Posted by {announcement.author.name} on {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {recentUsers.length === 0 && recentAnnouncements.length === 0 && (
              <p className="text-gray-400">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
