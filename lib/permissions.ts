// Helper function to check if a user has the webmaster role
export function isWebmaster(userRole?: string): boolean {
    return userRole === "WEBMASTER"
  }
  
  // Helper function to check if a user has the highest admin privileges
  export function isHeadAdmin(userRole?: string): boolean {
    return userRole === "HEAD_ADMIN" || isWebmaster(userRole)
  }
  
  // Helper function to check if a user has senior admin privileges
  export function isSeniorAdmin(userRole?: string): boolean {
    return userRole === "SENIOR_ADMIN" || userRole === "SPECIAL_ADVISOR" || isHeadAdmin(userRole)
  }
  
  // Helper function to check if a user has admin privileges
  export function isAdmin(userRole?: string): boolean {
    return userRole === "ADMIN" || isSeniorAdmin(userRole)
  }
  
  // Helper function to check if a user has junior admin privileges
  export function isJuniorAdmin(userRole?: string): boolean {
    return userRole === "JUNIOR_ADMIN" || isAdmin(userRole)
  }
  
  // Helper function to check if a user has staff privileges
  export function isStaff(userRole?: string): boolean {
    return userRole === "STAFF" || userRole === "SENIOR_STAFF" || userRole === "STAFF_IN_TRAINING" || isJuniorAdmin(userRole)
  }
  
  // Helper function to check if a user has any member privileges
  export function isMember(userRole?: string): boolean {
    return userRole === "MEMBER" || userRole === "APPLICANT" || userRole === "RECRUIT" || userRole === "GUEST" || isStaff(userRole)
  }
  