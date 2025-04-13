import type { Role, Department } from "@prisma/client"

declare module "next-auth" {
  interface User {
    id: string | number
    role?: Role
  }

  interface Session {
    user: {
      id: number
      name: string
      email: string
      image: string
      role: Role
      badges?: string[]
      discordId?: string
      department?: Department
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role
  }
}
