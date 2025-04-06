import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || "Anonymous",
      image: user.image,
      role: user.role,
      joinDate: user.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

