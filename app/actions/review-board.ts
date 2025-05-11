"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Check if a user is a member of any review board
export async function checkReviewBoardMembership(userId: number): Promise<boolean> {
  try {
    console.log(`Action: Checking if user ${userId} is a review board member`)

    // First check direct membership
    const directMemberCount = await prisma.applicationReviewBoard.count({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
    })

    if (directMemberCount > 0) {
      console.log(`User ${userId} is directly a member of ${directMemberCount} review boards`)
      return true
    }

    // If not a direct member, we need to check Discord roles
    // This is more complex and would require checking against Discord API
    // For now, we'll just return false
    console.log(`User ${userId} is not directly a member of any review boards`)
    return false
  } catch (error) {
    console.error("Error in checkReviewBoardMembership action:", error)
    return false
  }
}

export async function getUserReviewBoardTemplateIds(userId: number) {
  try {
    // Admin users can see all templates
    const session = await getServerSession(authOptions)
    if (
      session?.user?.role &&
      ["WEBMASTER", "HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR"].includes(session.user.role as string)
    ) {
      console.log(`User ${userId} has admin role ${session.user.role}, returning all templates`)
      const allTemplates = await prisma.applicationTemplate.findMany({
        select: { id: true },
      })
      return allTemplates.map((template) => template.id)
    }

    // Try to get templates where the user is a review board member
    try {
      const templates = await prisma.applicationTemplate.findMany({
        where: {
          reviewBoard: {
            members: {
              some: {
                id: userId,
              },
            },
          },
        },
        select: {
          id: true,
        },
      })

      console.log(`Found ${templates.length} templates for user ${userId}`)
      return templates.map((template) => template.id)
    } catch (modelError) {
      console.error("Error accessing review board model:", modelError)
      // If there's an error accessing the model, return empty array
      return []
    }
  } catch (error) {
    console.error("Error getting user review board template IDs:", error)
    return []
  }
}

// Add a user to a review board
export async function addUserToReviewBoard(reviewBoardId: number, userId: number) {
  try {
    await prisma.applicationReviewBoard.update({
      where: { id: reviewBoardId },
      data: {
        members: {
          connect: { id: userId },
        },
      },
    })

    revalidatePath(`/reviewboard/applications/templates`)
    return { success: true }
  } catch (error) {
    console.error("Error adding user to review board:", error)
    return { success: false, error: "Failed to add user to review board" }
  }
}

// Remove a user from a review board
export async function removeUserFromReviewBoard(reviewBoardId: number, userId: number) {
  try {
    await prisma.applicationReviewBoard.update({
      where: { id: reviewBoardId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    })

    revalidatePath(`/reviewboard/applications/templates`)
    return { success: true }
  } catch (error) {
    console.error("Error removing user from review board:", error)
    return { success: false, error: "Failed to remove user from review board" }
  }
}

// Update Discord role IDs for a review board
export async function updateReviewBoardDiscordRoles(reviewBoardId: number, discordRoleIds: string) {
  try {
    await prisma.applicationReviewBoard.update({
      where: { id: reviewBoardId },
      data: {
        discordRoleIds,
      },
    })

    revalidatePath(`/reviewboard/applications/templates`)
    return { success: true }
  } catch (error) {
    console.error("Error updating review board Discord roles:", error)
    return { success: false, error: "Failed to update Discord roles" }
  }
}
