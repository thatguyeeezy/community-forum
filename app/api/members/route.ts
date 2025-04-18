import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
      },
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
