"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { syncUserDepartmentFromMainDiscord, hasWhitelistedRoleInFanDiscord } from "@/lib/main-discord"
import { revalidatePath } from "next/cache"

export async function syncDepartmentIfWhitelisted(userId: number) {
  try {
    // Get the current user's session
    const session = await auth()
    if (!session?.user) {
      return { success: false, message: "Not authenticated" }
    }

    // Get the user's Discord ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { discordId: true },
    })

    if (!user || !user.discordId) {
      return { success: false, message: "User has no Discord ID" }
    }

    // Check if user has the Whitelisted role in the Fan Discord
    const isWhitelisted = await hasWhitelistedRoleInFanDiscord(user.discordId)

    if (!isWhitelisted) {
      return { success: false, message: "User is not whitelisted in the Fan Discord" }
    }

    // Sync the user's department from the Main Discord
    const success = await syncUserDepartmentFromMainDiscord(userId, user.discordId)

    if (success) {
      // Revalidate the user's profile page
      revalidatePath(`/profile/${userId}`)
      return { success: true, message: "Department synced successfully" }
    } else {
      return {
        success: false,
        message: "Failed to sync department. User may not be in the Main Discord or have no department roles.",
      }
    }
  } catch (error) {
    console.error("Error syncing department:", error)
    return { success: false, message: "An error occurred while syncing department" }
  }
}
