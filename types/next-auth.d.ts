import type { Role } from "@prisma/client"

declare module "next-auth" {
  interface User {
    id: string | number
    role?: Role
  }

  interface Session {
    user: {
      id: number
      name?: string | null
      email?: string | null
      image?: string | null
      role?: Role
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role
  }
}

