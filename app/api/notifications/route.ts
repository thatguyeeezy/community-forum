import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 10

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: session.user.id,
        read: false,
      },
    })

    // Return as an array for compatibility with existing code
    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}
