import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound } from "next/navigation"

// Function to check if user can create threads in a category
function canCreateInCategory(categoryId: number, userRole?: string, userDepartment?: string) {
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

  // General Discussions - any authenticated user (APPLICANT+)
  return !!userRole
}

export default async function CategoryPage({ params }: { params: { id: string } }) {
  // Fix: Convert params.id to number properly
  const categoryId = Number.parseInt(params.id, 10)

  if (isNaN(categoryId)) {
    notFound()
  }

  const session = await getServerSession(authOptions)

  // Fetch the category
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      threads: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  })

  if (!category) {
    notFound()
  }

  const canCreate = canCreateInCategory(
    categoryId,
    session?.user?.role as string,
    // @ts-ignore - department is added to session in auth.ts
    session?.user?.department as string,
  )

  let permissionText = ""
  if (categoryId === 1) {
    permissionText = "Only Special Advisor, Senior Admin, and Head Admin can create threads in this category."
  } else if (categoryId === 2) {
    permissionText = "Only R&R Administration can create threads in this category."
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center mb-4">
          <Link href="/community" className="text-blue-500 hover:text-blue-600 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Community
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{category.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {canCreate ? (
              session ? (
                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href={`/community/new-thread?categoryId=${categoryId}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Thread
                  </Link>
                </Button>
              ) : (
                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href={`/auth/signin?callbackUrl=/community/${categoryId}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Thread
                  </Link>
                </Button>
              )
            ) : (
              <div className="flex items-center text-amber-500 text-sm">
                <Lock className="h-4 w-4 mr-1" />
                {permissionText}
              </div>
            )}
          </div>
        </div>

        {category.threads.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-md p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No threads yet.</p>
            {canCreate && session && (
              <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                <Link href={`/community/new-thread?categoryId=${categoryId}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create the first thread
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-md overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {category.threads.map((thread) => (
                <div key={thread.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/community/thread/${thread.id}`}
                        className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400"
                      >
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
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {thread._count.posts} replies
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
