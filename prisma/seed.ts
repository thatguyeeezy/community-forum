import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting to seed categories...")

  try {
    // First, check if the Category table exists and has the parentId column
    let hasParentIdColumn = true
    try {
      // Try to query a category with parentId to see if the column exists
      await prisma.$queryRaw`SELECT parentId FROM Category LIMIT 1`
    } catch (error) {
      console.log("parentId column might not exist yet, will create categories without parent references first")
      hasParentIdColumn = false
    }

    // Create main categories
    const announcements = await prisma.category.upsert({
      where: { slug: "announcements" },
      update: {},
      create: {
        name: "Community Announcements",
        description: "Official announcements from the team",
        slug: "announcements",
        order: 1,
      },
    })
    console.log("Created category:", announcements.name)

    // Create Recruitment category
    const recruitment = await prisma.category.upsert({
      where: { slug: "recruitment" },
      update: {},
      create: {
        name: "Recruitment and Retention",
        description: "Information about joining and staying with us",
        slug: "recruitment",
        order: 2,
      },
    })
    console.log("Created category:", recruitment.name)

    // Create General Discussion category
    const general = await prisma.category.upsert({
      where: { slug: "general" },
      update: {},
      create: {
        name: "General Discussion",
        description: "General topics and community discussions",
        slug: "general",
        order: 3,
      },
    })
    console.log("Created category:", general.name)

    // If parentId column exists, create subcategories
    if (hasParentIdColumn) {
      // Create subcategories for Announcements
      const updates = await prisma.category.upsert({
        where: { slug: "updates" },
        update: {
          parentId: announcements.id,
        },
        create: {
          name: "Latest Updates",
          description: "Recent updates and news",
          slug: "updates",
          order: 1,
          parentId: announcements.id,
        },
      })
      console.log("Created subcategory:", updates.name)

      const changelogs = await prisma.category.upsert({
        where: { slug: "changelogs" },
        update: {
          parentId: announcements.id,
        },
        create: {
          name: "Server Changelogs",
          description: "Detailed server update logs",
          slug: "changelogs",
          order: 2,
          parentId: announcements.id,
        },
      })
      console.log("Created subcategory:", changelogs.name)

      // Create subcategories for Recruitment
      const recruitmentAnnouncements = await prisma.category.upsert({
        where: { slug: "recruitment-announcements" },
        update: {
          parentId: recruitment.id,
        },
        create: {
          name: "Announcements",
          description: "Recruitment announcements",
          slug: "recruitment-announcements",
          order: 1,
          parentId: recruitment.id,
        },
      })
      console.log("Created subcategory:", recruitmentAnnouncements.name)

      const recruitmentInfo = await prisma.category.upsert({
        where: { slug: "recruitment-info" },
        update: {
          parentId: recruitment.id,
        },
        create: {
          name: "Important Info",
          description: "Essential information for applicants",
          slug: "recruitment-info",
          order: 2,
          parentId: recruitment.id,
        },
      })
      console.log("Created subcategory:", recruitmentInfo.name)

      // Create subcategories for General Discussion
      const chat = await prisma.category.upsert({
        where: { slug: "chat" },
        update: {
          parentId: general.id,
        },
        create: {
          name: "Community Chat",
          description: "General chat about anything and everything",
          slug: "chat",
          order: 1,
          parentId: general.id,
        },
      })
      console.log("Created subcategory:", chat.name)

      const introductions = await prisma.category.upsert({
        where: { slug: "introductions" },
        update: {
          parentId: general.id,
        },
        create: {
          name: "Introductions",
          description: "Introduce yourself to the community",
          slug: "introductions",
          order: 2,
          parentId: general.id,
        },
      })
      console.log("Created subcategory:", introductions.name)
    } else {
      console.log("Skipping subcategory creation due to missing parentId column")
      console.log("Run migrations first, then run seed again to create subcategories")
    }

    // Create departments
    const departments = [
      {
        name: "CIV – Civilian",
        description: "Civilian operations and roleplay",
        subdivisions: ["Businesses", "Criminal Organizations", "Civilian Jobs"],
      },
      {
        name: "FHP – Florida Highway Patrol",
        description: "State law enforcement agency",
        subdivisions: ["Patrol Division", "Special Operations", "Training Division"],
      },
      {
        name: "MPD – Miami Police Department",
        description: "City police department",
        subdivisions: ["Patrol", "Investigations", "Special Units"],
      },
      {
        name: "BSO – Broward Sheriff's Office",
        description: "County law enforcement agency",
        subdivisions: ["Patrol", "Corrections", "Special Units"],
      },
      {
        name: "FWC – Florida Fish and Wildlife Conservation Commission",
        description: "Wildlife and environmental protection",
        subdivisions: ["Marine Patrol", "Wildlife Conservation", "Environmental Protection"],
      },
      {
        name: "USCG – United States Coast Guard",
        description: "Maritime law enforcement and rescue",
        subdivisions: ["Maritime Law Enforcement", "Search and Rescue", "Port Security"],
      },
      {
        name: "USMS – United States Marshals Service",
        description: "Federal law enforcement agency",
        subdivisions: ["Fugitive Task Force", "Judicial Security", "Prisoner Operations"],
      },
      {
        name: "BCFR – Broward County Fire Rescue",
        description: "Fire and emergency medical services",
        subdivisions: ["Fire Suppression", "EMS", "Special Operations"],
      },
    ]

    for (const dept of departments) {
      // First, check if the department already exists
      let department = await prisma.departmentInfo.findUnique({
        where: { name: dept.name },
      })

      // If it doesn't exist, create it
      if (!department) {
        department = await prisma.departmentInfo.create({
          data: {
            name: dept.name,
            description: dept.description,
          },
        })
        console.log("Created department:", department.name)
      } else {
        console.log("Department already exists:", department.name)
      }

      // Create subdivisions for this department
      for (const subName of dept.subdivisions) {
        // Check if the subdivision already exists
        const existingSubdivision = await prisma.subdivisionInfo.findFirst({
          where: {
            name: subName,
            departmentId: department.id,
          },
        })

        // If it doesn't exist, create it
        if (!existingSubdivision) {
          const subdivision = await prisma.subdivisionInfo.create({
            data: {
              name: subName,
              description: `${subName} subdivision of ${department.name}`,
              departmentId: department.id,
            },
          })
          console.log("Created subdivision:", subdivision.name)
        } else {
          console.log("Subdivision already exists:", subName)
        }
      }
    }

    console.log("Seeding completed!")
  } catch (error) {
    console.error("Error during seeding:", error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

