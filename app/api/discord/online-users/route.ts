import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
    const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID

    if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
      return NextResponse.json({ error: "Discord configuration is missing" }, { status: 500 })
    }

    // Fetch guild members with presence data
    const response = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members?limit=1000`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`)
    }

    const members = await response.json()

    // Get presence data (online status)
    const presenceResponse = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/presences`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 30 }, // Cache for 30 seconds
    })

    let presences = []
    if (presenceResponse.ok) {
      presences = await presenceResponse.json()
    }

    // Create a map of user ID to presence status
    const presenceMap = new Map()
    presences.forEach((presence) => {
      presenceMap.set(presence.user.id, presence.status)
    })

    // Get all users with Discord IDs from our database
    const dbUsers = await prisma.user.findMany({
      where: {
        discordId: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
        discordId: true,
        department: true,
      },
    })

    // Create a map of Discord ID to database user
    const userMap = new Map()
    dbUsers.forEach((user) => {
      if (user.discordId) {
        userMap.set(user.discordId, user)
      }
    })

    // Filter online members and match with our database users
    const onlineMembers = members
      .filter((member) => {
        const status = presenceMap.get(member.user.id)
        return status === "online" || status === "idle" || status === "dnd"
      })
      .map((member) => {
        const dbUser = userMap.get(member.user.id)
        if (!dbUser) return null

        return {
          id: dbUser.id,
          name: dbUser.name,
          image:
            dbUser.image || member.user.avatar
              ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
              : null,
          role: dbUser.role,
          department: dbUser.department,
          discordId: member.user.id,
          status: presenceMap.get(member.user.id) || "online",
          discordJoinedAt: member.joined_at,
        }
      })
      .filter(Boolean)

    // Count guests (Discord members without accounts)
    const guestCount = members.filter((member) => {
      return (
        !member.user.bot &&
        !userMap.has(member.user.id) &&
        (presenceMap.get(member.user.id) === "online" ||
          presenceMap.get(member.user.id) === "idle" ||
          presenceMap.get(member.user.id) === "dnd")
      )
    }).length

    return NextResponse.json({
      users: onlineMembers,
      guestCount,
    })
  } catch (error) {
    console.error("Error fetching Discord online users:", error)
    return NextResponse.json({ error: "Failed to fetch online users", users: [], guestCount: 0 }, { status: 500 })
  }
}
