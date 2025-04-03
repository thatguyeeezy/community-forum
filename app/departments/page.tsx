import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Department } from "@prisma/client"
import Link from "next/link"

export default async function DepartmentsPage() {
  const departments = Object.values(Department).filter(dept => dept !== "N_A")

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Departments</h1>
            <p className="text-muted-foreground">Explore our various departments and find your place in the community.</p>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <Link key={department} href={`/departments/${department.toLowerCase()}`}>
              <Card className="hover:bg-accent transition-colors">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl">{getDepartmentName(department)}</h3>
                    <p className="text-muted-foreground">
                      {getDepartmentDescription(department)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function getDepartmentName(department: Department): string {
  switch (department) {
    case "BSFR":
      return "Bureau of State Fire Rescue"
    case "BSO":
      return "Broward Sheriff's Office"
    case "MPD":
      return "Miami Police Department"
    case "FHP":
      return "Florida Highway Patrol"
    case "COMMS":
      return "Communications Department"
    case "FWC":
      return "Florida Fish and Wildlife Conservation"
    case "CIV":
      return "Civilian Operations"
    case "FDLE":
      return "Florida Department of Law Enforcement"
    case "DEV":
      return "Development Team"
    case "RNR":
      return "Research and Response"
    case "LEADERSHIP":
      return "Leadership Team"
    default:
      return department
  }
}

function getDepartmentDescription(department: Department): string {
  switch (department) {
    case "BSFR":
      return "Dedicated to fire prevention, suppression, and emergency medical services."
    case "BSO":
      return "Serving and protecting the residents of Broward County."
    case "MPD":
      return "Maintaining law and order in the city of Miami."
    case "FHP":
      return "Ensuring safe travel on Florida's highways."
    case "COMMS":
      return "Managing communications and dispatch operations."
    case "FWC":
      return "Protecting Florida's fish and wildlife resources."
    case "CIV":
      return "Supporting civilian operations and community engagement."
    case "FDLE":
      return "Statewide law enforcement and criminal investigations."
    case "DEV":
      return "Developing and maintaining community resources."
    case "RNR":
      return "Research and development for community improvements."
    case "LEADERSHIP":
      return "Guiding and managing the community's direction."
    default:
      return "Department information coming soon."
  }
} 