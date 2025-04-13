import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Convert user ID to number
    const userId = typeof session.user.id === "string" ? Number.parseInt(session.user.id, 10) : session.user.id

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!, 10) : 10
    const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page")!, 10) : 1
    const skip = (page - 1) * limit

    console.log(`Fetching notifications for user ID: ${userId} (type: ${typeof userId})`)

    // Get notifications for the user
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip,
    })

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: userId,
        read: false,
      },
    })

    console.log(`Found ${notifications.length} notifications, ${unreadCount} unread`)

    return NextResponse.json({
      notifications,
      unreadCount,
      page,
      limit,
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}
