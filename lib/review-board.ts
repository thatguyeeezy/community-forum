import { prisma } from "./prisma"

// Check if a user is a member of any review board
export async function isReviewBoardMember(userId: number): Promise<boolean> {
  try {
    console.log(`Checking if user ${userId} is a review board member`)

    // Count how many review boards the user is a member of
    const count = await prisma.applicationReviewBoard.count({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
    })

    console.log(`User ${userId} is a member of ${count} review boards`)
    return count > 0
  } catch (error) {
    console.error("Error checking review board membership:", error)
    return false
  }
}

// Get all review boards a user is a member of
export async function getUserReviewBoards(userId: number) {
  try {
    const reviewBoards = await prisma.applicationReviewBoard.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        template: true,
      },
    })

    return reviewBoards
  } catch (error) {
    console.error("Error fetching user review boards:", error)
    return []
  }
}

// Get template IDs for which the user is a review board member
export async function getUserReviewBoardTemplateIds(userId: number): Promise<number[]> {
  try {
    console.log(`Getting review board template IDs for user ${userId}`)

    // Find all review boards where the user is a member
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

    const templateIds = reviewBoards.map((rb) => rb.templateId)
    console.log(`User ${userId} has access to template IDs:`, templateIds)
    return templateIds
  } catch (error) {
    console.error("Error fetching user review board template IDs:", error)
    return []
  }
}
