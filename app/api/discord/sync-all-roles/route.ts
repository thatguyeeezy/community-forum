import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { syncAllUserRoles } from "@/app/actions/discord"

export async function POST(request: NextRequest) {
  try {
    // Get the current user's session
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Call the server action to sync all user roles
    const result = await syncAllUserRoles()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error syncing all user roles:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred while syncing all user roles" },
      { status: 500 },
    )
  }
}
