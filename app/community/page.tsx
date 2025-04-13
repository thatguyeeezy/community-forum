import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Megaphone, Users, MessageSquare, ChevronRight, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"

// Function to check if user can create announcements in a category
function canCreateAnnouncement(categoryId: number, userRole?: string, userDepartment?: string) {
  // Community Announcements - only SPECIAL_ADVISOR, SENIOR_ADMIN and HEAD_ADMIN
  if (categoryId === 1) {
    // Announcements category ID is 1
    return userRole === "SPECIAL_ADVISOR" || userRole === "SENIOR_ADMIN" || userRole === "HEAD_ADMIN"
  }

  // Recruitment and Retention - only RNR_ADMINISTRATION
  if (categoryId === 2) {
    // Recruitment category ID is 2
    return userDepartment === "RNR_ADMINISTRATION"
  }

  return false
}

export default async function CommunityPage() {
  const session = await getServerSession(authOptions)

  // Fetch categories with their latest 5 threads
  const categories = await prisma.category.findMany({
    include: {
      threads: {
        take: 5, // Get the latest 5 threads
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: [
          {
            pinned: "desc",
          },
          {
            updatedAt: "desc",
          },
        ],
      },
      _count: {
        select: {
          threads: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  })

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Community</h1>

        <div className="grid grid-cols-1 gap-6">
          {categories.map((category) => {
            const canCreate = canCreateAnnouncement(
              category.id,
              session?.user?.role as string,
              // @ts-ignore - department is added to session in auth.ts
              session?.user?.department as string,
            )

            return (
              <div
                key={category.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center">
                      {category.id === 1 ? (
                        <Megaphone className="h-5 w-5 mr-2 text-blue-500" />
                      ) : category.id === 2 ? (
                        <Users className="h-5 w-5 mr-2 text-green-500" />
                      ) : (
                        <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
                      )}
                      <div>
                        <h2 className="text-xl font-semibold">{category.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {canCreate && (
                        <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Link href={`/community/new-announcement?categoryId=${category.id}`}>New Announcement</Link>
                        </Button>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/community/${category.id}`}>View All</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {category.threads.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">No announcements yet.</div>
                  ) : (
                    category.threads.map((thread) => (
                      <div key={thread.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link
                              href={`/community/announcement/${thread.id}`}
                              className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
                            >
                              {thread.pinned && <Pin className="h-4 w-4 mr-2 text-blue-500" />}
                              {thread.title}
                            </Link>
                            <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <span>
                                By{" "}
                                <Link href={`/profile/${thread.author.id}`} className="hover:underline">
                                  {thread.author.name}
                                </Link>
                              </span>
                              <span className="mx-2">•</span>
                              <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Link
                            href={`/community/announcement/${thread.id}`}
                            className="text-blue-500 hover:text-blue-600 flex items-center text-sm"
                          >
                            Read <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-gray-700 text-right">
                  <Link
                    href={`/community/${category.id}`}
                    className="text-blue-500 hover:text-blue-600 text-sm flex items-center justify-end"
                  >
                    View all {category._count.threads} announcements <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
