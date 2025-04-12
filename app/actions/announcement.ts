"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import DOMPurify from "isomorphic-dompurify"

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

export async function createAnnouncement(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const categoryId = Number.parseInt(formData.get("categoryId") as string, 10)
  const isPinned = formData.get("isPinned") === "true"

  // Check if user has permission to create announcements in this category
  const hasPermission = canCreateAnnouncement(
    categoryId,
    session.user.role as string,
    // @ts-ignore - department is added to session in auth.ts
    session.user.department as string,
  )

  if (!hasPermission) {
    throw new Error("You don't have permission to create announcements in this category")
  }

  // Sanitize HTML content
  const sanitizedContent = DOMPurify.sanitize(content)

  // Create the announcement (as a thread with locked=true)
  const announcement = await prisma.thread.create({
    data: {
      title,
      content: sanitizedContent,
      authorId: Number.parseInt(session.user.id as string, 10),
      categoryId,
      pinned: isPinned,
      locked: true, // Announcements are locked by default
    },
  })

  redirect(`/community/announcement/${announcement.id}`)
}

export async function updateAnnouncement(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const id = Number.parseInt(formData.get("id") as string, 10)
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const isPinned = formData.get("isPinned") === "true"

  // Get the announcement
  const announcement = await prisma.thread.findUnique({
    where: { id },
  })

  if (!announcement) {
    throw new Error("Announcement not found")
  }

  // Check if user has permission to update this announcement
  const hasPermission = canCreateAnnouncement(
    announcement.categoryId,
    session.user.role as string,
    // @ts-ignore - department is added to session in auth.ts
    session.user.department as string,
  )

  if (!hasPermission && announcement.authorId !== Number.parseInt(session.user.id as string, 10)) {
    throw new Error("You don't have permission to update this announcement")
  }

  // Sanitize HTML content
  const sanitizedContent = DOMPurify.sanitize(content)

  // Update the announcement
  await prisma.thread.update({
    where: { id },
    data: {
      title,
      content: sanitizedContent,
      pinned: isPinned,
    },
  })

  redirect(`/community/announcement/${id}`)
}
