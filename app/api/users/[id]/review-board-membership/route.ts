"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma" // Changed from default import to named import

export async function checkReviewBoardMembership(userId: number) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session?.user) {
      console.log("No session found when checking review board membership")
      return false
    }

    // For debugging
    console.log(`Checking review board membership for user ${userId}`)
    console.log(`Current user is ${session.user.id} with role ${session.user.role}`)

    // Admin users always have access
    if (
      [
        "WEBMASTER",
        "HEAD_ADMIN",
        "SENIOR_ADMIN",
        "SPECIAL_ADVISOR",
        "STAFF",
        "RNR_ADMINISTRATION",
        "RNR_STAFF",
        "RNR_MEMBER",
      ].includes(session.user.role as string)
    ) {
      console.log(`User ${userId} has direct access through role ${session.user.role}`)
      return true
    }

    // Check if the ApplicationReviewBoard model exists in the schema
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

      const isMember = !!reviewBoardMembership
      console.log(`User ${userId} review board membership check result: ${isMember}`)
      return isMember
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
    // Admin users can see all templates
    const session = await getServerSession(authOptions)
    if (
      session?.user?.role &&
      ["WEBMASTER", "HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR"].includes(
        session.user.role as string,
      )
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
