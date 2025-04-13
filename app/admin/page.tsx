import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminStats } from "@/components/admin-stats"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { RecentActivityList } from "@/components/recent-activity-list"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  // Check if user is authorized to access admin panel
  if (!session?.user || !["ADMIN", "MODERATOR", "SENIOR_ADMIN", "HEAD_ADMIN"].includes(session.user.role as string)) {
    redirect("/auth/signin?callbackUrl=/admin")
  }

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

  // Fetch recent threads
  const recentThreads = await prisma.thread.findMany({
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
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-6">
        <AdminSidebar />
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
            <p className="text-muted-foreground">Manage your community forum</p>
          </div>

          <AdminStats />

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Recent activity across the forum</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentActivityList
                    recentUsers={recentUsers}
                    recentThreads={recentThreads}
                    recentPosts={recentPosts}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage users, roles, and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input placeholder="Search users..." className="max-w-sm" />
                      <Button variant="outline">Search</Button>
                    </div>
                    <div className="rounded-md border">
                      <div className="p-4">
                        <h3 className="font-medium">User list will be displayed here</h3>
                        <p className="text-sm text-muted-foreground">With options to edit, ban, or change roles</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>Manage forums, threads, and posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input placeholder="Search content..." className="max-w-sm" />
                      <Button variant="outline">Search</Button>
                    </div>
                    <div className="rounded-md border">
                      <div className="p-4">
                        <h3 className="font-medium">Content list will be displayed here</h3>
                        <p className="text-sm text-muted-foreground">With options to edit, delete, or moderate</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Forum Settings</CardTitle>
                  <CardDescription>Manage forum settings and configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">General Settings</h3>
                      <Separator />
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="forum-name" className="text-right">
                            Forum Name
                          </Label>
                          <Input id="forum-name" defaultValue="Community Forum" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="forum-description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="forum-description"
                            defaultValue="A modern community forum platform"
                            className="col-span-3"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Registration Settings</h3>
                      <Separator />
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="allow-registration" className="text-right">
                            Allow Registration
                          </Label>
                          <div className="col-span-3 flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="allow-registration"
                              defaultChecked
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="allow-registration">Enable user registration</Label>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email-verification" className="text-right">
                            Email Verification
                          </Label>
                          <div className="col-span-3 flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="email-verification"
                              defaultChecked
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="email-verification">Require email verification</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
