"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { isWebmaster, isAdmin } from "@/lib/permissions"

export async function updateUserRole(userId: string, role: string) {
  const session = await getServerSession(authOptions)

  // Only webmasters and admins can update roles
  if (!session?.user || (!isWebmaster(session.user.role as string) && !isAdmin(session.user.role as string))) {
    return { error: "Unauthorized" }
  }

  // Only webmasters can create other webmasters
  if (role === "WEBMASTER" && !isWebmaster(session.user.role as string)) {
    return { error: "Only webmasters can assign the webmaster role" }
  }

  // Only webmasters and head admins can create admins
  if (
    (role === "HEAD_ADMIN" || role === "SENIOR_ADMIN") &&
    !isWebmaster(session.user.role as string) &&
    session.user.role !== "HEAD_ADMIN"
  ) {
    return { error: "Only webmasters and head admins can assign senior admin roles" }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    })

    revalidatePath(`/admin/users`)
    revalidatePath(`/members/${userId}`)
    return { success: true, message: `User role updated to ${role}` }
  } catch (error) {
    console.error("Role update error:", error)
    return { error: "Failed to update user role" }
  }
}

export async function banUser(userId: string, banned: boolean) {
  const session = await getServerSession(authOptions)

  // Only admins and webmasters can ban users
  if (!session?.user || (!isWebmaster(session.user.role as string) && !isAdmin(session.user.role as string))) {
    return { error: "Unauthorized" }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: banned ? "Banned" : "Offline",
      },
    })

    revalidatePath(`/admin/users`)
    revalidatePath(`/members/${userId}`)
    return {
      success: true,
      message: banned ? "User has been banned" : "User has been unbanned",
    }
  } catch (error) {
    console.error("Ban user error:", error)
    return { error: "Failed to update user ban status" }
  }
}

export async function deleteThread(threadId: string) {
  const session = await getServerSession(authOptions)

  // Only admins and webmasters can delete threads
  if (!session?.user || (!isWebmaster(session.user.role as string) && !isAdmin(session.user.role as string))) {
    return { error: "Unauthorized" }
  }

  try {
    // Get the category ID for revalidation
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: { categoryId: true },
    })

    if (!thread) {
      return { error: "Thread not found" }
    }

    // Delete the thread (this will cascade delete posts and reactions)
    await prisma.thread.delete({
      where: { id: threadId },
    })

    revalidatePath(`/community/${thread.categoryId}`)
    revalidatePath(`/admin/content`)
    return { success: true, message: "Thread deleted successfully" }
  } catch (error) {
    console.error("Delete thread error:", error)
    return { error: "Failed to delete thread" }
  }
}

export async function toggleThreadPin(threadId: string) {
  const session = await getServerSession(authOptions)

  // Only admins and webmasters can pin threads
  if (!session?.user || (!isWebmaster(session.user.role as string) && !isAdmin(session.user.role as string))) {
    return { error: "Unauthorized" }
  }

  try {
    // Get current thread status
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: { pinned: true, categoryId: true },
    })

    if (!thread) {
      return { error: "Thread not found" }
    }

    // Toggle pinned status
    await prisma.thread.update({
      where: { id: threadId },
      data: { pinned: !thread.pinned },
    })

    revalidatePath(`/community/${thread.categoryId}`)
    revalidatePath(`/community/thread/${threadId}`)
    return {
      success: true,
      pinned: !thread.pinned,
      message: thread.pinned ? "Thread unpinned" : "Thread pinned",
    }
  } catch (error) {
    console.error("Toggle pin error:", error)
    return { error: "Failed to toggle thread pin status" }
  }
}

export async function toggleThreadLock(threadId: string) {
  const session = await getServerSession(authOptions)

  // Only admins and webmasters can lock threads
  if (!session?.user || (!isWebmaster(session.user.role as string) && !isAdmin(session.user.role as string))) {
    return { error: "Unauthorized" }
  }

  try {
    // Get current thread status
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: { locked: true, categoryId: true },
    })

    if (!thread) {
      return { error: "Thread not found" }
    }

    // Toggle locked status
    await prisma.thread.update({
      where: { id: threadId },
      data: { locked: !thread.locked },
    })

    revalidatePath(`/community/${thread.categoryId}`)
    revalidatePath(`/community/thread/${threadId}`)
    return {
      success: true,
      locked: !thread.locked,
      message: thread.locked ? "Thread unlocked" : "Thread locked",
    }
  } catch (error) {
    console.error("Toggle lock error:", error)
    return { error: "Failed to toggle thread lock status" }
  }
}

export async function createCategory(formData: FormData) {
  const session = await getServerSession(authOptions)

  // Only admins and webmasters can create categories
  if (!session?.user || (!isWebmaster(session.user.role as string) && !isAdmin(session.user.role as string))) {
    return { error: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const parentId = (formData.get("parentId") as string) || null

  if (!name) {
    return { error: "Category name is required" }
  }

  try {
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    // Get the highest order value
    const highestOrder = await prisma.category.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const order = highestOrder ? highestOrder.order + 1 : 1

    await prisma.category.create({
      data: {
        name,
        description,
        slug,
        order,
        parentId: parentId || null,
      },
    })

    revalidatePath(`/community`)
    revalidatePath(`/admin/forums`)
    return { success: true, message: "Category created successfully" }
  } catch (error) {
    console.error("Create category error:", error)
    return { error: "Failed to create category" }
  }
}
