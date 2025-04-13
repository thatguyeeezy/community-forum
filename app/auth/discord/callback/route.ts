import { NextResponse } from "next/server"
import { syncUserRoleFromDiscord } from "@/lib/discord-roles"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  const code = searchParams.get("code")

  // This is just a fallback handler - NextAuth should handle the actual OAuth flow
  // We'll add some debugging here to see if this route is being hit
  console.log("Discord callback route hit with code:", code)

  // If we have a code, we can try to manually sync roles
  // This is a backup in case the NextAuth flow doesn't trigger our sync
  if (code) {
    try {
      // Wait a moment for NextAuth to finish processing
      setTimeout(async () => {
        // Find the most recently created user with a Discord account
        const recentUser = await prisma.account.findFirst({
          where: {
            provider: "discord",
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: true,
          },
        })

        if (recentUser) {
          console.log("Found recent Discord user:", recentUser.providerAccountId)

          // Try to sync their role
          const syncedRole = await syncUserRoleFromDiscord(recentUser.providerAccountId)

          if (syncedRole) {
            console.log(`Manual role sync result: ${syncedRole}`)

            // Only update if not an admin role
            const adminRoles = ["HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "ADMIN", "JUNIOR_ADMIN"]
            if (!adminRoles.includes(recentUser.user.role)) {
              await prisma.user.update({
                where: { id: recentUser.userId },
                data: { role: syncedRole },
              })
              console.log(`Manually updated user role to ${syncedRole}`)
            }
          }
        }
      }, 3000)
    } catch (error) {
      console.error("Error in manual role sync:", error)
    }
  }

  // Redirect to home page
  return NextResponse.redirect(new URL("/", request.url))
}
