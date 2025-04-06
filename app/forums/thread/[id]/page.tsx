import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Eye, Clock, Pin, Lock } from 'lucide-react'

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  // Increment view count
  try {
    await prisma.thread.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })
  } catch (error) {
    console.error("Error incrementing view count:", error)
  }
  
  const thread = await prisma.thread.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      category: true,
      posts: {
        include: {
          author: true,
          reactions: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      reactions: {
        include: {
          user: true,
        },
      },
      _count: {
        select: {
          posts: true,
        },
      },
    },
  })
  
  if (!thread) {
    notFound()
  }
  
  const isAdmin = session?.user?.role === "ADMIN"
  const isModerator = session?.user?.role === "MODERATOR"
  const canModerate = isAdmin || isModerator
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/forums" className="hover:underline">Forums</Link>
              <span>/</span>
              <Link href={`/forums/${thread.category.id}`} className="hover:underline">
                {thread.category.name}
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{thread.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MessageSquare className="mr-1 h-4 w-4" />
                {thread._count.posts} replies
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Eye className="mr-1 h-4 w-4" />
                {thread.views} views
              </div>
              {thread.pinned && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                  <Pin className="mr-1 h-3 w-3" /> Pinned
                </Badge>
              )}
              {thread.locked && (
                <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  <Lock className="mr-1 h-3 w-3" /> Locked
                </Badge>
              )}
            </div>
          </div>
          {canModerate && (
            <div>
              <Button variant="outline" size="sm">
                Moderate
              </Button>
            </div>
          )}
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-start space-y-0">
            <div className="flex items-start space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={thread.author.image || "/placeholder.svg"} alt={thread.author.name || ""} />
                <AvatarFallback>{thread.author.name?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/members/${thread.author.id}`} className="font-semibold hover:underline">
                  {thread.author.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {thread.author.role === "ADMIN" && (
                    <Badge className="mr-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      Admin
                    </Badge>
                  )}
                  {thread.author.role === "MODERATOR" && (
                    <Badge className="mr-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      Mod
                    </Badge>
                  )}
                  Posted {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              {thread.content.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                Like
              </Button>
              <Button variant="ghost" size="sm">
                Share
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              {thread.reactions.length > 0 && (
                <span>{thread.reactions.length} likes</span>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Replies ({thread._count.posts})</h2>
        <div className="space-y-4">
          {thread.posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="flex flex-row items-start space-y-0">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.image || "/placeholder.svg"} alt={post.author.name || ""} />
                    <AvatarFallback>{post.author.name?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={`/members/${post.author.id}`} className="font-semibold hover:underline">
                      {post.author.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {post.author.role === "ADMIN" && (
                        <Badge className="mr-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                          Admin
                        </Badge>
                      )}
                      {post.author.role === "MODERATOR" && (
                        <Badge className="mr-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          Mod
                        </Badge>
                      )}
                      Replied {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  {post.content.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    Like
                  </Button>
                  <Button variant="ghost" size="sm">
                    Quote
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  {post.reactions.length > 0 && (
                    <span>{post.reactions.length} likes</span>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {session?.user && !thread.locked && (
        <div>
          <Separator className="my-6" />
          <h2 className="text-xl font-bold mb-4">Post a Reply</h2>
          <Card>
            <CardContent className="p-4">
              <textarea
                className="w-full min-h-[150px] p-3 border rounded-md"
                placeholder="Write your reply here..."
              />
            </CardContent>
            <CardFooter className="flex justify-end border-t p-4">
              <Button>Post Reply</Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {!session?.user && (
        <Card className="p-6 text-center">
          <p className="mb-4">You need to be signed in to reply to this thread.</p>
          <Button asChild>
            <Link href={`/auth/signin?callbackUrl=/forums/thread/${thread.id}`}>
              Sign In
            </Link>
          </Button>
        </Card>
      )}
      
      {session?.user && thread.locked && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">This thread is locked. No new replies can be posted.</p>
        </Card>
      )}
    </div>
  )
}