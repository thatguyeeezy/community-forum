import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasRnRPermission } from "@/lib/roles"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const applicationId = Number.parseInt(params.id, 10)

    if (isNaN(applicationId)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 })
    }

    // Get the user ID from the session
    const userId = Number.parseInt(session.user.id as string, 10)

    // Check if the user has RNR permissions
    const hasRnRAccess = hasRnRPermission(session.user.role as string)

    // Construct the query based on permissions
    let application

    if (hasRnRAccess) {
      // RNR staff can view any application with full details
      application = await prisma.application.findUnique({
        where: {
          id: applicationId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              discordId: true,
            },
          },
          template: true,
          reviewer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          notes: {
            include: {
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          responses: {
            include: {
              question: true,
            },
          },
        },
      })
    } else {
      // Regular users can only view their own applications with limited details
      application = await prisma.application.findFirst({
        where: {
          id: applicationId,
          userId,
        },
        include: {
          template: true,
          reviewer: {
            select: {
              name: true,
              image: true,
            },
          },
          notes: {
            where: {
              // Only include notes that should be visible to the applicant
              // You could add a field to notes to control visibility if needed
            },
            include: {
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      })
    }

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or you don't have permission to view it" },
        { status: 404 },
      )
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}
