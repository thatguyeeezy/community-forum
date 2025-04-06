import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Eye, Clock } from "lucide-react"

export async function RecentThreads() {
  // Get recent threads from the database
  const threads = await prisma.thread.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      category: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Recent Discussions</h2>
        <Link href="/forums/recent" className="text-sm text-primary hover:underline">
          View All Recent
        </Link>
      </div>
      <div className="grid gap-4">
        {threads.map((thread) => (
          <Link key={thread.id} href={`/forums/thread/${thread.id}`}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">{thread.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Badge variant="outline" className="mr-2">
                      {thread.category.name}
                    </Badge>
                    {thread.pinned && (
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                      >
                        Pinned
                      </Badge>
                    )}
                    {thread.locked && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      >
                        Locked
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={thread.author.image || "/placeholder.svg"} alt={thread.author.name || ""} />
                  <AvatarFallback>{thread.author.name?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    {thread._count.posts} replies
                  </div>
                  <div className="flex items-center">
                    <Eye className="mr-1 h-4 w-4" />
                    {thread.views} views
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

