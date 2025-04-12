import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { ThreadActions } from "@/app/forums/thread-actions"
import { CreatePostForm } from "@/app/forums/create-post-form"

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  const thread = await prisma.thread.findUnique({
    where: {
      id: params.id,
    },
    include: {
      author: true,
      category: true,
      posts: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })

  if (!thread) {
    notFound()
  }

  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SENIOR_ADMIN" || session?.user?.role === "HEAD_ADMIN"
  const isModerator = session?.user?.role === "MODERATOR"
  const canModerate = isAdmin || isModerator

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/community" className="hover:underline">
            Community
          </Link>
          <span>/</span>
          <Link href={`/community/${thread.category.id}`} className="hover:underline">
            {thread.category.name}
          </Link>
        </div>
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold tracking-tight">{thread.title}</h1>
          {canModerate && <ThreadActions thread={thread} />}
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <span>Started by {thread.author.name}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Original post */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar>
              <AvatarImage src={thread.author.image || ""} alt={thread.author.name || "User"} />
              <AvatarFallback>{thread.author.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{thread.author.name}</div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {thread.content.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        {thread.posts.length > 0 && (
          <>
            <Separator />
            <h2 className="text-xl font-semibold">Replies</h2>
            <div className="space-y-4">
              {thread.posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar>
                      <AvatarImage src={post.author.image || ""} alt={post.author.name || "User"} />
                      <AvatarFallback>{post.author.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{post.author.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {post.content.split("\n").map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Reply form */}
        {session ? (
          !thread.locked || canModerate ? (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Post a Reply</h2>
              <CreatePostForm threadId={thread.id} />
            </div>
          ) : (
            <Card className="mt-6 bg-muted/50">
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <p>This thread is locked. New replies are not allowed.</p>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">You need to be signed in to reply to this thread.</p>
                <Button asChild>
                  <Link href={`/auth/signin?callbackUrl=/community/thread/${thread.id}`}>Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
