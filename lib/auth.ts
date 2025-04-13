import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import DiscordProvider from "next-auth/providers/discord"
import { prisma } from "@/lib/prisma"
// Import the new Discord roles utility at the top of the file
import { syncUserRoleFromDiscord } from "@/lib/discord-roles"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: { params: { scope: "identify email guilds" } }, // Added guilds scope
      callbackUrl: "http://198.154.99.127:3000/auth/discord/callback",
      profile(profile) {
        console.log("Discord profile received:", profile)
        return {
          id: profile.id,
          name: profile.username || profile.global_name,
          email: profile.email,
          image: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
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
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord" && profile) {
        try {
          console.log("Discord sign-in for user ID:", user.id)

          // First, update the user with the Discord ID directly from the profile
          const userId = Number.parseInt(user.id as string, 10)
          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              discordId: profile.id as string,
              department: "N_A",
            },
          })

          console.log("Updated user with Discord ID from profile:", profile.id)

          // Sync the user's role based on their Discord roles
          const discordId = profile.id as string
          console.log("Attempting to sync roles for Discord ID:", discordId)

          const syncedRole = await syncUserRoleFromDiscord(discordId)
          console.log("Role sync result:", syncedRole)

          if (syncedRole) {
            // Check current role before updating
            const currentUser = await prisma.user.findUnique({
              where: { id: userId },
              select: { role: true },
            })

            // Only update if current role is below JUNIOR_ADMIN
            const adminRoles = ["HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "ADMIN", "JUNIOR_ADMIN"]
            if (currentUser && !adminRoles.includes(currentUser.role)) {
              await prisma.user.update({
                where: { id: userId },
                data: { role: syncedRole },
              })
              console.log(`Updated user role to ${syncedRole} based on Discord roles`)
            } else {
              console.log(`User has admin role (${currentUser?.role}), not downgrading to ${syncedRole}`)
            }
          } else {
            console.log("No role sync result, keeping current role")
          }
        } catch (error) {
          console.error("Error updating Discord ID during sign-in:", error)
        }
      }
      return true
    },

    // Rest of the callbacks remain the same
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.role = token.role as string

        // If we have a Discord ID in the token, add it to the session
        if (token.discordId) {
          // @ts-ignore
          session.user.discordId = token.discordId as string
        }

        // Fetch additional user data including discordId
        try {
          const userId = Number.parseInt(token.sub, 10)
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { discordId: true, department: true, role: true },
          })

          if (user) {
            // If the user has a Discord ID in the database, use that
            if (user.discordId) {
              // @ts-ignore
              session.user.discordId = user.discordId
            }

            // @ts-ignore
            session.user.department = user.department

            // Make sure role is up to date
            session.user.role = user.role

            console.log("Session updated with user data:", {
              discordId: user.discordId,
              department: user.department,
              role: user.role,
            })

            // If we still don't have a Discord ID but there's one in the accounts table, update the user
            if (!user.discordId) {
              const discordAccount = await prisma.account.findFirst({
                where: {
                  provider: "discord",
                  userId: userId,
                },
              })

              if (discordAccount) {
                console.log("Found Discord account but user doesn't have Discord ID. Updating...")

                await prisma.user.update({
                  where: { id: userId },
                  data: {
                    discordId: discordAccount.providerAccountId,
                  },
                })

                // @ts-ignore
                session.user.discordId = discordAccount.providerAccountId

                console.log("Updated user and session with Discord ID from accounts table")
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user data for session:", error)
        }
      }
      return session
    },

    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        // If this is a Discord sign-in, add the discordId to the token
        if (account.provider === "discord" && profile) {
          token.discordId = profile.id
          console.log("Added Discord ID to JWT token:", profile.id)
        }

        token.role = user.role
      }
      return token
    },
  },

  // Events remain the same
  events: {
    async createUser(message) {
      // This event is triggered when a new user is created
      const { user } = message
      console.log("New user created:", user.id, user.email)

      // If this user was created via Discord OAuth, they should have a discordId
      // But let's make sure it's set correctly
      if (user.email) {
        try {
          // Wait a moment for the account to be created
          setTimeout(async () => {
            try {
              // Check if this user has a Discord account
              const discordUser = await prisma.account.findFirst({
                where: {
                  userId: user.id,
                  provider: "discord",
                },
              })

              if (discordUser) {
                console.log("Found Discord account for new user:", discordUser.providerAccountId)

                // Update the user with the Discord ID
                await prisma.user.update({
                  where: { id: user.id },
                  data: {
                    discordId: discordUser.providerAccountId,
                    department: "N_A",
                    role: "APPLICANT",
                  },
                })

                console.log("Updated new user with Discord ID and set as APPLICANT")

                // Try to sync roles immediately for new users
                try {
                  const syncedRole = await syncUserRoleFromDiscord(discordUser.providerAccountId)
                  if (syncedRole) {
                    await prisma.user.update({
                      where: { id: user.id },
                      data: { role: syncedRole },
                    })
                    console.log(`Updated new user role to ${syncedRole} based on Discord roles`)
                  }
                } catch (syncError) {
                  console.error("Error syncing roles for new user:", syncError)
                }
              }
            } catch (error) {
              console.error("Error in delayed createUser processing:", error)
            }
          }, 2000)
        } catch (error) {
          console.error("Error in createUser event:", error)
        }
      }
    },

    async linkAccount({ user, account, profile }) {
      // This event is triggered when an account is linked to a user
      if (account.provider === "discord" && profile) {
        console.log("Account linked:", user.id, account.provider, account.providerAccountId)

        try {
          // Update the user with the Discord ID
          await prisma.user.update({
            where: { id: user.id },
            data: {
              discordId: account.providerAccountId,
            },
          })

          console.log("Updated user with Discord ID from linkAccount event")

          // Try to sync roles when account is linked
          try {
            const syncedRole = await syncUserRoleFromDiscord(account.providerAccountId)
            if (syncedRole) {
              // Check current role before updating
              const currentUser = await prisma.user.findUnique({
                where: { id: user.id },
                select: { role: true },
              })

              // Only update if current role is below JUNIOR_ADMIN
              const adminRoles = ["HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "ADMIN", "JUNIOR_ADMIN"]
              if (currentUser && !adminRoles.includes(currentUser.role)) {
                await prisma.user.update({
                  where: { id: user.id },
                  data: { role: syncedRole },
                })
                console.log(`Updated user role to ${syncedRole} from linkAccount event`)
              }
            }
          } catch (syncError) {
            console.error("Error syncing roles in linkAccount event:", syncError)
          }
        } catch (error) {
          console.error("Error updating Discord ID in linkAccount event:", error)
        }
      }
    },
  },
}

export async function auth() {
  return await getServerSession(authOptions)
}
