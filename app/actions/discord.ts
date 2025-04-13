"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { syncUserRoleFromDiscord } from "@/lib/discord-roles"
import { revalidatePath } from "next/cache"

// Function to sync a single user's role
export async function syncUserRole(userId: number) {
  const session = await auth()

  // Only allow admins or the user themselves to sync their role
  if (
    !session ||
    (session.user.id !== userId.toString() &&
      !["HEAD_ADMIN", "SENIOR_ADMIN", "ADMIN", "JUNIOR_ADMIN"].includes(session.user?.role as string))
  ) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    // Get the user's Discord ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { discordId: true, role: true },
    })

    if (!user || !user.discordId) {
      return { success: false, message: "User has no Discord ID" }
    }

    // Sync the role
    const syncedRole = await syncUserRoleFromDiscord(user.discordId)

    if (!syncedRole) {
      return { success: false, message: "Failed to sync role" }
    }

    // Only update if not an admin role
    const adminRoles = ["HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "ADMIN", "JUNIOR_ADMIN"]
    if (adminRoles.includes(user.role)) {
      return { success: false, message: "Cannot change admin role" }
    }

    // Update the user's role
    await prisma.user.update({
      where: { id: userId },
      data: { role: syncedRole },
    })

    revalidatePath(`/profile/${userId}`)
    return { success: true, message: `Role updated to ${syncedRole}` }
  } catch (error) {
    console.error("Error syncing user role:", error)
    return { success: false, message: "An error occurred" }
  }
}

// Function to sync all users' roles
export async function syncAllUserRoles() {
  const session = await auth()

  // Only allow admins to sync all roles
  if (!session || !["HEAD_ADMIN", "SENIOR_ADMIN", "ADMIN"].includes(session.user?.role as string)) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    // Get all users with Discord IDs
    const users = await prisma.user.findMany({
      where: {
        discordId: { not: null },
        // Exclude admin roles
        role: { notIn: ["HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "ADMIN", "JUNIOR_ADMIN"] },
      },
      select: { id: true, discordId: true },
    })

    console.log(`Found ${users.length} users to sync`)

    // Process in batches of 5
    const batchSize = 5
    let processed = 0
    let updated = 0

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize)

      // Process each user in the batch
      await Promise.all(
        batch.map(async (user) => {
          try {
            if (!user.discordId) return

            const syncedRole = await syncUserRoleFromDiscord(user.discordId)
            processed++

            if (syncedRole) {
              await prisma.user.update({
                where: { id: user.id },
                data: { role: syncedRole },
              })
              updated++
              console.log(`Updated user ${user.id} to role ${syncedRole}`)
            }
          } catch (error) {
            console.error(`Error syncing user ${user.id}:`, error)
          }
        }),
      )

      // Wait between batches to avoid rate limiting
      if (i + batchSize < users.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    revalidatePath("/admin/users")
    return {
      success: true,
      message: `Processed ${processed} users, updated ${updated} roles`,
    }
  } catch (error) {
    console.error("Error syncing all user roles:", error)
    return { success: false, message: "An error occurred" }
  }
}
