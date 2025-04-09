// app/api/discord/member/[id]/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Await the params object
  const resolvedParams = await params
  const discordId = resolvedParams.id

  const session = await auth()

  if (!discordId) {
    return NextResponse.json({ error: "Discord ID is required" }, { status: 400 })
  }

  try {
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
    const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID

    if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
      return NextResponse.json({ error: "Discord configuration is missing" }, { status: 500 })
    }

    // Fetch the guild member from Discord API
    const response = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordId}`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "User not found in Discord server" }, { status: 404 })
      }
      throw new Error(`Discord API error: ${response.status}`)
    }

    const memberData = await response.json()

    return NextResponse.json({
      joinedAt: memberData.joined_at,
      roles: memberData.roles,
      nickname: memberData.nick,
      avatar: memberData.avatar,
      communicationDisabledUntil: memberData.communication_disabled_until,
      isPending: memberData.pending,
    })
  } catch (error) {
    console.error("Error fetching Discord member:", error)
    return NextResponse.json({ error: "Failed to fetch Discord member information" }, { status: 500 })
  }
}
