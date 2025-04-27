import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { isReviewBoardMember } from "@/lib/review-board"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the ID from params and convert to string for comparison
    const requestedId = params.id.toString()

    // Check if user is requesting their own data
    if (
      session.user.id !== requestedId &&
      !["SPECIAL_ADVISOR", "SENIOR_ADMIN", "HEAD_ADMIN", "WEBMASTER"].includes(session.user.role as string)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const userId = Number.parseInt(requestedId, 10)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const isMember = await isReviewBoardMember(userId)

    return NextResponse.json({ isMember })
  } catch (error) {
    console.error("Error checking review board membership:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
