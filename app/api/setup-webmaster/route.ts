import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  // Get the URL parameters
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key")
  const userId = searchParams.get("userId")

  // Check if the key matches the environment variable
  if (!key || key !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    // Convert userId to number
    const userIdNum = Number.parseInt(userId, 10)

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userIdNum },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update the user's role to WEBMASTER
    await prisma.user.update({
      where: { id: userIdNum },
      data: { role: "WEBMASTER" },
    })

    return NextResponse.json({
      success: true,
      message: `User ${user.name} (ID: ${userIdNum}) has been granted WEBMASTER role`,
    })
  } catch (error) {
    console.error("Error setting up webmaster:", error)
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
  }
}
