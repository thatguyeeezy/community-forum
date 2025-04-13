"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import DOMPurify from "isomorphic-dompurify"
import { isWebmaster } from "@/lib/permissions"

// Function to check if user can create announcements in a category
function canCreateAnnouncement(categoryId: number, userRole?: string, userDepartment?: string) {
  // Webmaster can do anything
  if (isWebmaster(userRole)) {
    return true
  }

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

// Function to generate a base slug from a title
function generateBaseSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .trim()
}

// Function to generate a unique slug
async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = generateBaseSlug(title)

  // Check if the slug exists
  const existingThread = await prisma.thread.findUnique({
    where: { slug: baseSlug },
  })

  if (!existingThread) {
    return baseSlug
  }

  // If the slug exists, append a timestamp to make it unique
  const timestamp = Date.now().toString().slice(-6)
  return `${baseSlug}-${timestamp}`
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

  // Generate a unique slug from the title
  const slug = await generateUniqueSlug(title)

  // Sanitize HTML content
  const sanitizedContent = DOMPurify.sanitize(content)

  // Create the announcement (as a thread with locked=true)
  const announcement = await prisma.thread.create({
    data: {
      title,
      slug, // Add the unique slug field
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

  // Get the announcement ID from the form data
  const announcementId = formData.get("announcementId")

  if (!announcementId) {
    throw new Error("Announcement ID is missing")
  }

  const id = Number.parseInt(announcementId.toString(), 10)

  if (isNaN(id)) {
    throw new Error("Invalid announcement ID")
  }

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

  // Generate a new slug if the title has changed
  let slug = announcement.slug
  if (title !== announcement.title) {
    slug = await generateUniqueSlug(title)
  }

  // Sanitize HTML content
  const sanitizedContent = DOMPurify.sanitize(content)

  // Update the announcement
  await prisma.thread.update({
    where: { id },
    data: {
      title,
      slug, // Update the slug if the title changed
      content: sanitizedContent,
      pinned: isPinned,
    },
  })

  redirect(`/community/announcement/${id}`)
}
