"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { canAssignRole, hasAdminPermission, hasStaffPermission } from "@/lib/roles"
import { auth } from "@/auth"

export async function updateUserRole(userId: string, role: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  // Check if the user has permission to assign this role
  const userRole = session.user.role as string
  if (!canAssignRole(userRole, role)) {
    return { error: "You don't have permission to assign this role" }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    })

    revalidatePath(`/admin/users`)
    revalidatePath(`/profile/${userId}`)
    return { success: true, message: `User role updated to ${role}` }
  } catch (error) {
    console.error("Role update error:", error)
    return { error: "Failed to update user role" }
  }
}

export async function banUser(userId: string, banned: boolean) {
  const session = await getServerSession(authOptions)

  if (!session?.user || !hasStaffPermission(session.user.role as string)) {
    return { error: "Unauthorized" }
  }

  try {
    // In a real implementation, you might have a 'banned' field in your User model
    // For this example, we'll update the status to indicate banned
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: banned ? "Banned" : "Offline",
      },
    })

    revalidatePath(`/admin/users`)
    revalidatePath(`/profile/${userId}`)
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

  if (!session?.user || !hasStaffPermission(session.user.role as string)) {
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

  if (!session?.user || !hasStaffPermission(session.user.role as string)) {
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

  if (!session?.user || !hasStaffPermission(session.user.role as string)) {
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

  if (!session?.user || !hasAdminPermission(session.user.role as string)) {
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

// Add or remove a badge from a user
export async function updateUserBadge(
  userId: string,
  badge: string,
  action: "add" | "remove",
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "Not authenticated" }
    }

    // Only webmasters can manage badges
    const currentUser = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
      select: { badges: true },
    })

    if (!currentUser?.badges?.includes("WEBMASTER")) {
      return { success: false, error: "Not authorized to manage badges" }
    }

    const id = Number.parseInt(userId, 10)
    if (isNaN(id)) {
      return { success: false, error: "Invalid user ID" }
    }

    // Get current badges
    const user = await prisma.user.findUnique({
      where: { id },
      select: { badges: true },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    let updatedBadges = [...(user.badges || [])]

    if (action === "add" && !updatedBadges.includes(badge)) {
      updatedBadges.push(badge)
    } else if (action === "remove") {
      updatedBadges = updatedBadges.filter((b) => b !== badge)
    }

    // Update the user
    await prisma.user.update({
      where: { id },
      data: { badges: updatedBadges },
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating user badge:", error)
    return { success: false, error: "Failed to update user badge" }
  }
}
