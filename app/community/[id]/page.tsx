import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft, Edit, Pin } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound } from "next/navigation"

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
    },
  })

  if (!category) {
    notFound()
  }

  const canCreate = canCreateAnnouncement(
    categoryId,
    session?.user?.role as string,
    // @ts-ignore - department is added to session in auth.ts
    session?.user?.department as string,
  )

  let permissionText = ""
  if (categoryId === 1) {
    permissionText = "Only Special Advisor, Senior Admin, and Head Admin can create announcements in this category."
  } else if (categoryId === 2) {
    permissionText = "Only R&R Administration can create announcements in this category."
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
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href={`/community/new-announcement?categoryId=${categoryId}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Link>
              </Button>
            ) : (
              <div className="text-amber-500 text-sm">{permissionText}</div>
            )}
          </div>
        </div>

        {category.threads.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-md p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No announcements yet.</p>
            {canCreate && (
              <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                <Link href={`/community/new-announcement?categoryId=${categoryId}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create the first announcement
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {category.threads.map((thread) => (
              <div
                key={thread.id}
                className={`bg-white dark:bg-slate-800 rounded-md overflow-hidden border ${
                  thread.pinned ? "border-blue-500" : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Link
                      href={`/community/announcement/${thread.id}`}
                      className="text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
                    >
                      {thread.pinned && <Pin className="h-4 w-4 mr-2 text-blue-500" />}
                      {thread.title}
                    </Link>
                    {canCreate && (
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/community/edit-announcement/${thread.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      {thread.author.image ? (
                        <img
                          src={thread.author.image || "/placeholder.svg"}
                          alt={thread.author.name || "User"}
                          className="h-5 w-5 rounded-full mr-2"
                        />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600 mr-2" />
                      )}
                      <Link href={`/profile/${thread.author.id}`} className="hover:underline">
                        {thread.author.name}
                      </Link>
                      <span className="mx-2">•</span>
                      <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                      {thread.createdAt.toString() !== thread.updatedAt.toString() && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Updated: {new Date(thread.updatedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link
                      href={`/community/announcement/${thread.id}`}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
