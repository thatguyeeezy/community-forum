"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

interface OnboardingData {
  name: string
  bio: string
  department: string
  // Explicitly NOT including discordId here
}

export async function completeOnboarding(data: OnboardingData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = session.user.id
    const { name, bio, department } = data

    // No discordId in data, so it can't be changed

    // Update the user in the database
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio: bio || null,
        department,
        needsOnboarding: false,
        // If the user is from the Main Discord, they should get a MEMBER role
        role: "MEMBER",
        // Explicitly NOT including discordId in the update
      },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error completing onboarding:", error)
    return { success: false, error: "Failed to complete onboarding" }
  }
}
