import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Eye, Clock } from "lucide-react"

// Mock data - in a real app, this would come from your database
const threads = [
  {
    id: 1,
    title: "Getting started with Next.js and TypeScript",
    category: "Tutorials & Resources",
    author: {
      name: "johndoe",
      avatar: "/placeholder.svg",
    },
    replies: 23,
    views: 456,
    lastActivity: "2 hours ago",
    isHot: true,
  },
  {
    id: 2,
    title: "What's your favorite UI component library?",
    category: "General Discussion",
    author: {
      name: "janedoe",
      avatar: "/placeholder.svg",
    },
    replies: 42,
    views: 789,
    lastActivity: "4 hours ago",
    isHot: true,
  },
  {
    id: 3,
    title: "Introducing myself to the community",
    category: "Introductions",
    author: {
      name: "newuser",
      avatar: "/placeholder.svg",
    },
    replies: 15,
    views: 123,
    lastActivity: "1 day ago",
    isHot: false,
  },
]

export function RecentThreads() {
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
                      {thread.category}
                    </Badge>
                    {thread.isHot && (
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        Hot
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={thread.author.avatar} alt={thread.author.name} />
                  <AvatarFallback>{thread.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    {thread.replies} replies
                  </div>
                  <div className="flex items-center">
                    <Eye className="mr-1 h-4 w-4" />
                    {thread.views} views
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {thread.lastActivity}
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
