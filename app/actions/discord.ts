"use server"

import { prisma } from "@/lib/prisma"
import { syncUserRoleFromDiscord } from "@/lib/discord-roles"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function syncUserRole(userId: number) {
  try {
    console.log(`Manual sync requested for user ID: ${userId}`)

    // Get the user's Discord ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { discordId: true, role: true },
    })

    if (!user) {
      console.error(`User ${userId} not found`)
      return { success: false, message: "User not found" }
    }

    if (!user.discordId) {
      console.error(`User ${userId} has no Discord ID`)
      return { success: false, message: "User has no Discord ID" }
    }

    console.log(`Found user with Discord ID: ${user.discordId}, current role: ${user.role}`)

    // Sync the user's role
    const syncedRole = await syncUserRoleFromDiscord(user.discordId)

    if (!syncedRole) {
      console.error(`Failed to sync role for user ${userId}`)
      return { success: false, message: "Failed to sync role" }
    }

    console.log(`Synced role for user ${userId}: ${syncedRole}`)

    // Only update if the role is different
    if (user.role !== syncedRole) {
      // Update the user's role
      await prisma.user.update({
        where: { id: userId },
        data: { role: syncedRole },
      })

      console.log(`Updated user ${userId} role from ${user.role} to ${syncedRole}`)

      revalidatePath(`/profile/${userId}`)
      return { success: true, message: `Role updated to ${syncedRole}`, role: syncedRole }
    } else {
      console.log(`User ${userId} already has role ${syncedRole}`)
      return { success: true, message: `Role is already ${syncedRole}`, role: syncedRole }
    }
  } catch (error) {
    console.error("Error syncing user role:", error)
    return { success: false, message: "Error syncing role" }
  }
}

export async function syncCurrentUserRole() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated" }
  }

  const userId = Number.parseInt(session.user.id, 10)
  return syncUserRole(userId)
}
