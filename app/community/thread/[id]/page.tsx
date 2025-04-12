import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound } from "next/navigation"
import { createPost } from "@/app/actions/thread"
import Image from "next/image"

export default async function ThreadPage({ params }: { params: { id: string } }) {
  // Fix: Convert params.id to number
  const threadId = Number.parseInt(params.id, 10)

  if (isNaN(threadId)) {
    notFound()
  }

  const session = await getServerSession(authOptions)

  // Fetch the thread with its posts
  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
        },
      },
      category: true,
      posts: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
            },
          },
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

  // Check if the thread is locked
  const canReply =
    !thread.locked ||
    (session?.user?.role &&
      ["ADMIN", "MODERATOR", "SPECIAL_ADVISOR", "SENIOR_ADMIN", "HEAD_ADMIN"].includes(session.user.role as string))

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center mb-4">
          <Link
            href={`/community/${thread.categoryId}`}
            className="text-blue-500 hover:text-blue-600 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {thread.category.name}
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-md overflow-hidden mb-6">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{thread.title}</h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                {thread.author.image ? (
                  <Image
                    src={thread.author.image || "/placeholder.svg"}
                    alt={thread.author.name || "User"}
                    width={24}
                    height={24}
                    className="rounded-full mr-2"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                )}
                <Link href={`/profile/${thread.author.id}`} className="hover:underline">
                  {thread.author.name}
                </Link>
              </div>
              <span className="mx-2">•</span>
              <span>{new Date(thread.createdAt).toLocaleString()}</span>
              {thread.locked && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-amber-500">Locked</span>
                </>
              )}
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: thread.content.replace(/\n/g, "<br />") }} />
            </div>
          </div>
        </div>

        {thread.posts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Replies</h2>
            <div className="space-y-4">
              {thread.posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-slate-800 rounded-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        {post.author.image ? (
                          <Image
                            src={post.author.image || "/placeholder.svg"}
                            alt={post.author.name || "User"}
                            width={24}
                            height={24}
                            className="rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                        )}
                        <Link href={`/profile/${post.author.id}`} className="hover:underline">
                          {post.author.name}
                        </Link>
                      </div>
                      <span className="mx-2">•</span>
                      <span>{new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {session ? (
          canReply ? (
            <div className="bg-white dark:bg-slate-800 rounded-md p-6">
              <h2 className="text-xl font-bold mb-4">Reply to this thread</h2>
              <form action={createPost} className="space-y-4">
                <input type="hidden" name="threadId" value={thread.id} />
                <div>
                  <textarea
                    id="content"
                    name="content"
                    rows={6}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your reply here..."
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Post Reply
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-md p-6 text-center">
              <p className="text-amber-500">This thread is locked and cannot be replied to.</p>
            </div>
          )
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-md p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">You must be signed in to reply to this thread.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href={`/auth/signin?callbackUrl=/community/thread/${thread.id}`}>Sign In</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
