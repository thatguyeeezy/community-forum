import { prisma } from "@/lib/prisma"

/**
 * Check if a user is a member of the Main Discord server
 * @param discordId The Discord ID of the user to check
 * @returns Boolean indicating if the user is in the Main Discord
 */
export async function isUserInMainDiscord(discordId: string): Promise<boolean> {
  try {
    // Skip the check in development if no token is provided
    if (process.env.NODE_ENV === "development" && !process.env.MAIN_DISCORD_BOT_TOKEN) {
      console.log("Development mode: Simulating Main Discord membership check")
      return true
    }

    const mainDiscordGuildId = process.env.MAIN_DISCORD_GUILD_ID
    const mainDiscordBotToken = process.env.MAIN_DISCORD_BOT_TOKEN

    if (!mainDiscordGuildId || !mainDiscordBotToken) {
      console.error("Missing Main Discord configuration")
      return false
    }

    // Make a request to the Discord API to check if the user is in the guild
    const response = await fetch(`https://discord.com/api/v10/guilds/${mainDiscordGuildId}/members/${discordId}`, {
      headers: {
        Authorization: `Bot ${mainDiscordBotToken}`,
      },
      cache: "no-store",
    })

    // If the response is 200, the user is in the guild
    return response.status === 200
  } catch (error) {
    console.error("Error checking Main Discord membership:", error)
    return false
  }
}

// Map of Discord role IDs to department names
const MAIN_DISCORD_DEPARTMENT_ROLES: Record<string, string> = {
  "1254493228368138300": "BSFR",
  "1209491889053638676": "RNR",
  "1254480335782154390": "BSO",
  "1254491794012508251": "MPD",
  "1254475337669017600": "FHP",
  "1254497904249536622": "COMMS",
  "1254480328710684794": "FWC",
  "1254497942564241458": "CIV",
  "1144075648885870654": "DEV",
}

/**
 * Get the departments a user has based on their roles in the Main Discord
 * @param discordId The Discord ID of the user
 * @returns Array of department names the user has roles for
 */
export async function getUserDepartmentsFromMainDiscord(discordId: string): Promise<string[]> {
  try {
    // Skip the check in development if no token is provided
    if (process.env.NODE_ENV === "development" && !process.env.MAIN_DISCORD_BOT_TOKEN) {
      console.log("Development mode: Simulating Main Discord departments")
      return ["BSO", "FHP"] // Return some example departments
    }

    const mainDiscordGuildId = process.env.MAIN_DISCORD_GUILD_ID
    const mainDiscordBotToken = process.env.MAIN_DISCORD_BOT_TOKEN

    if (!mainDiscordGuildId || !mainDiscordBotToken) {
      console.error("Missing Main Discord configuration")
      return []
    }

    // Make a request to the Discord API to get the user's roles
    const response = await fetch(`https://discord.com/api/v10/guilds/${mainDiscordGuildId}/members/${discordId}`, {
      headers: {
        Authorization: `Bot ${mainDiscordBotToken}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    const userRoles = data.roles || []

    // Map the roles to departments
    const departments = userRoles.map((roleId: string) => MAIN_DISCORD_DEPARTMENT_ROLES[roleId]).filter(Boolean)

    return [...new Set(departments)] // Remove duplicates
  } catch (error) {
    console.error("Error getting Main Discord departments:", error)
    return []
  }
}

/**
 * Sync a user's department from the Main Discord server
 * @param userId The user ID in the database
 * @param discordId The Discord ID of the user
 * @returns Boolean indicating if the sync was successful
 */
export async function syncUserDepartmentFromMainDiscord(userId: number, discordId: string): Promise<boolean> {
  try {
    // Get the user's departments from the Main Discord
    const departments = await getUserDepartmentsFromMainDiscord(discordId)

    if (departments.length === 0) {
      console.log(`No departments found for user ${userId} in Main Discord`)
      return false
    }

    // Use the first department as the primary department
    const primaryDepartment = departments[0]

    // Update the user's department in the database
    await prisma.user.update({
      where: { id: userId },
      data: { department: primaryDepartment },
    })

    console.log(`Updated user ${userId} department to ${primaryDepartment}`)
    return true
  } catch (error) {
    console.error(`Error syncing department for user ${userId}:`, error)
    return false
  }
}

/**
 * Check if a user has the Whitelisted role in the Fan Discord
 * @param discordId The Discord ID of the user
 * @returns Boolean indicating if the user has the Whitelisted role
 */
export async function hasWhitelistedRoleInFanDiscord(discordId: string): Promise<boolean> {
  try {
    // Skip the check in development if no token is provided
    if (process.env.NODE_ENV === "development" && !process.env.DISCORD_BOT_TOKEN) {
      console.log("Development mode: Simulating Fan Discord whitelist check")
      return true
    }

    const fanDiscordGuildId = process.env.DISCORD_GUILD_ID
    const fanDiscordBotToken = process.env.DISCORD_BOT_TOKEN

    // This should be the actual role ID for the "Whitelisted" role in your Fan Discord
    const WHITELISTED_ROLE_ID = process.env.FAN_DISCORD_WHITELISTED_ROLE_ID || "1253761018769969244" // Replace with actual ID

    if (!fanDiscordGuildId || !fanDiscordBotToken) {
      console.error("Missing Fan Discord configuration")
      return false
    }

    // Make a request to the Discord API to get the user's roles in the Fan Discord
    const response = await fetch(`https://discord.com/api/v10/guilds/${fanDiscordGuildId}/members/${discordId}`, {
      headers: {
        Authorization: `Bot ${fanDiscordBotToken}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    const userRoles = data.roles || []

    // Check if the user has the Whitelisted role
    return userRoles.includes(WHITELISTED_ROLE_ID)
  } catch (error) {
    console.error("Error checking Fan Discord whitelist:", error)
    return false
  }
}
