"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

interface OnboardingData {
  name: string
  bio: string
  department: string
}

export async function completeOnboarding(data: OnboardingData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = Number(session.user.id)
    const { name, bio, department } = data

    console.log(`Completing onboarding for user ${userId} with department ${department}`)

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio: bio || null,
        department,
        needsOnboarding: false,
        role: "MEMBER",
      },
    })

    console.log(`Updated user ${userId}: needsOnboarding=${updatedUser.needsOnboarding}, role=${updatedUser.role}`)

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error completing onboarding:", error)
    return { success: false, error: "Failed to complete onboarding" }
  }
}
