import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get search query from URL
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    // Search for users by name
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        isBanned: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
      },
      take: limit,
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error searching users:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
