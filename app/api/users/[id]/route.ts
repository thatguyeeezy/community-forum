// app/api/users/[id]/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasAdminPermission } from "@/lib/roles"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Properly await params before accessing properties
    const resolvedParams = await params
    const userId = resolvedParams.id

    if (!userId) {
      console.error("GET user: No user ID provided")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`GET user: Received request for user ID: ${userId}`)

    const session = await auth()
    if (!session?.user) {
      console.error("GET user: No authenticated session")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Session user data:", {
      id: session.user.id,
      role: session.user.role,
    })

    // Parse the ID - handle both numeric and string IDs
    let id: number
    try {
      id = Number.parseInt(userId, 10)
      if (isNaN(id)) {
        console.error(`GET user: Invalid user ID format: ${userId}`)
        return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
      }
    } catch (error) {
      console.error(`GET user: Error parsing user ID: ${userId}`, error)
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    console.log(`GET user: Fetching user with ID: ${id} (type: ${typeof id})`)

    // Convert both to strings for comparison
    const sessionUserId = session?.user?.id !== undefined ? String(session.user.id) : null
    const isOwnProfile = sessionUserId === String(id)
    const isAdmin = hasAdminPermission(session.user.role as string)

    // If not admin and not own profile, restrict access
    if (!isAdmin && !isOwnProfile) {
      console.error(`GET user: Permission denied for user ${sessionUserId} to access user ${id}`)
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    try {
      // Check if the user exists first with a simple query
      const userExists = await prisma.user.findUnique({
        where: { id },
        select: { id: true },
      })

      if (!userExists) {
        console.error(`GET user: User not found with ID: ${id}`)
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      console.log(`GET user: User exists with ID: ${id}, fetching details`)

      // Now fetch the full user details
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          rank: true,
          department: true,
          discordId: true,
          role: true,
          createdAt: true,
          rnrStatus: true,
          lastActive: true,
          status: true,
          discordJoinedAt: true,
          // Get counts for stats
          _count: {
            select: {
              threads: true,
              posts: true,
              followers: true,
              following: true,
            },
          },
        },
      })

      if (!user) {
        console.error(`GET user: User details not found with ID: ${id}`)
        return NextResponse.json({ error: "User details not found" }, { status: 404 })
      }

      console.log(`GET user: Successfully fetched user: ${user.name} (${user.id})`)

      // Format the response - create a new object without _count
      const { _count, ...userData } = user
      const formattedUser = {
        ...userData,
        threadCount: _count.threads,
        postCount: _count.posts,
        followers: _count.followers,
        following: _count.following,
        // Format dates
        createdAt: user.createdAt.toISOString(),
        lastActive: user.lastActive ? user.lastActive.toISOString() : null,
        discordJoinedAt: user.discordJoinedAt ? user.discordJoinedAt.toISOString() : null,
        // Add a default value for isBanned if it doesn't exist in the schema yet
        isBanned: false,
      }

      return NextResponse.json(formattedUser)
    } catch (error) {
      console.error(`GET user: Prisma error fetching user with ID: ${id}`, error)
      return NextResponse.json(
        {
          error: `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      {
        error: `Server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}

// Rest of the file remains the same as before
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Properly await params before accessing properties
    const resolvedParams = await params
    const userId = resolvedParams.id

    console.log(`PATCH user: Updating user with ID: ${userId}`)

    let id: number
    try {
      id = Number.parseInt(userId, 10)
      if (isNaN(id)) {
        console.error(`PATCH user: Invalid user ID format: ${userId}`)
        return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
      }
    } catch (error) {
      console.error(`PATCH user: Error parsing user ID: ${userId}`, error)
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const session = await auth()

    if (!session?.user) {
      console.error("PATCH user: No authenticated session")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user exists
    const userToUpdate = await prisma.user.findUnique({
      where: { id },
    })

    if (!userToUpdate) {
      console.error(`PATCH user: User not found with ID: ${id}`)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()
    console.log(`PATCH user: Update data for user ${id}:`, body)

    // Validate permissions based on what's being updated
    const currentUserRole = session.user.role as string

    // Only admins can update other users
    if (String(session.user.id) !== String(id) && !hasAdminPermission(currentUserRole)) {
      console.error(`PATCH user: Permission denied for user ${session.user.id} to update user ${id}`)
      return NextResponse.json({ error: "You don't have permission to update this user" }, { status: 403 })
    }

    // Special handling for role changes
    if (body.role && body.role !== userToUpdate.role) {
      // Only webmaster can change to/from webmaster
      if ((body.role === "WEBMASTER" || userToUpdate.role === "WEBMASTER") && currentUserRole !== "WEBMASTER") {
        console.error(`PATCH user: Permission denied for role change to/from WEBMASTER`)
        return NextResponse.json(
          {
            error: "Only a Webmaster can change Webmaster role",
          },
          { status: 403 },
        )
      }

      // Only webmaster or head admin can change to/from head admin
      if (
        (body.role === "HEAD_ADMIN" || userToUpdate.role === "HEAD_ADMIN") &&
        !["WEBMASTER", "HEAD_ADMIN"].includes(currentUserRole)
      ) {
        console.error(`PATCH user: Permission denied for role change to/from HEAD_ADMIN`)
        return NextResponse.json(
          {
            error: "Only a Webmaster or Head Admin can change Head Admin role",
          },
          { status: 403 },
        )
      }

      // Admin roles can only be changed by senior admin+
      if (
        ["JUNIOR_ADMIN", "ADMIN", "SENIOR_ADMIN"].includes(body.role) ||
        ["JUNIOR_ADMIN", "ADMIN", "SENIOR_ADMIN"].includes(userToUpdate.role)
      ) {
        if (!["WEBMASTER", "HEAD_ADMIN", "SENIOR_ADMIN"].includes(currentUserRole)) {
          console.error(`PATCH user: Permission denied for admin role change`)
          return NextResponse.json(
            {
              error: "You don't have permission to change admin roles",
            },
            { status: 403 },
          )
        }
      }
    }

    // Special handling for department changes
    if (body.department && body.department !== userToUpdate.department) {
      // Leadership and Dev departments can only be changed by head admin+
      if (
        (body.department === "LEADERSHIP" || body.department === "DEV") &&
        !["WEBMASTER", "HEAD_ADMIN"].includes(currentUserRole)
      ) {
        console.error(`PATCH user: Permission denied for department change to LEADERSHIP or DEV`)
        return NextResponse.json(
          {
            error: "Only Head Admin or Webmaster can assign to Leadership or Dev departments",
          },
          { status: 403 },
        )
      }
    }

    // Handle ban status updates
    if (body.isBanned !== undefined && body.isBanned !== userToUpdate.isBanned) {
      if (!hasAdminPermission(currentUserRole)) {
        console.error(`PATCH user: Permission denied for account disable status change`)
        return NextResponse.json(
          {
            error: "Only admins can disable or enable user accounts",
          },
          { status: 403 },
        )
      }
    }

    // Prepare update data
    const updateData: any = {}

    // Only include fields that are provided and allowed
    if (body.name !== undefined) updateData.name = body.name
    if (body.role !== undefined) updateData.role = body.role
    if (body.department !== undefined) updateData.department = body.department
    if (body.isBanned !== undefined) updateData.isBanned = body.isBanned

    console.log(`PATCH user: Final update data for user ${id}:`, updateData)

    try {
      // Update the user
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
      })

      console.log(`PATCH user: Successfully updated user ${updatedUser.id}`)

      return NextResponse.json({
        message: "User updated successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          role: updatedUser.role,
          department: updatedUser.department,
          isBanned: updatedUser.isBanned,
        },
      })
    } catch (error) {
      console.error(`PATCH user: Database error updating user ${id}:`, error)
      return NextResponse.json(
        {
          error: `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Properly await params before accessing properties
    const resolvedParams = await params
    const userId = resolvedParams.id

    console.log(`DELETE user: Deleting user with ID: ${userId}`)

    let id: number
    try {
      id = Number.parseInt(userId, 10)
      if (isNaN(id)) {
        console.error(`DELETE user: Invalid user ID format: ${userId}`)
        return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
      }
    } catch (error) {
      console.error(`DELETE user: Error parsing user ID: ${userId}`, error)
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const session = await auth()

    if (!session?.user) {
      console.error("DELETE user: No authenticated session")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only webmaster and head admin can delete users
    const currentUserRole = session.user.role as string
    if (currentUserRole !== "WEBMASTER" && currentUserRole !== "HEAD_ADMIN") {
      console.error(`DELETE user: Permission denied for user ${session.user.id} with role ${currentUserRole}`)
      return NextResponse.json(
        {
          error: "Only Head Admin and Webmaster can delete users",
        },
        { status: 403 },
      )
    }

    // Check if user exists
    const userToDelete = await prisma.user.findUnique({
      where: { id },
    })

    if (!userToDelete) {
      console.error(`DELETE user: User not found with ID: ${id}`)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Prevent deleting webmaster if you're not a webmaster
    if (userToDelete.role === "WEBMASTER" && currentUserRole !== "WEBMASTER") {
      console.error(`DELETE user: Permission denied for deleting WEBMASTER user`)
      return NextResponse.json(
        {
          error: "Only a Webmaster can delete another Webmaster",
        },
        { status: 403 },
      )
    }

    try {
      // Delete the user
      await prisma.user.delete({
        where: { id },
      })

      console.log(`DELETE user: Successfully deleted user ${id}`)

      return NextResponse.json({ message: "User deleted successfully" })
    } catch (error) {
      console.error(`DELETE user: Database error deleting user ${id}:`, error)
      return NextResponse.json(
        {
          error: `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
