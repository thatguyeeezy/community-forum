// app/api/users/[id]/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasAdminPermission } from "@/lib/roles"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Await the params object
  const resolvedParams = await params
  const userId = resolvedParams.id

  const session = await auth()

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const id = Number.parseInt(userId, 10)

    // Convert both to strings for comparison
    const sessionUserId = session?.user?.id !== undefined ? String(session.user.id) : null
    const isOwnProfile = sessionUserId === String(id)

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: isOwnProfile, // Only return email for own profile
        image: true,
        bio: true,
        rank: true,
        department: true,
        discordId: true, // Always include discordId
        role: true,
        createdAt: true,
        rnrStatus: true,
        lastActive: true,
        status: true,
        isBanned: true,
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
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

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
    }

    return NextResponse.json(formattedUser)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const resolvedParams = await params
    const userId = resolvedParams.id
    const id = Number.parseInt(userId, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user exists
    const userToUpdate = await prisma.user.findUnique({
      where: { id },
    })

    if (!userToUpdate) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()

    // Validate permissions based on what's being updated
    const currentUserRole = session.user.role as string

    // Only admins can update other users
    if (String(session.user.id) !== String(id) && !hasAdminPermission(currentUserRole)) {
      return NextResponse.json({ error: "You don't have permission to update this user" }, { status: 403 })
    }

    // Special handling for role changes
    if (body.role && body.role !== userToUpdate.role) {
      // Only webmaster can change to/from webmaster
      if ((body.role === "WEBMASTER" || userToUpdate.role === "WEBMASTER") && currentUserRole !== "WEBMASTER") {
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
        return NextResponse.json(
          {
            error: "Only admins can ban or unban users",
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

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    })

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
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const resolvedParams = await params
    const userId = resolvedParams.id
    const id = Number.parseInt(userId, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only webmaster and head admin can delete users
    const currentUserRole = session.user.role as string
    if (currentUserRole !== "WEBMASTER" && currentUserRole !== "HEAD_ADMIN") {
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
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Prevent deleting webmaster if you're not a webmaster
    if (userToDelete.role === "WEBMASTER" && currentUserRole !== "WEBMASTER") {
      return NextResponse.json(
        {
          error: "Only a Webmaster can delete another Webmaster",
        },
        { status: 403 },
      )
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
