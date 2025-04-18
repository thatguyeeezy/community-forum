// Utility functions for interacting with the Main Discord server

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
    // Replace these with your actual role IDs
    "123456789012345678": "BSFR",
    "234567890123456789": "BSO",
    "345678901234567890": "MPD",
    "456789012345678901": "FHP",
    "567890123456789012": "COMMS",
    "678901234567890123": "FWC",
    "789012345678901234": "CIV",
    "890123456789012345": "DEV",
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
  