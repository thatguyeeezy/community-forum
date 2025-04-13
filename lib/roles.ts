import type { Role } from "@prisma/client"

// Role hierarchy from highest to lowest
export const ROLE_HIERARCHY = [
  "HEAD_ADMIN",
  "SENIOR_ADMIN",
  "SPECIAL_ADVISOR",
  "ADMIN",
  "JUNIOR_ADMIN",
  "SENIOR_STAFF",
  "STAFF",
  "STAFF_IN_TRAINING",
  "MEMBER",
  "APPLICANT",
] as const

// Available badges
export const BADGES = {
  WEBMASTER: "WEBMASTER",
  DEVELOPER: "DEVELOPER",
  RETIRED_ADMIN: "RETIRED_ADMIN",
  CONTRIBUTOR: "CONTRIBUTOR",
} as const

// Group roles by permission level
export const ADMIN_ROLES = ["HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "ADMIN"]
export const STAFF_ROLES = ["JUNIOR_ADMIN", "SENIOR_STAFF", "STAFF"]
export const BASIC_ROLES = ["STAFF_IN_TRAINING", "MEMBER", "APPLICANT"]

// Check if a user has admin permissions
export function hasAdminPermission(role?: string, badges?: string[]): boolean {
  if (badges?.includes(BADGES.WEBMASTER)) return true
  return role ? ADMIN_ROLES.includes(role) : false
}

// Check if a user has staff permissions
export function hasStaffPermission(role?: string, badges?: string[]): boolean {
  if (badges?.includes(BADGES.WEBMASTER)) return true
  return role ? ADMIN_ROLES.includes(role) || STAFF_ROLES.includes(role) : false
}

// Check if a user is a webmaster
export function isWebmaster(badges?: string[]): boolean {
  return badges?.includes(BADGES.WEBMASTER) || false
}

// Check if a user can assign a specific role
export function canAssignRole(userRole?: string, targetRole?: string, badges?: string[]): boolean {
  if (!userRole || !targetRole) return false

  // Webmaster can assign any role
  if (badges?.includes(BADGES.WEBMASTER)) return true

  // Get the indices in the hierarchy (lower index = higher rank)
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole as any)
  const targetRoleIndex = ROLE_HIERARCHY.indexOf(targetRole as any)

  // User can only assign roles that are lower in the hierarchy (higher index)
  return userRoleIndex < targetRoleIndex
}

// Get available roles that a user can assign
export function getAssignableRoles(userRole?: string, badges?: string[]): string[] {
  if (!userRole) return []

  // Webmaster can assign any role
  if (badges?.includes(BADGES.WEBMASTER)) {
    return [...ROLE_HIERARCHY]
  }

  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole as any)
  if (userRoleIndex === -1) return []

  // Return all roles that have a higher index (lower rank) than the user's role
  return ROLE_HIERARCHY.filter((_, index) => index > userRoleIndex)
}

// Format role for display
export function formatRoleDisplay(role: string): string {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

// Format badge for display
export function formatBadgeDisplay(badge: string): string {
  return badge
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

// Discord role IDs - only for roles that can be automatically assigned
export const DISCORD_ROLES = {
  // Staff level roles
  JUNIOR_ADMIN: "1209567769826295899", // Using the Senior Staff ID for now
  SENIOR_STAFF: "1209567769826295899",
  STAFF: "1209852842727313438",

  // Basic level roles
  STAFF_IN_TRAINING: "1209852843574693918",
  MEMBER: "1253761018769969244",
  APPLICANT: "1253758031112568832",
}

// Roles that can be automatically assigned through Discord
export const DISCORD_ASSIGNABLE_ROLES = [
  "JUNIOR_ADMIN",
  "SENIOR_STAFF",
  "STAFF",
  "STAFF_IN_TRAINING",
  "MEMBER",
  "APPLICANT",
]

// Map Discord roles to application roles
export function mapDiscordRoleToAppRole(discordRoles: string[]): Role {
  console.log("Mapping Discord roles:", discordRoles)

  // Log all the roles we're checking for
  console.log("Role mapping configuration:")
  for (const [roleName, roleId] of Object.entries(DISCORD_ROLES)) {
    console.log(`- ${formatRoleDisplay(roleName)}: ${roleId}`)
  }

  // Check each role in order of priority (following our hierarchy)
  // Only check roles that can be automatically assigned through Discord
  for (const appRole of ROLE_HIERARCHY) {
    // Skip roles that cannot be assigned through Discord
    if (!DISCORD_ASSIGNABLE_ROLES.includes(appRole)) continue

    // Get the corresponding Discord role ID
    const discordRoleId = DISCORD_ROLES[appRole as keyof typeof DISCORD_ROLES]

    // If we have a Discord role ID for this app role
    if (discordRoleId && discordRoles.includes(discordRoleId)) {
      console.log(`✅ Found ${appRole} role!`)
      return appRole as Role
    }
  }

  console.log("❌ No matching roles found, defaulting to APPLICANT")
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

  // Check if we have the required environment variables
  if (!process.env.DISCORD_BOT_TOKEN) {
    console.error("Missing required environment variable: DISCORD_BOT_TOKEN")
    return []
  }

  if (!process.env.DISCORD_GUILD_ID) {
    console.error("Missing required environment variable: DISCORD_GUILD_ID")
    return []
  }

  console.log(`Using Guild ID: ${process.env.DISCORD_GUILD_ID}`)
  console.log(`Bot token available: ${process.env.DISCORD_BOT_TOKEN ? "Yes" : "No"}`)

  try {
    const url = `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordId}`
    console.log(`Making request to: ${url}`)

    const response = await fetch(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
      cache: "no-store", // Ensure we don't use cached responses
    })

    console.log(`Discord API response status: ${response.status}`)

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

    if (response.status === 404) {
      console.error(`User ${discordId} not found in Discord server`)
      const errorText = await response.text()
      console.error(`Error response: ${errorText}`)
      return []
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
    console.log("Discord API response received")

    if (data.roles && Array.isArray(data.roles)) {
      console.log(`Found ${data.roles.length} roles for user:`, data.roles)
      return data.roles
    } else {
      console.log("No roles found in response or invalid format:", JSON.stringify(data))
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

// Function to check if a role should be preserved during sync
export function shouldPreserveRole(role: string): boolean {
  // Admin roles should never be downgraded by automatic sync
  return ADMIN_ROLES.includes(role)
}
