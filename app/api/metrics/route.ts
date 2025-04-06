// app/api/metrics/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Helper function to get Discord member count
async function getDiscordMemberCount() {
  try {
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
    const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID

    if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
      console.error("Discord bot token or guild ID not set")
      return 0
    }

    const response = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}?with_counts=true`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`)
    }

    const data = await response.json()
    return data.approximate_member_count || 0
  } catch (error) {
    console.error("Error fetching Discord member count:", error)
    return 0
  }
}

// Helper function to get FiveM server status
async function getFiveMServerStatus() {
  try {
    const FIVEM_SERVER_IP = process.env.FIVEM_SERVER_IP

    if (!FIVEM_SERVER_IP) {
      console.error("FiveM server IP not set")
      return { online: false, playerCount: 0 }
    }

    const response = await fetch(`http://${FIVEM_SERVER_IP}/players.json`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      return { online: false, playerCount: 0 }
    }

    const players = await response.json()
    return {
      online: true,
      playerCount: Array.isArray(players) ? players.length : 0,
    }
  } catch (error) {
    console.error("Error fetching FiveM server status:", error)
    return { online: false, playerCount: 0 }
  }
}

export async function GET() {
  try {
    // Get total members
    const totalMembers = await prisma.user.count()

    // Get active today (users who logged in today)
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const activeToday = await prisma.user.count({
      where: {
        lastActive: {
          gte: startOfDay,
        },
      },
    })

    // Get Discord member count
    const discordMembers = await getDiscordMemberCount()

    // Get FiveM server status
    const serverStatus = await getFiveMServerStatus()

    return NextResponse.json({
      totalMembers,
      activeToday,
      discordMembers,
      serverStatus,
    })
  } catch (error) {
    console.error("Error fetching metrics:", error)
    return NextResponse.json(
      {
        totalMembers: 0,
        activeToday: 0,
        discordMembers: 0,
        serverStatus: {
          online: false,
          playerCount: 0,
        },
      },
      { status: 500 },
    )
  }
}

