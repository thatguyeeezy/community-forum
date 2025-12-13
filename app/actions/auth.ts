'use server'

// Discord-only authentication - no password registration needed
// All user creation is handled through Discord OAuth

export async function getAuthStatus() {
  // Placeholder for any future auth-related server actions
  return { authenticated: false }
}
