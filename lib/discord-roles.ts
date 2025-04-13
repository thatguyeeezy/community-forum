import type { Role } from "@prisma/client"

// Discord role IDs
export const DISCORD_ROLES = {
  SENIOR_STAFF: "1253758031112568832",
  STAFF: "1209852842727313438",
  STAFF_IN_TRAINING: "1209852843574693918",
  MEMBER: "1209852841825669120",
  APPLICANT: "1253758031112568832",
}
//SENIOR_STAFF: "1209852841825669120",
//STAFF: "1209852842727313438",
//STAFF_IN_TRAINING: "1209852843574693918",
//MEMBER: "1253761018769969244",
//APPLICANT: "1253758031112568832",

// Map Discord roles to application roles
export function mapDiscordRoleToAppRole(discordRoles: string[]): Role {
  if (discordRoles.includes(DISCORD_ROLES.SENIOR_STAFF)) {
    return "SENIOR_STAFF"
  } else if (discordRoles.includes(DISCORD_ROLES.STAFF)) {
    return "STAFF"
  } else if (discordRoles.includes(DISCORD_ROLES.STAFF_IN_TRAINING)) {
    return "STAFF_IN_TRAINING"
  } else if (discordRoles.includes(DISCORD_ROLES.MEMBER)) {
    return "MEMBER"
  } else if (discordRoles.includes(DISCORD_ROLES.APPLICANT)) {
    return "APPLICANT"
  }

  // Default role if no matching roles found
  return "APPLICANT"
}

// Function to fetch user's Discord roles with rate limit handling
export async function fetchDiscordRoles(discordId: string): Promise<string[]> {
  if (!discordId) return []

  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      },
    )

    // Check for rate limiting
    if (response.status === 429) {
      const rateLimitData = await response.json()
      const retryAfter = rateLimitData.retry_after || 5
      console.warn(`Discord API rate limited. Retry after ${retryAfter} seconds.`)

      // Wait for the retry-after period plus a small buffer
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000 + 500))

      // Try again recursively after waiting
      return fetchDiscordRoles(discordId)
    }

    if (!response.ok) {
      console.error(`Discord API error: ${response.status} ${response.statusText}`)
      return []
    }

    // Log rate limit headers for monitoring
    const remaining = response.headers.get("X-RateLimit-Remaining")
    const reset = response.headers.get("X-RateLimit-Reset")
    if (remaining && Number.parseInt(remaining) < 10) {
      console.warn(
        `Discord API rate limit warning: ${remaining} requests remaining until ${new Date(Number.parseInt(reset || "0") * 1000).toLocaleTimeString()}`,
      )
    }

    const data = await response.json()
    return data.roles || []
  } catch (error) {
    console.error("Error fetching Discord roles:", error)
    return []
  }
}

// Function to sync user's role based on Discord roles
export async function syncUserRoleFromDiscord(discordId: string): Promise<Role | null> {
  try {
    const discordRoles = await fetchDiscordRoles(discordId)
    if (!discordRoles.length) return null

    const mappedRole = mapDiscordRoleToAppRole(discordRoles)
    return mappedRole
  } catch (error) {
    console.error("Error syncing user role from Discord:", error)
    return null
  }
}
