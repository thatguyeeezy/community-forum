"use server"

import { prisma } from "@/lib/prisma"
import { syncUserRoleFromDiscord } from "@/lib/discord-roles"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function syncUserRole(userId: number) {
  const session = await auth()

  // Only admins can manually sync roles
  if (!session?.user?.role || !["HEAD_ADMIN", "SENIOR_ADMIN", "ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    // Get the user's Discord ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { discordId: true, role: true },
    })

    if (!user?.discordId) {
      return { success: false, message: "User has no linked Discord account" }
    }

    // Don't sync for admin roles
    const adminRoles = ["HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "ADMIN", "JUNIOR_ADMIN"]
    if (adminRoles.includes(user.role)) {
      return { success: false, message: "Admin roles cannot be automatically synced" }
    }

    // Sync the role
    const syncedRole = await syncUserRoleFromDiscord(user.discordId)

    if (!syncedRole) {
      return { success: false, message: "Could not fetch Discord roles" }
    }

    // Update the user's role
    await prisma.user.update({
      where: { id: userId },
      data: { role: syncedRole },
    })

    revalidatePath("/admin/users")
    return { success: true, message: `Role updated to ${syncedRole}` }
  } catch (error) {
    console.error("Error syncing user role:", error)
    return { success: false, message: "An error occurred while syncing the role" }
  }
}

// Function to process users in batches with rate limiting
async function processBatch(users, batchSize = 5, delayBetweenRequests = 200) {
  let updated = 0
  let failed = 0
  let processed = 0

  // Process users in batches
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize)

    // Process each user in the batch
    for (const user of batch) {
      if (!user.discordId) continue

      try {
        const syncedRole = await syncUserRoleFromDiscord(user.discordId)

        if (syncedRole) {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: syncedRole },
          })
          updated++
        } else {
          failed++
        }

        processed++

        // Add delay between individual requests
        await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests))
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error)
        failed++
      }
    }

    // Add a longer delay between batches
    if (i + batchSize < users.length) {
      console.log(`Processed ${processed}/${users.length} users. Pausing before next batch...`)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  return { updated, failed }
}

// Function to sync all non-admin users' roles with proper rate limiting
export async function syncAllUserRoles() {
  const session = await auth()

  // Only admins can sync all roles
  if (!session?.user?.role || !["HEAD_ADMIN", "SENIOR_ADMIN"].includes(session.user.role)) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    // Get all users with Discord IDs who aren't admins
    const users = await prisma.user.findMany({
      where: {
        discordId: { not: null },
        role: { notIn: ["HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "ADMIN", "JUNIOR_ADMIN"] },
      },
      select: { id: true, discordId: true },
    })

    console.log(`Starting to sync roles for ${users.length} users with rate limiting...`)

    // Configure rate limiting: 5 requests per second (200ms between requests)
    // Process in batches of 5 users, with a 1-second pause between batches
    const { updated, failed } = await processBatch(users, 5, 200)

    revalidatePath("/admin/users")
    return {
      success: true,
      message: `Updated ${updated} users' roles. Failed to update ${failed} users.`,
    }
  } catch (error) {
    console.error("Error syncing all user roles:", error)
    return { success: false, message: "An error occurred while syncing roles" }
  }
}
