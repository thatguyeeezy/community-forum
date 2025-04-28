"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

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

    // Check if user is a member of any review board
    const reviewBoardMembership = await prisma.applicationReviewBoard.findFirst({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
    })

    return !!reviewBoardMembership
  } catch (error) {
    console.error("Error checking review board membership:", error)
    throw error
  }
}

export async function getUserReviewBoardTemplateIds(userId: number) {
  try {
    const reviewBoards = await prisma.applicationReviewBoard.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        templateId: true,
      },
    })

    return reviewBoards.map((board) => board.templateId)
  } catch (error) {
    console.error("Error getting user review board template IDs:", error)
    throw error
  }
}
