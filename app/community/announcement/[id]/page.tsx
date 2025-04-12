import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound } from "next/navigation"

// Function to check if user can edit announcements in a category
function canEditAnnouncement(categoryId: number, userRole?: string, userDepartment?: string) {
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

export default async function AnnouncementPage({ params }: { params: { id: string } }) {
  const announcementId = Number.parseInt(params.id, 10)

  if (isNaN(announcementId)) {
    notFound()
  }

  const session = await getServerSession(authOptions)

  // Fetch the announcement
  const announcement = await prisma.thread.findUnique({
    where: { id: announcementId },
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
    },
  })

  if (!announcement) {
    notFound()
  }

  const canEdit = canEditAnnouncement(
    announcement.categoryId,
    session?.user?.role as string,
    // @ts-ignore - department is added to session in auth.ts
    session?.user?.department as string,
  )

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center mb-4">
          <Link
            href={`/community/${announcement.categoryId}`}
            className="text-blue-500 hover:text-blue-600 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {announcement.category.name}
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{announcement.title}</h1>
              {canEdit && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/community/edit-announcement/${announcement.id}`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
              )}
            </div>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center">
                {announcement.author.image ? (
                  <img
                    src={announcement.author.image || "/placeholder.svg"}
                    alt={announcement.author.name || "User"}
                    className="h-6 w-6 rounded-full mr-2"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600 mr-2" />
                )}
                <Link href={`/profile/${announcement.author.id}`} className="hover:underline">
                  {announcement.author.name}
                </Link>
                <span className="mx-2">•</span>
                <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                {announcement.createdAt.toString() !== announcement.updatedAt.toString() && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Updated: {new Date(announcement.updatedAt).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>

            {/* Render HTML content safely */}
            <div
              className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: announcement.content }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
