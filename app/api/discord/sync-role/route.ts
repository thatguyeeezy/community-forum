import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { syncUserRole } from "@/app/actions/discord"

export async function POST(request: NextRequest) {
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

    // Call the server action to sync the user's role
    const result = await syncUserRole(Number.parseInt(userId, 10))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error syncing user role:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred while syncing the user's role" },
      { status: 500 },
    )
  }
}
