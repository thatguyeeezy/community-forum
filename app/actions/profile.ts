// app/actions/profile.ts
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function updateProfile(formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    return { error: "You must be logged in to update your profile" }
  }

  const name = formData.get("name") as string
  const bio = formData.get("bio") as string
  const rank = formData.get("rank") as string
  const department = formData.get("department") as string
  const discordId = formData.get("discordId") as string
  const imageFile = formData.get("profileImage") as File | null

  if (!name) {
    return { error: "Name is required" }
  }

  try {
    const userId = typeof session.user.id === "string" ? Number.parseInt(session.user.id, 10) : session.user.id

    // Prepare update data
    const updateData: any = {
      name,
      bio: bio || "",
      rank: rank || null,
      department: department ? (department as any) : "N_A", // Cast to any to handle enum
      // Don't update discordId here as it should only be set via OAuth
    }

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      // In a real-world scenario, you would upload the image to a service like S3 or Cloudinary
      // For now, we'll just use a placeholder or the existing image
      // This is where you would add your image upload logic

      // Example placeholder - replace with actual image upload logic
      updateData.image = session.user.image || "/placeholder.svg"

      // Note: In a real implementation, you would:
      // 1. Upload the image to a storage service
      // 2. Get the URL of the uploaded image
      // 3. Set updateData.image to that URL
    }

    console.log("Updating profile for user:", userId, {
      ...updateData,
      imageUpdated: imageFile ? true : false,
    }) // Debug log

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    revalidatePath(`/profile/${userId}`)
    revalidatePath(`/members/${userId}`)
    return {
      success: true,
      message: "Profile updated successfully",
      imageUrl: updatedUser.image,
    }
  } catch (error) {
    console.error("Profile update error:", error)
    return { error: "Failed to update profile" }
  }
}

export async function followUser(userId: string) {
  const session = await auth()

  if (!session?.user) {
    return { error: "You must be logged in to follow users" }
  }

  if (session.user.id === userId) {
    return { error: "You cannot follow yourself" }
  }

  try {
    // Convert the user IDs to numbers
    const followerId = typeof session.user.id === "string" ? Number.parseInt(session.user.id, 10) : session.user.id

    const followingId = Number.parseInt(userId, 10)

    // Check if already following
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId,
        followingId,
      },
    })

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      })

      revalidatePath(`/members/${userId}`)
      return { success: true, followed: false, message: "User unfollowed" }
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      })

      // Create notification
      await prisma.notification.create({
        data: {
          type: "follow",
          message: `${session.user.name} started following you`,
          recipientId: followingId,
          link: `/members/${followerId}`,
        },
      })

      revalidatePath(`/members/${userId}`)
      return { success: true, followed: true, message: "User followed" }
    }
  } catch (error) {
    console.error("Follow error:", error)
    return { error: "Failed to follow/unfollow user" }
  }
}
