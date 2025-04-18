import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    // Get session (may be null for unauthenticated users)
    const session = await auth()

    // Determine if the user is authenticated and if they're an admin
    const isAuthenticated = !!session?.user
    const isAdmin =
      isAuthenticated &&
      ["WEBMASTER", "HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "ADMIN"].includes(session.user.role as string)

    // Fetch all users with selected fields
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
        discordId: true,
        createdAt: true,
        department: true,
        // Only include sensitive fields for authenticated users or admins
        lastActive: isAuthenticated ? true : false,
        isBanned: isAdmin ? true : false,
      },
      // Don't show banned users to non-admins
      where: isAdmin ? {} : { isBanned: false },
      orderBy: {
        role: "asc",
      },
    })

    // Format the response
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || "Anonymous",
      image: user.image,
      role: user.role,
      department: user.department || "N_A",
      discordId: user.discordId || null,
      joinDate: user.createdAt.toISOString(),
      // Only include lastActive if it was selected
      ...(user.lastActive && { lastActive: user.lastActive.toISOString() }),
      // Only include isBanned if it was selected
      ...(user.isBanned !== undefined && { isBanned: user.isBanned }),
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch members",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
