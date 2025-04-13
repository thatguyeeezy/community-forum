import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = Number.parseInt(id, 10)
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const sessionUserId = String(session.user.id)
    const isOwnProfile = sessionUserId === String(id)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: isOwnProfile, // Only include email if it's the user's own profile
        image: true,
        bio: true,
        role: true,
        badges: true, // Add this line to include badges
        rank: true,
        department: true,
        rnrStatus: true,
        discordId: true,
        createdAt: true,
        lastActive: true,
        status: true,
        _count: {
          select: {
            threads: true,
            posts: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate followers and following counts
    const followers = await prisma.follow.count({
      where: {
        followingId: userId,
      },
    })

    const following = await prisma.follow.count({
      where: {
        followerId: userId,
      },
    })

    return NextResponse.json({
      ...user,
      followers,
      following,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
