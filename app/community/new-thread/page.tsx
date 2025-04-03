import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CreateThreadForm } from "@/components/create-thread-form"

// Function to check if user can create threads in a category
function canCreateInCategory(categoryId: string, userRole?: string, userDepartment?: string) {
  // Community Announcements - only SENIOR_ADMIN and HEAD_ADMIN
  if (categoryId === "announcements") {
    return userRole === "SENIOR_ADMIN" || userRole === "HEAD_ADMIN"
  }

  // Recruitment and Retention - only RNR_ADMINISTRATION and RNR_STAFF
  if (categoryId === "recruitment") {
    return userDepartment === "RNR_ADMINISTRATION" || userDepartment === "RNR_STAFF"
  }

  // General Discussions - any authenticated user (APPLICANT+)
  return !!userRole
}

export default async function NewThreadPage() {
  const session = await getServerSession(authOptions)

  // Redirect if not logged in
  if (!session) {
    redirect("/auth/signin?callbackUrl=/community/new-thread")
  }

  // Fetch categories from the database
  const allCategories = await prisma.category.findMany({
    orderBy: {
      order: "asc",
    },
  })

  // Filter categories based on user permissions
  const allowedCategories = allCategories.filter((category) =>
    canCreateInCategory(
      category.id,
      session.user.role as string,
      // @ts-ignore - department is added to session in auth.ts
      session.user.department as string,
    ),
  )

  // Format categories for the form
  const categories = allowedCategories.map((category) => ({
    id: category.id,
    name: category.name,
  }))

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Thread</h1>
      <CreateThreadForm categories={categories} />
    </div>
  )
}

