"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma" // Changed from default import to named import

export async function checkReviewBoardMembership(userId: number) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session?.user) {
      throw new Error("Unauthorized")
    }

    // Check if user is requesting their own data or is an admin
    if (
      session.user.id !== userId.toString() &&
      !["SPECIAL_ADVISOR", "SENIOR_ADMIN", "HEAD_ADMIN", "WEBMASTER"].includes(session.user.role as string)
    ) {
      throw new Error("Forbidden")
    }

    // Check if the ApplicationReviewBoard model exists in the schema
    // If it doesn't exist, we'll assume the user is not a member
    try {
      // Check if user is a member of any review board
      const reviewBoardMembership = await prisma.applicationTemplate.findFirst({
        where: {
          reviewBoard: {
            members: {
              some: {
                id: userId,
              },
            },
          },
        },
      })

      return !!reviewBoardMembership
    } catch (modelError) {
      console.error("Error accessing review board model:", modelError)
      // If there's an error accessing the model, return false
      return false
    }
  } catch (error) {
    console.error("Error checking review board membership:", error)
    // Return false instead of throwing to prevent breaking the UI
    return false
  }
}

export async function getUserReviewBoardTemplateIds(userId: number) {
  try {
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
