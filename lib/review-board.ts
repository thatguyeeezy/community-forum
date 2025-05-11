import { prisma } from "./prisma"

// Check if a user is a member of any review board
export async function isReviewBoardMember(userId: number): Promise<boolean> {
  try {
    console.log(`Checking if user ${userId} is a review board member`)

    // First check if the user is directly a member of any review board
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

    // If not a direct member, check if the user has any of the Discord roles
    // that are associated with review boards
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { discordId: true },
    })

    if (!user?.discordId) {
      console.log(`User ${userId} has no Discord ID, cannot check role-based membership`)
      return false
    }

    // Get all review boards with Discord role IDs
    const reviewBoardsWithRoles = await prisma.applicationReviewBoard.findMany({
      where: {
        discordRoleIds: { not: null },
      },
      select: {
        id: true,
        discordRoleIds: true,
      },
    })

    // Check if the user has any of these roles
    // This would require checking against the Discord API or a local cache
    // For now, we'll just log the information
    console.log(`Found ${reviewBoardsWithRoles.length} review boards with Discord roles`)
    reviewBoardsWithRoles.forEach((board) => {
      console.log(`Review board ${board.id} has Discord roles: ${board.discordRoleIds}`)
    })

    // Since we can't check Discord roles here, we'll return false
    // The actual check should be done elsewhere with Discord API access
    return false
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
