import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import { isUserInMainDiscord, getUserDepartmentsFromMainDiscord } from "@/lib/main-discord"

// Export the authOptions for use in other files
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: { params: { scope: "identify email" } },
      profile(profile) {
        if (profile.id) {
          return {
            id: profile.id,
            name: profile.global_name || profile.username,
            email: profile.email,
            image: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
            role: "APPLICANT",
          }
        }

        return {
          id: profile.user?.id || profile.sub || "discord-user",
          name: profile.global_name || profile.username || profile.user?.username,
          email: profile.email || profile.user?.email,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id || profile.user?.id}/${profile.avatar || profile.user?.avatar}.png`
            : null,
          role: "APPLICANT",
        }
      },
    }),
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id.toString(), // Convert to string for NextAuth
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = Number.parseInt(token.sub || "0") // Parse the ID as an integer
        session.user.role = token.role || "MEMBER"

        // Pass through the onboarding flags
        if (token.needsOnboarding) {
          session.user.needsOnboarding = token.needsOnboarding as boolean
        }

        if (token.isInMainDiscord) {
          session.user.isInMainDiscord = token.isInMainDiscord as boolean
        }

        if (token.mainDiscordDepartments) {
          session.user.mainDiscordDepartments = token.mainDiscordDepartments as string[]
        }
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = user.role || "MEMBER"
      }

      // If this is a new sign-in with Discord
      if (account?.provider === "discord" && profile) {
        // Check if user exists in database
        const existingUser = await prisma.user.findUnique({
          where: { discordId: profile.id as string },
        })

        // If this is a new user or first sign-in
        if (!existingUser) {
          // Check if user is in Main Discord
          const isInMainDiscord = await isUserInMainDiscord(profile.id as string)

          if (isInMainDiscord) {
            token.needsOnboarding = true
            token.isInMainDiscord = true

            // Get departments from Main Discord
            const departments = await getUserDepartmentsFromMainDiscord(profile.id as string)
            if (departments.length > 0) {
              token.mainDiscordDepartments = departments
            }
          }
        }
      }

      return token
    },
    async signIn({ user, account, profile }) {
      // Always allow Discord sign-ins
      if (account?.provider === "discord") {
        return true
      }

      // For credentials (admin), check if the user has admin role
      if (account?.provider === "credentials") {
        const dbUser = await prisma.user.findUnique({
          where: { id: Number.parseInt(user.id) },
          select: { role: true },
        })

        return dbUser?.role === "ADMIN" || dbUser?.role === "MODERATOR"
      }

      return false
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
