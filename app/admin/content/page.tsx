import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ContentTable } from "@/components/content-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminContentPage() {
  const session = await getServerSession(authOptions)

  // Check if user is authorized to access admin panel
  if (!session?.user || !["ADMIN", "MODERATOR", "SENIOR_ADMIN", "HEAD_ADMIN"].includes(session.user.role as string)) {
    redirect("/auth/signin?callbackUrl=/admin/content")
  }

  // Fetch categories
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          threads: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  })

  // Fetch recent threads
  const threads = await prisma.thread.findMany({
    take: 20,
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
      _count: {
        select: {
          posts: true,
        },
      },
    },
  })

  // Fetch recent posts
  const posts = await prisma.post.findMany({
    take: 20,
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
          id: true,
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
            <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
            <p className="text-muted-foreground">Manage categories, threads, and posts</p>
          </div>

          <Tabs defaultValue="threads" className="space-y-4">
            <TabsList>
              <TabsTrigger value="threads">Threads</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="threads">
              <Card>
                <CardHeader>
                  <CardTitle>Threads</CardTitle>
                  <CardDescription>Manage all threads in the forum</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentTable type="threads" data={threads} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="posts">
              <Card>
                <CardHeader>
                  <CardTitle>Posts</CardTitle>
                  <CardDescription>Manage all posts in the forum</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentTable type="posts" data={posts} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>Manage forum categories and subcategories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentTable type="categories" data={categories} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
