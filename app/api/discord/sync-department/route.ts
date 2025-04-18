import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { syncUserDepartmentFromMainDiscord, hasWhitelistedRoleInFanDiscord } from "@/lib/main-discord"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    // Get the current user's session
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    // Get the user's Discord ID
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { discordId: true },
    })

    if (!user || !user.discordId) {
      return NextResponse.json({ success: false, message: "User has no Discord ID" }, { status: 400 })
    }

    // Check if user has the Whitelisted role in the Fan Discord
    const isWhitelisted = await hasWhitelistedRoleInFanDiscord(user.discordId)

    if (!isWhitelisted) {
      return NextResponse.json(
        { success: false, message: "User is not whitelisted in the Fan Discord" },
        { status: 400 },
      )
    }

    // Sync the user's department from the Main Discord
    const success = await syncUserDepartmentFromMainDiscord(Number(userId), user.discordId)

    if (success) {
      return NextResponse.json({ success: true, message: "Department synced successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Failed to sync department" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error syncing department:", error)
    return NextResponse.json({ success: false, message: "An error occurred while syncing department" }, { status: 500 })
  }
}
