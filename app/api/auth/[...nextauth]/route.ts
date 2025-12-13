import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Use the centralized auth configuration from lib/auth.ts
// This ensures consistent Discord-only authentication across the app
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
