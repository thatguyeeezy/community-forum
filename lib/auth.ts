import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import DiscordProvider from "next-auth/providers/discord"
import { prisma } from "@/lib/prisma"

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
      authorization: { params: { scope: "identify email" } },
      callbackUrl: "http://198.154.99.127:3000/auth/discord/callback",
      profile(profile) {
        console.log("Discord profile received:", profile)
        return {
          id: profile.id,
          name: profile.username,
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
          await prisma.user.update({
            where: {
              id: Number.parseInt(user.id as string, 10),
            },
            data: {
              discordId: profile.id as string,
              department: "N_A",
            },
          })

          console.log("Updated user with Discord ID from profile:", profile.id)

          // As a backup, also check the accounts table
          setTimeout(async () => {
            try {
              const discordAccount = await prisma.account.findFirst({
                where: {
                  provider: "discord",
                  userId: Number.parseInt(user.id as string, 10),
                },
              })

              if (discordAccount) {
                console.log("Found Discord account in accounts table:", discordAccount.providerAccountId)

                // Double-check that the user has the Discord ID set
                await prisma.user.update({
                  where: {
                    id: Number.parseInt(user.id as string, 10),
                  },
                  data: {
                    discordId: discordAccount.providerAccountId,
                  },
                })

                console.log("Updated user with Discord ID from accounts table")
              }
            } catch (error) {
              console.error("Error in delayed Discord ID update:", error)
            }
          }, 2000)
        } catch (error) {
          console.error("Error updating Discord ID during sign-in:", error)
        }
      }
      return true
    },

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

