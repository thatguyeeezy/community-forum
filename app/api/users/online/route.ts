// app/api/users/online/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get current session
    const session = await getServerSession(authOptions)
    
    // Get all users who have been active in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    
    // Find users who are currently online with active sessions
    const onlineUsers = await prisma.user.findMany({
      where: {
        lastActive: {
          gte: fiveMinutesAgo,
        },
        // Check for active sessions
        sessions: {
          some: {
            expires: {
              gt: new Date()
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
        lastActive: true,
      },
      orderBy: [
        { role: 'asc' },
        { lastActive: 'desc' }
      ],
      take: 10,
    })

    // Count active anonymous sessions in the last 5 minutes
    // If you've added the AnonymousSession model to your schema
    let guestCount = 0
    try {
      guestCount = await prisma.anonymousSession.count({
        where: {
          lastSeen: {
            gte: fiveMinutesAgo
          }
        }
      })
    } catch (error) {
      console.error("Error counting anonymous sessions:", error)
      // If the AnonymousSession model doesn't exist yet, this will fail
      // We'll just use 0 as the guest count
    }

    return NextResponse.json({
      users: onlineUsers,
      guestCount: guestCount,
    })
  } catch (error) {
    console.error("Error fetching online users:", error)
    return NextResponse.json({ users: [], guestCount: 0 }, { status: 500 })
  }
}