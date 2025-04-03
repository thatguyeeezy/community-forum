"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  order: z.number().default(0),
  parentId: z.number().optional(),
})

const updateCategorySchema = createCategorySchema.partial()

export async function createCategory(formData: FormData) {
  try {
    // 1. Get session for auth check
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return { error: "Authentication required" }
    }

    // 2. Validate user role
    if (!["HEAD_ADMIN", "SENIOR_ADMIN", "ADMIN"].includes(session.user.role)) {
      return { error: "Insufficient permissions" }
    }

    // 3. Extract and validate data
    const data = {
      name: formData.get("name")?.toString() ?? "",
      description: formData.get("description")?.toString(),
      slug: formData.get("slug")?.toString() ?? "",
      order: Number(formData.get("order") || 0),
      parentId: formData.get("parentId") ? Number(formData.get("parentId")) : undefined,
    }

    const validatedData = createCategorySchema.parse(data)

    // 4. Perform database operation
    const category = await prisma.category.create({
      data: validatedData,
    })

    // 5. Revalidate affected paths
    revalidatePath("/community")
    revalidatePath("/admin/categories")

    return { success: true, category }
  } catch (error) {
    console.error("Create category error:", error)
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to create category" }
  }
}

export async function updateCategory(id: number, formData: FormData) {
  try {
    // 1. Get session for auth check
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return { error: "Authentication required" }
    }

    // 2. Validate user role
    if (!["HEAD_ADMIN", "SENIOR_ADMIN", "ADMIN"].includes(session.user.role)) {
      return { error: "Insufficient permissions" }
    }

    // 3. Extract and validate data
    const data = {
      name: formData.get("name")?.toString(),
      description: formData.get("description")?.toString(),
      slug: formData.get("slug")?.toString(),
      order: formData.get("order") ? Number(formData.get("order")) : undefined,
      parentId: formData.get("parentId") ? Number(formData.get("parentId")) : undefined,
    }

    const validatedData = updateCategorySchema.parse(data)

    // 4. Perform database operation
    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
    })

    // 5. Revalidate affected paths
    revalidatePath("/community")
    revalidatePath("/admin/categories")
    revalidatePath(`/community/${category.slug}`)

    return { success: true, category }
  } catch (error) {
    console.error("Update category error:", error)
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to update category" }
  }
}

export async function deleteCategory(id: number) {
  try {
    // 1. Get session for auth check
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return { error: "Authentication required" }
    }

    // 2. Validate user role
    if (!["HEAD_ADMIN", "SENIOR_ADMIN"].includes(session.user.role)) {
      return { error: "Insufficient permissions" }
    }

    // 3. Perform database operation
    await prisma.category.delete({
      where: { id },
    })

    // 4. Revalidate affected paths
    revalidatePath("/community")
    revalidatePath("/admin/categories")

    return { success: true }
  } catch (error) {
    console.error("Delete category error:", error)
    return { error: "Failed to delete category" }
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            threads: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    })

    return categories.map((category) => ({
      ...category,
      postCount: 0, // Simplified for now
    }))
  } catch (error) {
    console.error("Get categories error:", error)
    return []
  }
} 