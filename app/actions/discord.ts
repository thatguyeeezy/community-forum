"use server"

import { prisma } from "@/lib/prisma"
import { syncUserRoleFromDiscord } from "@/lib/discord-roles"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

// Helper function to check if a user has admin permissions
async function hasAdminPermission() {
  const session = await auth()
  if (!session?.user?.role) return false

  const adminRoles = ["HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "ADMIN"]
  return adminRoles.includes(session.user.role)
}

// Function to sync a specific user's role (admin only)
export async function syncUserRole(userId: number) {
  try {
    // Check if the current user has admin permissions
    const isAdmin = await hasAdminPermission()

    // Get the current user's ID
    const session = await auth()
    const currentUserId = session?.user?.id ? Number.parseInt(session.user.id, 10) : null

    // Only allow admins to sync other users' roles
    // Regular users can only sync their own role
    if (!isAdmin && currentUserId !== userId) {
      console.error(`User ${currentUserId} attempted to sync role for user ${userId} without permission`)
      return { success: false, message: "Permission denied" }
    }

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
      // Admin protection: Don't downgrade admin roles unless the current user is an admin
      const adminRoles = ["HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "ADMIN", "JUNIOR_ADMIN"]
      if (adminRoles.includes(user.role) && !isAdmin) {
        console.log(`Cannot downgrade admin role ${user.role} to ${syncedRole} without admin permission`)
        return { success: false, message: "Cannot modify admin roles" }
      }

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

// Function for users to sync their own role
export async function syncCurrentUserRole() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated" }
  }

  const userId = Number.parseInt(session.user.id, 10)
  return syncUserRole(userId)
}

// Admin function to sync all users' roles (restricted to Senior Admin and above)
export async function syncAllUserRoles() {
  try {
    // Check if the current user has senior admin permissions
    const session = await auth()
    if (!session?.user?.role) {
      return { success: false, message: "Not authenticated" }
    }

    const seniorAdminRoles = ["HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR"]
    if (!seniorAdminRoles.includes(session.user.role)) {
      console.error(`User with role ${session.user.role} attempted to sync all roles without permission`)
      return { success: false, message: "Permission denied" }
    }

    console.log("Starting sync of all user roles")

    // Get all users with Discord IDs
    const users = await prisma.user.findMany({
      where: {
        discordId: { not: null },
      },
      select: {
        id: true,
        discordId: true,
        role: true,
      },
    })

    console.log(`Found ${users.length} users with Discord IDs`)

    // Process users in batches to avoid rate limits
    const batchSize = 5
    const results = {
      total: users.length,
      updated: 0,
      failed: 0,
      skipped: 0,
    }

    // Process users in batches with delay between batches
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize)

      // Process each user in the batch
      for (const user of batch) {
        try {
          if (!user.discordId) {
            results.skipped++
            continue
          }

          const syncedRole = await syncUserRoleFromDiscord(user.discordId)

          if (!syncedRole) {
            console.log(`No role found for user ${user.id}`)
            results.failed++
            continue
          }

          if (user.role !== syncedRole) {
            // Don't downgrade admin roles
            const adminRoles = ["HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "ADMIN", "JUNIOR_ADMIN"]
            if (adminRoles.includes(user.role)) {
              console.log(`Skipping admin user ${user.id} with role ${user.role}`)
              results.skipped++
              continue
            }

            await prisma.user.update({
              where: { id: user.id },
              data: { role: syncedRole },
            })

            console.log(`Updated user ${user.id} role from ${user.role} to ${syncedRole}`)
            results.updated++
          } else {
            console.log(`User ${user.id} already has correct role ${syncedRole}`)
            results.skipped++
          }
        } catch (error) {
          console.error(`Error processing user ${user.id}:`, error)
          results.failed++
        }
      }

      // Add delay between batches to avoid rate limits
      if (i + batchSize < users.length) {
        console.log(`Waiting before processing next batch...`)
        await new Promise((resolve) => setTimeout(resolve, 5000))
      }
    }

    console.log("Finished syncing all user roles:", results)

    // Revalidate the users page to show updated roles
    revalidatePath("/admin/users")

    return {
      success: true,
      message: `Processed ${results.total} users: ${results.updated} updated, ${results.skipped} skipped, ${results.failed} failed`,
      results,
    }
  } catch (error) {
    console.error("Error syncing all user roles:", error)
    return { success: false, message: "Error syncing roles" }
  }
}
