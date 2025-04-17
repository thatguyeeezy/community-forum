import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        department: true,
        discordId: true,
        createdAt: true,
        lastActive: true,
        discordJoinedAt: true,
        isBanned: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || "Anonymous",
      email: user.email || "",
      image: user.image,
      role: user.role,
      department: user.department || "N_A",
      discordId: user.discordId,
      createdAt: user.createdAt.toISOString(),
      lastActive: user.lastActive ? user.lastActive.toISOString() : null,
      discordJoinedAt: user.discordJoinedAt ? user.discordJoinedAt.toISOString() : null,
      isBanned: user.isBanned || false,
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
