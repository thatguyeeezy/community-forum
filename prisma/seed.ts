import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting to seed categories...")

  try {
    // Create main categories first
    console.log("Creating main categories...")

    // Community Announcements
    const announcements = await prisma.category.create({
      data: {
        name: "Community Announcements",
        description: "Official announcements from the team",
        slug: "announcements",
        order: 1,
      },
    })
    console.log("Created category:", announcements.name, "with ID:", announcements.id)

    // Recruitment and Retention
    const recruitment = await prisma.category.create({
      data: {
        name: "Recruitment and Retention",
        description: "Information about joining and staying with us",
        slug: "recruitment",
        order: 2,
      },
    })
    console.log("Created category:", recruitment.name, "with ID:", recruitment.id)

    // General Discussion
    const general = await prisma.category.create({
      data: {
        name: "General Discussion",
        description: "General topics and community discussions",
        slug: "general",
        order: 3,
      },
    })
    console.log("Created category:", general.name, "with ID:", general.id)

    // Create subcategories using parent IDs
    console.log("Creating subcategories...")

    // Subcategories for Announcements
    await prisma.category.create({
      data: {
        name: "Latest Updates",
        description: "Recent updates and news",
        slug: "updates",
        order: 1,
        parentId: announcements.id,
      },
    })
    console.log("Created subcategory: Latest Updates")

    await prisma.category.create({
      data: {
        name: "Server Changelogs",
        description: "Detailed server update logs",
        slug: "changelogs",
        order: 2,
        parentId: announcements.id,
      },
    })
    console.log("Created subcategory: Server Changelogs")

    // Subcategories for Recruitment
    await prisma.category.create({
      data: {
        name: "Announcements",
        description: "Recruitment announcements",
        slug: "recruitment-announcements",
        order: 1,
        parentId: recruitment.id,
      },
    })
    console.log("Created subcategory: Recruitment Announcements")

    await prisma.category.create({
      data: {
        name: "Important Info",
        description: "Essential information for applicants",
        slug: "recruitment-info",
        order: 2,
        parentId: recruitment.id,
      },
    })
    console.log("Created subcategory: Important Info")

    // Subcategories for General Discussion
    await prisma.category.create({
      data: {
        name: "Community Chat",
        description: "General chat about anything and everything",
        slug: "chat",
        order: 1,
        parentId: general.id,
      },
    })
    console.log("Created subcategory: Community Chat")

    await prisma.category.create({
      data: {
        name: "Introductions",
        description: "Introduce yourself to the community",
        slug: "introductions",
        order: 2,
        parentId: general.id,
      },
    })
    console.log("Created subcategory: Introductions")

    // Create departments
    console.log("Creating departments...")
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
      // Create the department
      const department = await prisma.departmentInfo.create({
        data: {
          name: dept.name,
          description: dept.description,
        },
      })
      console.log("Created department:", department.name, "with ID:", department.id)

      // Create subdivisions for this department
      for (const subName of dept.subdivisions) {
        const subdivision = await prisma.subdivisionInfo.create({
          data: {
            name: subName,
            description: `${subName} subdivision of ${department.name}`,
            departmentId: department.id,
          },
        })
        console.log("Created subdivision:", subdivision.name, "for department:", department.name)
      }
    }

    console.log("Seeding completed successfully!")
  } catch (error) {
    console.error("Error during seeding:", error)
    throw error // Re-throw to ensure the process exits with an error code
  }
}

main()
  .catch((e) => {
    console.error("Fatal error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

