import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all users with limited fields for the members page
    const members = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
        department: true,
        discordId: true,
        createdAt: true,
        lastActive: true,
      },
      orderBy: {
        role: "asc", // Order by role to show admins first
      },
    })

    // Format the response
    const formattedMembers = members.map((member) => ({
      id: member.id,
      name: member.name || "Anonymous",
      image: member.image,
      role: member.role,
      department: member.department || "N_A",
      discordId: member.discordId,
      joinDate: member.createdAt.toISOString(),
      lastActive: member.lastActive ? member.lastActive.toISOString() : null,
    }))

    return NextResponse.json(formattedMembers)
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
