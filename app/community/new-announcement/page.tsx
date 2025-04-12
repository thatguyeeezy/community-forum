import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createAnnouncement } from "@/app/actions/announcement"
import { RichTextEditorWrapper } from "@/components/rich-text-editor-wrapper"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

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

export default async function NewAnnouncementPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/community/new-announcement")
  }

  // Get the category ID from the query params
  const categoryIdParam = searchParams.categoryId
  const categoryId = categoryIdParam ? Number.parseInt(categoryIdParam.toString(), 10) : undefined

  // Fetch available categories
  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: [1, 2], // Only the two categories we want
      },
      parentId: null,
    },
    orderBy: {
      order: "asc",
    },
  })

  // Filter categories based on user permissions
  const availableCategories = categories.filter((category) =>
    canCreateAnnouncement(
      category.id,
      session.user.role as string,
      // @ts-ignore - department is added to session in auth.ts
      session.user.department as string,
    ),
  )

  if (availableCategories.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <div className="flex items-center mb-4">
            <Link href="/community" className="text-blue-500 hover:text-blue-600 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Community
            </Link>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-md p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Permission Denied</h1>
            <p className="text-gray-500 dark:text-gray-400">
              You don't have permission to create announcements in any category.
            </p>
          </div>
        </div>
      </div>
    )
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

        <div className="bg-white dark:bg-slate-800 rounded-md p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Announcement</h1>

          <form action={createAnnouncement} className="space-y-4">
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={categoryId}
                required
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Announcement title"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <RichTextEditorWrapper name="content" placeholder="Write your announcement here..." />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="isPinned" name="isPinned" value="true" />
              <label
                htmlFor="isPinned"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
              >
                Pin this announcement
              </label>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Create Announcement
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
