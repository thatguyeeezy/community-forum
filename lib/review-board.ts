import { prisma } from "./prisma"

// Check if a user is a member of any review board
export async function isReviewBoardMember(userId: number): Promise<boolean> {
  try {
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

    return reviewBoards.map((rb) => rb.templateId)
  } catch (error) {
    console.error("Error fetching user review board template IDs:", error)
    return []
  }
}
