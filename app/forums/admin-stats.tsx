import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Users, MessageSquare, FileText, Activity } from 'lucide-react'

export async function AdminStats() {
  // Get real stats from the database
  const userCount = await prisma.user.count()
  const threadCount = await prisma.thread.count()
  const postCount = await prisma.post.count()
  
  // Get active users in the last 24 hours
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)
  
  const activeUsers = await prisma.user.count({
    where: {
      OR: [
        { threads: { some: { createdAt: { gte: oneDayAgo } } } },
        { posts: { some: { createdAt: { gte: oneDayAgo } } } },
      ],
    },
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Total Users</span>
            <span className="text-2xl font-bold">{userCount}</span>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Users className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Total Threads</span>
            <span className="text-2xl font-bold">{threadCount}</span>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Total Posts</span>
            <span className="text-2xl font-bold">{postCount}</span>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Active Today</span>
            <span className="text-2xl font-bold">{activeUsers}</span>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Activity className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}