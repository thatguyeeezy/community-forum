import type { Role } from "@prisma/client"

// Discord role IDs
export const DISCORD_ROLES = {
  SENIOR_STAFF: "1253761018769969244",
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
    console.log("Mapping Discord roles:", discordRoles)
    console.log("Looking for Senior Staff role:", DISCORD_ROLES.SENIOR_STAFF)
  
    if (discordRoles.includes(DISCORD_ROLES.SENIOR_STAFF)) {
      console.log("Found Senior Staff role!")
      return "SENIOR_STAFF"
    } else if (discordRoles.includes(DISCORD_ROLES.STAFF)) {
      console.log("Found Staff role!")
      return "STAFF"
    } else if (discordRoles.includes(DISCORD_ROLES.STAFF_IN_TRAINING)) {
      console.log("Found Staff in Training role!")
      return "STAFF_IN_TRAINING"
    } else if (discordRoles.includes(DISCORD_ROLES.MEMBER)) {
      console.log("Found Member role!")
      return "MEMBER"
    } else if (discordRoles.includes(DISCORD_ROLES.APPLICANT)) {
      console.log("Found Applicant role!")
      return "APPLICANT"
    }
  
    console.log("No matching roles found, defaulting to APPLICANT")
    // Default role if no matching roles found
    return "APPLICANT"
  }
  
  // Function to fetch user's Discord roles with rate limit handling
  export async function fetchDiscordRoles(discordId: string): Promise<string[]> {
    if (!discordId) {
      console.log("No Discord ID provided")
      return []
    }
  
    console.log(`Fetching Discord roles for user ${discordId}`)
    console.log(`Using Guild ID: ${process.env.DISCORD_GUILD_ID}`)
  
    try {
      const url = `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordId}`
      console.log(`Making request to: ${url}`)
  
      const response = await fetch(url, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      })
  
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
        const errorText = await response.text()
        console.error(`Error response: ${errorText}`)
        return []
      }
  
      // Log rate limit headers for monitoring
      const remaining = response.headers.get("X-RateLimit-Remaining")
      const reset = response.headers.get("X-RateLimit-Reset")
      if (remaining) {
        console.log(`Discord API rate limit: ${remaining} requests remaining`)
      }
      if (reset) {
        console.log(`Discord API rate limit resets at: ${new Date(Number.parseInt(reset) * 1000).toLocaleTimeString()}`)
      }
  
      const data = await response.json()
      console.log("Discord API response:", JSON.stringify(data, null, 2))
  
      if (data.roles && Array.isArray(data.roles)) {
        console.log(`Found ${data.roles.length} roles for user:`, data.roles)
        return data.roles
      } else {
        console.log("No roles found in response or invalid format")
        return []
      }
    } catch (error) {
      console.error("Error fetching Discord roles:", error)
      return []
    }
  }
  
  // Function to sync user's role based on Discord roles
  export async function syncUserRoleFromDiscord(discordId: string): Promise<Role | null> {
    try {
      console.log(`Syncing role for Discord ID: ${discordId}`)
      const discordRoles = await fetchDiscordRoles(discordId)
  
      if (!discordRoles.length) {
        console.log("No Discord roles found, returning null")
        return null
      }
  
      const mappedRole = mapDiscordRoleToAppRole(discordRoles)
      console.log(`Mapped Discord roles to application role: ${mappedRole}`)
      return mappedRole
    } catch (error) {
      console.error("Error syncing user role from Discord:", error)
      return null
    }
  }
  