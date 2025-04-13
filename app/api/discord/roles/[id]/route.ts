import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { fetchDiscordRoles, mapDiscordRoleToAppRole } from "@/lib/discord-roles"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()

  // Only allow admins to check roles
  if (!session || !["HEAD_ADMIN", "SENIOR_ADMIN", "ADMIN"].includes(session.user?.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const discordId = params.id

  if (!discordId) {
    return NextResponse.json({ error: "Discord ID is required" }, { status: 400 })
  }

  try {
    console.log(`API: Fetching Discord roles for ${discordId}`)

    // Fetch the Discord roles
    const roles = await fetchDiscordRoles(discordId)

    // Map to application role
    const mappedRole = roles.length ? mapDiscordRoleToAppRole(roles) : null

    return NextResponse.json({
      discordId,
      roles,
      mappedRole,
      discordRoleIds: {
        SENIOR_STAFF: "1209567769826295899",
        STAFF: "1209852842727313438",
        STAFF_IN_TRAINING: "1209852843574693918",
        MEMBER: "1209852841825669120",
        APPLICANT: "1253758031112568832",
      },
    })
  } catch (error) {
    console.error("Error fetching Discord roles:", error)
    return NextResponse.json({ error: "Failed to fetch Discord roles" }, { status: 500 })
  }
}
