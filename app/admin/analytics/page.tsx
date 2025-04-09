import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AnalyticsCharts } from "@/components/analytics-charts"

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions)

  // Check if user is authorized to access admin panel
  if (!session?.user || !["ADMIN", "MODERATOR", "SENIOR_ADMIN", "HEAD_ADMIN"].includes(session.user.role as string)) {
    redirect("/auth/signin?callbackUrl=/admin/analytics")
  }

  // Get user registration data by month
  const userRegistrations = await prisma.user.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 100,
  })

  // Get thread creation data by month
  const threadCreations = await prisma.thread.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 100,
  })

  // Get post creation data by month
  const postCreations = await prisma.post.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 100,
  })

  // Process data for charts
  const processedData = {
    userRegistrations: userRegistrations.map((item) => ({
      date: item.createdAt.toISOString().split("T")[0],
      count: item._count.id,
    })),
    threadCreations: threadCreations.map((item) => ({
      date: item.createdAt.toISOString().split("T")[0],
      count: item._count.id,
    })),
    postCreations: postCreations.map((item) => ({
      date: item.createdAt.toISOString().split("T")[0],
      count: item._count.id,
    })),
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-6">
        <AdminSidebar />
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">View forum statistics and trends</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Forum Activity</CardTitle>
              <CardDescription>User registrations, thread and post creation over time</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsCharts data={processedData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
