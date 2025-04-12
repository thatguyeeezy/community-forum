import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { updateAnnouncement } from "@/app/actions/announcement"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

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

export default async function EditAnnouncementPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/community")
  }

  const announcementId = Number.parseInt(params.id, 10)

  if (isNaN(announcementId)) {
    notFound()
  }

  // Fetch the announcement
  const announcement = await prisma.thread.findUnique({
    where: { id: announcementId },
    include: {
      category: true,
    },
  })

  if (!announcement) {
    notFound()
  }

  // Check if user has permission to edit this announcement
  const canEdit = canEditAnnouncement(
    announcement.categoryId,
    session.user.role as string,
    // @ts-ignore - department is added to session in auth.ts
    session.user.department as string,
  )

  if (!canEdit) {
    redirect("/community")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center mb-4">
          <Link
            href={`/community/announcement/${announcementId}`}
            className="text-blue-500 hover:text-blue-600 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Announcement
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-md p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Announcement</h1>

          <form action={updateAnnouncement} className="space-y-4">
            <input type="hidden" name="announcementId" value={announcementId} />

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={announcement.title}
                required
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <RichTextEditorWrapper name="content" initialContent={announcement.content} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="isPinned" name="isPinned" value="true" defaultChecked={announcement.pinned} />
              <label
                htmlFor="isPinned"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
              >
                Pin this announcement
              </label>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Update Announcement
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
// Client component wrapper for the rich text editor
;("use client")
import { useState } from "react"

function RichTextEditorWrapper({ name, initialContent = "" }: { name: string; initialContent?: string }) {
  const [content, setContent] = useState(initialContent)

  return (
    <>
      <input type="hidden" name={name} value={content} />
      <RichTextEditor content={content} onChange={setContent} />
    </>
  )
}
