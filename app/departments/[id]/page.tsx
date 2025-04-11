import { Shield, Users, ChevronRight } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Department data with appropriate icons
const departments = [
  {
    id: "civ",
    name: "CIV – Civilian",
    description: "Civilian operations and roleplay",
    memberCount: 245,
    icon: Users,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    textColor: "text-blue-400",
    subdivisions: ["Businesses", "Criminal Organizations", "Civilian Jobs"],
    longDescription:
      "The Civilian Department encompasses all non-law enforcement roleplay within Florida Coast RP. From legitimate business owners to criminal organizations, the civilian department offers the most diverse roleplay opportunities. Members can establish businesses, form criminal enterprises, or take on various civilian jobs throughout the city.",
    requirements: ["Discord account", "Basic understanding of FiveM", "Ability to follow server rules"],
    leaders: [
      { name: "John Doe", title: "Civilian Director", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Jane Smith", title: "Deputy Director", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    applicationProcess:
      "To join the Civilian Department, simply connect to our server and create your character. No formal application is required, but you must follow all server rules and guidelines.",
  },
  {
    id: "fhp",
    name: "FHP – Florida Highway Patrol",
    description: "State law enforcement agency",
    memberCount: 78,
    icon: Shield,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    textColor: "text-green-400",
    subdivisions: ["Patrol Division", "Special Operations", "Training Division"],
    longDescription:
      "The Florida Highway Patrol (FHP) is responsible for enforcing traffic laws on state highways and assisting local law enforcement agencies. FHP troopers patrol highways, investigate crashes, and enforce traffic laws to ensure the safety of all motorists.",
    requirements: [
      "18+ years old",
      "Clean record on the server",
      "Ability to pass background check",
      "Minimum 20 hours of civilian playtime",
    ],
    leaders: [
      { name: "Robert Johnson", title: "FHP Colonel", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Sarah Williams", title: "FHP Major", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    applicationProcess:
      "Applications for FHP are processed through our website. After submitting your application, you'll be contacted for an interview, followed by academy training if accepted.",
  },
  // Other departments would be defined here
]

export default function DepartmentPage({ params }: { params: { id: string } }) {
  const department = departments.find((d) => d.id === params.id)

  if (!department) {
    notFound()
  }

  const DeptIcon = department.icon

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/departments" className="hover:text-gray-300">
            Departments
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-300">{department.name}</span>
        </div>

        {/* Department Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-8">
          <div className={`h-2 w-full ${department.color.split(" ")[0]}`}></div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`rounded-full p-3 ${department.color}`}>
                <DeptIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-100">{department.name}</h1>
                <p className="text-gray-400">{department.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">
                <span className="font-medium">Members:</span> {department.memberCount}
              </div>
              {department.subdivisions.map((sub, index) => (
                <div key={index} className="bg-gray-700 px-3 py-1 rounded text-gray-300">
                  {sub}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">About</h2>
              <p className="text-gray-300 leading-relaxed">{department.longDescription}</p>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Requirements</h2>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                {department.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Application Process */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">How to Join</h2>
              <p className="text-gray-300 leading-relaxed">{department.applicationProcess}</p>

              <div className="mt-6">
                <Link
                  href={`/apply?department=${department.id}`}
                  className="inline-block py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Leadership */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Leadership</h2>
              <div className="space-y-4">
                {department.leaders.map((leader, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={leader.avatar || "/placeholder.svg"}
                      alt={leader.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-200">{leader.name}</div>
                      <div className="text-sm text-gray-400">{leader.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Departments */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Other Departments</h2>
              <div className="space-y-3">
                {departments
                  .filter((d) => d.id !== department.id)
                  .slice(0, 4)
                  .map((dept) => {
                    const Icon = dept.icon
                    return (
                      <Link
                        key={dept.id}
                        href={`/departments/${dept.id}`}
                        className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-md text-gray-300 hover:text-gray-100"
                      >
                        <Icon className={`h-5 w-5 ${dept.textColor}`} />
                        <span>{dept.name}</span>
                      </Link>
                    )
                  })}
                <Link href="/departments" className="block text-center mt-4 text-blue-400 hover:text-blue-300 text-sm">
                  View All Departments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
