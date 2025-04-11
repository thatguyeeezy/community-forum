import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get total member count
    const totalMembers = await prisma.user.count()

    // Get active users today
    const activeToday = await prisma.user.count({
      where: {
        lastActive: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    })

    // Get Discord member count using Discord API
    let discordMembers = 0
    try {
      const discordResponse = await fetch(
        `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}?with_counts=true`,
        {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        },
      )

      if (discordResponse.ok) {
        const discordData = await discordResponse.json()
        discordMembers = discordData.approximate_member_count || 0
      }
    } catch (error) {
      console.error("Error fetching Discord data:", error)
      // Fall back to a default value or the last known value
      discordMembers = 3705 // Fallback to the hardcoded value
    }

    // Get FiveM server status
    let serverStatus = {
      online: false,
      playerCount: 0,
    }

    try {
      const fivemResponse = await fetch(`http://${process.env.FIVEM_SERVER_IP}/players.json`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      })

      if (fivemResponse.ok) {
        const players = await fivemResponse.json()
        serverStatus = {
          online: true,
          playerCount: Array.isArray(players) ? players.length : 0,
        }
      }
    } catch (error) {
      console.error("Error fetching FiveM server status:", error)
      // Server is offline or unreachable
    }

    return NextResponse.json({
      totalMembers,
      activeToday,
      discordMembers,
      serverStatus,
    })
  } catch (error) {
    console.error("Error in metrics API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch metrics",
      },
      { status: 500 },
    )
  }
}
