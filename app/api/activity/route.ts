// app/api/activity/route.ts
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const headersList = await headers()

  // Check for user ID header (logged-in users)
  const userId = headersList.get("x-user-id")

  if (userId) {
    try {
      // Update user's last active timestamp
      await prisma.user.update({
        where: { id: Number(userId) },
        data: { lastActive: new Date() },
      })
    } catch (error) {
      console.error("Error updating user activity:", error)
    }
  } else {
    // Check for guest tracking headers
    const guestIp = headersList.get("x-guest-ip")
    const guestUa = headersList.get("x-guest-ua")

    if (guestIp) {
      try {
        // Check if we already have a recent session for this IP and user agent
        const existingSession = await prisma.anonymousSession.findFirst({
          where: {
            ip: guestIp,
            userAgent: guestUa || "",
            lastSeen: {
              gte: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes
            },
          },
        })

        if (existingSession) {
          // Update the last seen timestamp
          await prisma.anonymousSession.update({
            where: { id: existingSession.id },
            data: { lastSeen: new Date() },
          })
        } else {
          // Create a new anonymous session
          await prisma.anonymousSession.create({
            data: {
              ip: guestIp,
              userAgent: guestUa || "",
              lastSeen: new Date(),
            },
          })
        }
      } catch (error) {
        console.error("Error tracking anonymous session:", error)
      }
    }
  }

  // Return an empty response
  return new NextResponse(null, { status: 204 })
}

