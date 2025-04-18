"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getUserDepartmentsFromMainDiscord, hasWhitelistedRoleInFanDiscord } from "@/lib/main-discord"
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

    // Get all departments from the Main Discord
    const departments = await getUserDepartmentsFromMainDiscord(user.discordId)

    if (departments.length === 0) {
      return {
        success: false,
        message: "No departments found. User may not be in the Main Discord or have no department roles.",
      }
    }

    // If there's only one department, set it as the primary
    if (departments.length === 1) {
      await prisma.user.update({
        where: { id: userId },
        data: { department: departments[0] },
      })

      // Revalidate the user's profile page
      revalidatePath(`/profile/${userId}`)
      return { success: true, message: `Department set to ${departments[0]}` }
    }

    // If there are multiple departments, return them to the client
    return {
      success: true,
      multipleDepartments: true,
      departments,
      message: "Multiple departments found. Please select your primary department.",
    }
  } catch (error) {
    console.error("Error syncing department:", error)
    return { success: false, message: "An error occurred while syncing department" }
  }
}

export async function updatePrimaryDepartment(userId: number, department: string) {
  try {
    // Get the current user's session
    const session = await auth()
    if (!session?.user) {
      return { success: false, message: "Not authenticated" }
    }

    // Only allow users to update their own department
    if (Number(session.user.id) !== userId) {
      return { success: false, message: "You can only update your own department" }
    }

    // Update the user's department
    await prisma.user.update({
      where: { id: userId },
      data: { department },
    })

    // Revalidate the user's profile page
    revalidatePath(`/profile/${userId}`)
    return { success: true, message: `Primary department set to ${department}` }
  } catch (error) {
    console.error("Error updating primary department:", error)
    return { success: false, message: "An error occurred while updating department" }
  }
}
