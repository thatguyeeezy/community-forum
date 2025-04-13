import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await auth()

  // Only allow admins to access this endpoint
  if (!session || !["HEAD_ADMIN", "SENIOR_ADMIN", "ADMIN"].includes(session.user?.role as string)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    // Check if we have the required environment variables
    const botToken = process.env.DISCORD_BOT_TOKEN
    const guildId = process.env.DISCORD_GUILD_ID

    if (!botToken || !guildId) {
      return NextResponse.json(
        {
          error: "Missing environment variables",
          botToken: botToken ? "Set" : "Missing",
          guildId: guildId ? "Set" : "Missing",
        },
        { status: 500 },
      )
    }

    // Test the Discord API directly
    console.log("Testing Discord API with guild ID:", guildId)

    // First, check if the bot can access the guild
    const guildResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      cache: "no-store",
    })

    const guildStatus = guildResponse.status
    const guildData = guildResponse.ok ? await guildResponse.json() : await guildResponse.text()

    // Then, try to get a member (the user who's making the request)
    const discordId = session.user?.discordId || "325305414705086465" // Fallback to your ID

    const memberResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordId}`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      cache: "no-store",
    })

    const memberStatus = memberResponse.status
    const memberData = memberResponse.ok ? await memberResponse.json() : await memberResponse.text()

    // Check bot permissions
    const botResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      cache: "no-store",
    })

    const botStatus = botResponse.status
    const botData = botResponse.ok ? await botResponse.json() : await botResponse.text()

    return NextResponse.json({
      success: true,
      guild: {
        status: guildStatus,
        data: guildData,
      },
      member: {
        status: memberStatus,
        data: memberData,
      },
      bot: {
        status: botStatus,
        data: botData,
      },
      environment: {
        botToken: botToken ? "Set (first 5 chars: " + botToken.substring(0, 5) + "...)" : "Missing",
        guildId: guildId,
      },
    })
  } catch (error) {
    console.error("Error testing Discord API:", error)
    return NextResponse.json({ error: "Failed to test Discord API", details: String(error) }, { status: 500 })
  }
}
