import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasAdminPermission } from "@/lib/roles"

export async function GET(request: Request) {
  console.log("GET /api/users: Starting request")

  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!session?.user) {
      console.error("GET /api/users: No authenticated session")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // If there's a search parameter and it's coming from the template form (for review board members),
    // we'll allow users with review board access to search
    const isSearchRequest = !!search && search.length >= 2

    // Check if user has admin permissions
    const isAdmin = hasAdminPermission(session.user.role as string)

    // Only admins can access the full user list, but we'll allow searching for review board members
    // by users who have review board access (which we'll assume is any authenticated user for now)
    if (!isAdmin && !isSearchRequest) {
      console.error(`GET /api/users: User ${session.user.id} does not have admin permissions`)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log(`GET /api/users: Fetching users from database${search ? ` with search: ${search}` : ""}`)

    try {
      // If there's a search parameter, filter users by name or email
      if (isSearchRequest) {
        // Convert search to lowercase for case-insensitive comparison
        const searchLower = search.toLowerCase()

        // Fetch all users and filter in memory for case-insensitive matching
        // This is a workaround for Prisma versions that don't support mode: "insensitive"
        const allUsers = await prisma.user.findMany({
          where: {
            isBanned: false,
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
          orderBy: {
            name: "asc",
          },
        })

        // Filter users in memory
        const filteredUsers = allUsers
          .filter((user) => {
            const nameMatch = user.name?.toLowerCase().includes(searchLower) || false
            const emailMatch = user.email?.toLowerCase().includes(searchLower) || false
            return nameMatch || emailMatch
          })
          .slice(0, limit)

        console.log(`GET /api/users: Successfully fetched ${filteredUsers.length} users matching search: ${search}`)
        return NextResponse.json(filteredUsers)
      }

      // Otherwise, fetch all users (admin only)
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
