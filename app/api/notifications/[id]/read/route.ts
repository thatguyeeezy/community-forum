import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notificationId = Number.parseInt(params.id)

    if (isNaN(notificationId)) {
      return NextResponse.json({ error: "Invalid notification ID" }, { status: 400 })
    }

    // Check if the notification belongs to the user
    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    })

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    if (notification.recipientId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Mark the notification as read
    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 })
  }
}
