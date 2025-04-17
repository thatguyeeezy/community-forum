import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasAdminPermission } from "@/lib/roles"

export async function GET(request: Request) {
  console.log("GET /api/users: Starting request")

  try {
    const session = await auth()

    if (!session?.user) {
      console.error("GET /api/users: No authenticated session")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin permissions
    const isAdmin = hasAdminPermission(session.user.role as string)
    if (!isAdmin) {
      console.error(`GET /api/users: User ${session.user.id} does not have admin permissions`)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("GET /api/users: Fetching users from database")

    try {
      // Fetch all users with selected fields
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          department: true,
          discordId: true,
          createdAt: true,
          lastActive: true,
          isBanned: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      console.log(`GET /api/users: Successfully fetched ${users.length} users`)

      // Format the response
      const formattedUsers = users.map((user) => ({
        id: user.id,
        name: user.name || "Anonymous",
        email: user.email || "No email",
        role: user.role,
        department: user.department || "N_A",
        discordId: user.discordId || null,
        createdAt: user.createdAt.toISOString(),
        lastActive: user.lastActive ? user.lastActive.toISOString() : null,
        isBanned: user.isBanned || false,
      }))

      // For users with Discord IDs, we'll fetch their Discord info in the frontend
      // This avoids making too many API calls here and potentially hitting rate limits

      return NextResponse.json(formattedUsers)
    } catch (error) {
      console.error("GET /api/users: Database error:", error)
      return NextResponse.json(
        {
          error: "Database error",
          details: error instanceof Error ? error.message : "Unknown database error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("GET /api/users: Server error:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    )
  }
}
