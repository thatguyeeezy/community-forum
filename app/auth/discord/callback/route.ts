import { authOptions } from "@/lib/auth"
import NextAuth from "next-auth"

// This route will handle the Discord OAuth callback
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

