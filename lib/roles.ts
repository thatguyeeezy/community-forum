// Role hierarchy from highest to lowest
export const ROLE_HIERARCHY = [
    "WEBMASTER",
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
  
  // Group roles by permission level
  export const ADMIN_ROLES = ["WEBMASTER", "HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "ADMIN"]
  export const STAFF_ROLES = ["JUNIOR_ADMIN", "SENIOR_STAFF", "STAFF"]
  export const BASIC_ROLES = ["STAFF_IN_TRAINING", "MEMBER", "APPLICANT"]
  
  // Check if a user has admin permissions
  export function hasAdminPermission(role?: string): boolean {
    return role ? ADMIN_ROLES.includes(role) : false
  }
  
  // Check if a user has staff permissions
  export function hasStaffPermission(role?: string): boolean {
    return role ? ADMIN_ROLES.includes(role) || STAFF_ROLES.includes(role) : false
  }
  
  // Check if a user can assign a specific role
  export function canAssignRole(userRole?: string, targetRole?: string): boolean {
    if (!userRole || !targetRole) return false
  
    // Get the indices in the hierarchy (lower index = higher rank)
    const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole as any)
    const targetRoleIndex = ROLE_HIERARCHY.indexOf(targetRole as any)
  
    // User can only assign roles that are lower in the hierarchy (higher index)
    return userRoleIndex < targetRoleIndex
  }
  
  // Get available roles that a user can assign
  export function getAssignableRoles(userRole?: string): string[] {
    if (!userRole) return []
  
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
  