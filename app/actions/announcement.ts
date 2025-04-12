"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
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
    return { error: "You must be logged in to create an announcement" }
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const categoryIdStr = formData.get("categoryId") as string
  const categoryId = Number.parseInt(categoryIdStr, 10)
  const isPinned = formData.get("isPinned") === "true"

  if (!title || !content || isNaN(categoryId)) {
    return { error: "Missing required fields" }
  }

  // Check if user has permission to create in this category
  const canCreate = canCreateAnnouncement(
    categoryId,
    session.user.role as string,
    // @ts-ignore - department is added to session in auth.ts
    session.user.department as string,
  )

  if (!canCreate) {
    return { error: "You don't have permission to create announcements in this category" }
  }

  try {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    // Sanitize HTML content
    const sanitizedContent = DOMPurify.sanitize(content)

    // Convert authorId to a number
    const authorId = typeof session.user.id === "string" ? Number.parseInt(session.user.id, 10) : session.user.id

    const announcement = await prisma.thread.create({
      data: {
        title,
        slug,
        content: sanitizedContent,
        authorId,
        categoryId,
        pinned: isPinned,
        // Set locked to true to prevent replies
        locked: true,
      },
    })

    revalidatePath(`/community/${categoryId}`)
    revalidatePath(`/community`)

    // Redirect to the newly created announcement
    redirect(`/community/announcement/${announcement.id}`)
  } catch (error) {
    console.error("Announcement creation error:", error)
    return { error: "Failed to create announcement" }
  }
}

export async function updateAnnouncement(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "You must be logged in to update an announcement" }
  }

  const announcementIdStr = formData.get("announcementId") as string
  const announcementId = Number.parseInt(announcementIdStr, 10)
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const isPinned = formData.get("isPinned") === "true"

  if (!announcementId || !title || !content) {
    return { error: "Missing required fields" }
  }

  try {
    // Get the announcement to check permissions
    const announcement = await prisma.thread.findUnique({
      where: { id: announcementId },
      select: { categoryId: true },
    })

    if (!announcement) {
      return { error: "Announcement not found" }
    }

    // Check if user has permission to update in this category
    const canUpdate = canCreateAnnouncement(
      announcement.categoryId,
      session.user.role as string,
      // @ts-ignore - department is added to session in auth.ts
      session.user.department as string,
    )

    if (!canUpdate) {
      return { error: "You don't have permission to update announcements in this category" }
    }

    // Sanitize HTML content
    const sanitizedContent = DOMPurify.sanitize(content)

    const updatedAnnouncement = await prisma.thread.update({
      where: { id: announcementId },
      data: {
        title,
        content: sanitizedContent,
        pinned: isPinned,
        updatedAt: new Date(),
      },
    })

    revalidatePath(`/community/${announcement.categoryId}`)
    revalidatePath(`/community/announcement/${announcementId}`)
    revalidatePath(`/community`)

    return { success: true, announcementId: updatedAnnouncement.id }
  } catch (error) {
    console.error("Announcement update error:", error)
    return { error: "Failed to update announcement" }
  }
}
