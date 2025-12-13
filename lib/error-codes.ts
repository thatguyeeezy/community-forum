// Error code system for user-friendly error display
// Users see: simple message + code
// Admins see: full details in admin portal

export interface ErrorCode {
  code: string
  userMessage: string      // What the user sees
  adminMessage: string     // What admins see in the portal
  category: 'AUTH' | 'DISCORD' | 'DATABASE' | 'PERMISSION' | 'SYSTEM'
  severity: 'low' | 'medium' | 'high' | 'critical'
}

// All error codes - add new ones here as needed
export const ERROR_CODES: Record<string, ErrorCode> = {
  // Authentication Errors (AUTH_xxx)
  AUTH_001: {
    code: 'AUTH_001',
    userMessage: 'Unable to sign in. Please try again.',
    adminMessage: 'OAuth callback failed - Discord returned an error during authentication flow',
    category: 'AUTH',
    severity: 'medium',
  },
  AUTH_002: {
    code: 'AUTH_002',
    userMessage: 'This Discord account is not linked to an existing account.',
    adminMessage: 'OAuthAccountNotLinked - User attempted to sign in with Discord but account not linked',
    category: 'AUTH',
    severity: 'low',
  },
  AUTH_003: {
    code: 'AUTH_003',
    userMessage: 'Unable to start sign in. Please try again.',
    adminMessage: 'OAuthSignin failed - Could not initiate Discord OAuth flow',
    category: 'AUTH',
    severity: 'medium',
  },
  AUTH_004: {
    code: 'AUTH_004',
    userMessage: 'Sign in was interrupted. Please try again.',
    adminMessage: 'Authentication callback error - Flow interrupted or invalid state',
    category: 'AUTH',
    severity: 'medium',
  },
  AUTH_005: {
    code: 'AUTH_005',
    userMessage: 'Your session has expired. Please sign in again.',
    adminMessage: 'Session expired or invalid JWT token',
    category: 'AUTH',
    severity: 'low',
  },

  // Discord Errors (DISCORD_xxx)
  DISCORD_001: {
    code: 'DISCORD_001',
    userMessage: 'You must be a member of our Discord server to access this site.',
    adminMessage: 'User not in Discord guild - fetchDiscordRoles returned empty (404 from Discord API)',
    category: 'DISCORD',
    severity: 'low',
  },
  DISCORD_002: {
    code: 'DISCORD_002',
    userMessage: 'Unable to verify your Discord membership. Please try again.',
    adminMessage: 'Discord API error - Failed to fetch guild member data',
    category: 'DISCORD',
    severity: 'high',
  },
  DISCORD_003: {
    code: 'DISCORD_003',
    userMessage: 'Unable to verify your Discord roles. Please try again.',
    adminMessage: 'Discord role sync failed - Could not map Discord roles to application roles',
    category: 'DISCORD',
    severity: 'medium',
  },
  DISCORD_004: {
    code: 'DISCORD_004',
    userMessage: 'Discord is temporarily unavailable. Please try again later.',
    adminMessage: 'Discord API rate limited (429) or service unavailable',
    category: 'DISCORD',
    severity: 'high',
  },

  // Permission Errors (PERM_xxx)
  PERM_001: {
    code: 'PERM_001',
    userMessage: 'You do not have permission to access this page.',
    adminMessage: 'AccessDenied - User attempted to access protected route without required role',
    category: 'PERMISSION',
    severity: 'low',
  },
  PERM_002: {
    code: 'PERM_002',
    userMessage: 'Admin access required.',
    adminMessage: 'User attempted to access admin route without admin role',
    category: 'PERMISSION',
    severity: 'medium',
  },
  PERM_003: {
    code: 'PERM_003',
    userMessage: 'You do not have permission to perform this action.',
    adminMessage: 'Insufficient permissions for requested action',
    category: 'PERMISSION',
    severity: 'medium',
  },

  // Database Errors (DB_xxx)
  DB_001: {
    code: 'DB_001',
    userMessage: 'Something went wrong. Please try again.',
    adminMessage: 'Database connection failed or query error',
    category: 'DATABASE',
    severity: 'critical',
  },
  DB_002: {
    code: 'DB_002',
    userMessage: 'Unable to save your changes. Please try again.',
    adminMessage: 'Database write operation failed',
    category: 'DATABASE',
    severity: 'high',
  },

  // System Errors (SYS_xxx)
  SYS_001: {
    code: 'SYS_001',
    userMessage: 'An unexpected error occurred. Please try again.',
    adminMessage: 'Unhandled exception - check server logs',
    category: 'SYSTEM',
    severity: 'critical',
  },
  SYS_002: {
    code: 'SYS_002',
    userMessage: 'Service temporarily unavailable. Please try again later.',
    adminMessage: 'External service unavailable or timeout',
    category: 'SYSTEM',
    severity: 'high',
  },
}

// Map NextAuth error strings to our error codes
export const NEXTAUTH_ERROR_MAP: Record<string, string> = {
  'OAuthCallback': 'AUTH_001',
  'OAuthAccountNotLinked': 'AUTH_002',
  'OAuthSignin': 'AUTH_003',
  'Callback': 'AUTH_004',
  'SessionRequired': 'AUTH_005',
  'AccessDenied': 'PERM_001',
  // Custom error we throw when user not in guild
  'NotInGuild': 'DISCORD_001',
}

// Get error info by code
export function getErrorByCode(code: string): ErrorCode | null {
  return ERROR_CODES[code] || null
}

// Get error code from NextAuth error string
export function getErrorCodeFromNextAuth(error: string): string {
  return NEXTAUTH_ERROR_MAP[error] || 'SYS_001'
}

// Get user-friendly message from any error
export function getUserErrorMessage(errorOrCode: string): { code: string; message: string } {
  // Check if it's already an error code
  if (ERROR_CODES[errorOrCode]) {
    return {
      code: errorOrCode,
      message: ERROR_CODES[errorOrCode].userMessage,
    }
  }
  
  // Check if it's a NextAuth error string
  const mappedCode = NEXTAUTH_ERROR_MAP[errorOrCode]
  if (mappedCode && ERROR_CODES[mappedCode]) {
    return {
      code: mappedCode,
      message: ERROR_CODES[mappedCode].userMessage,
    }
  }
  
  // Default to system error
  return {
    code: 'SYS_001',
    message: ERROR_CODES['SYS_001'].userMessage,
  }
}

