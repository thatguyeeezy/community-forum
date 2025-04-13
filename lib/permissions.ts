// Helper function to check if a user has webmaster privileges
export function isWebmaster(userRole?: string): boolean {
    return userRole === "WEBMASTER"
  }
  
  // Helper function to check if a user has admin privileges (including webmaster)
  export function isAdmin(userRole?: string): boolean {
    return (
      userRole === "ADMIN" ||
      userRole === "SENIOR_ADMIN" ||
      userRole === "HEAD_ADMIN" ||
      userRole === "SPECIAL_ADVISOR" ||
      isWebmaster(userRole)
    )
  }
  
  // Helper function to check if a user has staff privileges
  export function isStaff(userRole?: string): boolean {
    return (
      userRole === "STAFF" ||
      userRole === "SENIOR_STAFF" ||
      userRole === "STAFF_IN_TRAINING" ||
      userRole === "JUNIOR_ADMIN" ||
      isAdmin(userRole)
    )
  }
  
  // Helper function to check if a user has any member privileges
  export function isMember(userRole?: string): boolean {
    return userRole === "MEMBER" || userRole === "APPLICANT" || isStaff(userRole)
  }
  