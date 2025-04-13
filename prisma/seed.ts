import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting to seed categories...")

  // Create main categories
  const announcements = await prisma.category.upsert({
    where: { id: 1 },
    update: {
      name: "Community Announcements",
      slug: "community-announcements",
      description: "Official announcements from the community team",
      order: 1,
    },
    create: {
      id: 1,
      name: "Community Announcements",
      slug: "community-announcements",
      description: "Official announcements from the community team",
      order: 1,
    },
  })

  const recruitment = await prisma.category.upsert({
    where: { id: 2 },
    update: {
      name: "Recruitment & Retention",
      slug: "recruitment-retention",
      description: "Announcements from the Recruitment & Retention team",
      order: 2,
    },
    create: {
      id: 2,
      name: "Recruitment & Retention",
      slug: "recruitment-retention",
      description: "Announcements from the Recruitment & Retention team",
      order: 2,
    },
  })

  console.log("Seeded categories:", { announcements, recruitment })

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
  \
}
catch (error)
{
  \
    console.error("Error during seeding:", error)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
