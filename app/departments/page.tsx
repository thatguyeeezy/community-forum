import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Flame, Fish, Radio, Users } from "lucide-react"
import Link from "next/link"

// Department data with appropriate icons
const departments = [
  {
    id: "bsfr",
    name: "BSFR – Broward Sheriff Fire Rescue",
    description: "County Fire and Emergency Medical Services",
    icon: Flame,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  {
    id: "bso",
    name: "BSO – Broward Sheriff's Office",
    description: "County law enforcement agency",
    icon: Shield,
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  },
  {
    id: "mpd",
    name: "MPD – Miami Police Department",
    description: "City police department",
    icon: Shield,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    id: "fhp",
    name: "FHP – Florida Highway Patrol",
    description: "State law enforcement agency",
    icon: Shield,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  {
    id: "comms",
    name: "COMMS – Communications",
    description: "Emergency communications center",
    icon: Radio,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    id: "fwc",
    name: "FWC – Florida Fish and Wildlife Conservation",
    description: "Wildlife and environmental protection",
    icon: Fish,
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  },
  {
    id: "civ",
    name: "CIV – Civilian",
    description: "Civilian operations and roleplay",
    icon: Users,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
]

export default function DepartmentsPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">Explore our community departments and divisions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => {
          const DeptIcon = department.icon
          return (
            <Card key={department.id} className="overflow-hidden">
              <div className={`h-2 w-full ${department.color.split(" ")[0]}`}></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${department.color}`}>
                    <DeptIcon className="h-5 w-5" />
                  </div>
                  <CardTitle>{department.name}</CardTitle>
                </div>
                <CardDescription>{department.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 pt-4 border-t">
                  <Link href={`/departments/${department.id}`} className="text-primary hover:underline">
                    View Department →
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

