import { Shield, Users, Anchor, Flame, Fish } from "lucide-react"
import Link from "next/link"

// Department data with appropriate icons
const departments = [
  {
    id: "civ",
    name: "CIV – Civilian",
    description: "Civilian operations and roleplay",
    memberCount: 245,
    icon: Users,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    subdivisions: ["Businesses", "Criminal Organizations", "Civilian Jobs"],
  },
  {
    id: "fhp",
    name: "FHP – Florida Highway Patrol",
    description: "State law enforcement agency",
    memberCount: 78,
    icon: Shield,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    subdivisions: ["Patrol Division", "Special Operations", "Training Division"],
  },
  {
    id: "mpd",
    name: "MPD – Miami Police Department",
    description: "City police department",
    memberCount: 92,
    icon: Shield,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    subdivisions: ["Patrol", "Investigations", "Special Units"],
  },
  {
    id: "bso",
    name: "BSO – Broward Sheriff's Office",
    description: "County law enforcement agency",
    memberCount: 65,
    icon: Shield,
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    subdivisions: ["Patrol", "Corrections", "Special Units"],
  },
  {
    id: "fwc",
    name: "FWC – Florida Fish and Wildlife Conservation Commission",
    description: "Wildlife and environmental protection",
    memberCount: 32,
    icon: Fish,
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
    subdivisions: ["Marine Patrol", "Wildlife Conservation", "Environmental Protection"],
  },
  {
    id: "uscg",
    name: "USCG – United States Coast Guard",
    description: "Maritime law enforcement and rescue",
    memberCount: 28,
    icon: Anchor,
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    subdivisions: ["Maritime Law Enforcement", "Search and Rescue", "Port Security"],
  },
  {
    id: "usms",
    name: "USMS – United States Marshals Service",
    description: "Federal law enforcement agency",
    memberCount: 24,
    icon: Shield,
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    subdivisions: ["Fugitive Task Force", "Judicial Security", "Prisoner Operations"],
  },
  {
    id: "bcfr",
    name: "BCFR – Broward County Fire Rescue",
    description: "Fire and emergency medical services",
    memberCount: 56,
    icon: Flame,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    subdivisions: ["Fire Suppression", "EMS", "Special Operations"],
  },
]

export default function DepartmentsPage() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-100">Departments</h1>
            <p className="text-gray-400">Explore our community departments and divisions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => {
            const DeptIcon = department.icon
            return (
              <div key={department.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className={`h-2 w-full ${department.color.split(" ")[0]}`}></div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`rounded-full p-2 ${department.color}`}>
                      <DeptIcon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-100">{department.name}</h3>
                  </div>
                  <p className="text-gray-400 mb-4">{department.description}</p>

                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-300">Active Members: </span>
                    <span className="text-sm text-gray-400">{department.memberCount}</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">Subdivisions</h4>
                    <ul className="space-y-1">
                      {department.subdivisions.map((subdivision, index) => (
                        <li key={index} className="text-sm text-gray-400">
                          • {subdivision}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <Link
                      href={`/departments/${department.id}`}
                      className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded"
                    >
                      View Department
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
