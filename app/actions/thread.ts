"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

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

export async function createThread(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "You must be logged in to create a thread" }
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const categoryIdStr = formData.get("categoryId") as string
  const categoryId = Number.parseInt(categoryIdStr, 10)

  if (!title || !content || isNaN(categoryId)) {
    return { error: "Missing required fields" }
  }

  // Check if user has permission to create in this category
  const canCreate = canCreateInCategory(
    categoryId,
    session.user.role as string,
    // @ts-ignore - department is added to session in auth.ts
    session.user.department as string,
  )

  if (!canCreate) {
    return { error: "You don't have permission to create threads in this category" }
  }

  try {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    // Convert authorId to a number
    const authorId = typeof session.user.id === "string" ? Number.parseInt(session.user.id, 10) : session.user.id

    const thread = await prisma.thread.create({
      data: {
        title,
        slug,
        content,
        authorId,
        categoryId,
      },
    })

    revalidatePath(`/community/${categoryId}`)
    revalidatePath(`/community`)

    // Redirect to the newly created thread
    redirect(`/community/thread/${thread.id}`)
  } catch (error) {
    console.error("Thread creation error:", error)
    return { error: "Failed to create thread" }
  }
}

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "You must be logged in to reply" }
  }

  const content = formData.get("content") as string
  const threadId = formData.get("threadId") as string

  if (!content || !threadId) {
    return { error: "Missing required fields" }
  }

  try {
    // Get the thread to check category permissions
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: { categoryId: true, locked: true },
    })

    if (!thread) {
      return { error: "Thread not found" }
    }

    // Check if thread is locked
    if (thread.locked) {
      // Allow admins and moderators to post in locked threads
      if (
        !["ADMIN", "MODERATOR", "SPECIAL_ADVISOR", "SENIOR_ADMIN", "HEAD_ADMIN"].includes(session.user.role as string)
      ) {
        return { error: "This thread is locked" }
      }
    }

    // Convert authorId to a number
    const authorId = typeof session.user.id === "string" ? Number.parseInt(session.user.id, 10) : session.user.id

    const post = await prisma.post.create({
      data: {
        content,
        authorId,
        threadId: Number.parseInt(threadId, 10),
      },
    })

    // Update thread's updatedAt
    await prisma.thread.update({
      where: { id: Number.parseInt(threadId, 10) },
      data: { updatedAt: new Date() },
    })

    revalidatePath(`/community/thread/${threadId}`)
    return { success: true, postId: post.id }
  } catch (error) {
    console.error("Post creation error:", error)
    return { error: "Failed to create post" }
  }
}
