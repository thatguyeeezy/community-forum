// app/api/users/[id]/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
        badges: true, // Include badges
        createdAt: true,
        rnrStatus: true,
        lastActive: true,
        status: true,
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
