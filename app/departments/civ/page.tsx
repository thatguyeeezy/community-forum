import { Users, Shield, Gavel, Building } from "lucide-react"
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"

// Department data
const department = {
  id: "civ",
  name: "Civilian Operations",
  description: "Creating immersive and realistic roleplay experiences",
  memberCount: 245,
  icon: Users,
  color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  textColor: "text-blue-400",
  subdivisions: ["Organizations", "Businesses", "Judicial Services"],
  advertisement:
    "Civilian Operations is all about working together to make the community better, focusing on keeping things realistic when roleplaying. We offer many opportunities, from running businesses to joining or creating organizations. We also have a Judicial Services division for those interested in court cases and similar activities. There are many ranks to achieve, including staff positions. If you want to be part of a department where every move counts, Civilian Operations is the one to join!",
  about:
    "Civilian Operations is very open to all who are dedicated to creating immersive/realistic roleplay scenarios. Whether you are a seasoned player or a new player, we help guide you in the correct direction to grow your experience.",
  membershipGuidelines: [
    "Maintain consistency with activity",
    "Must be whitelisted in Florida Coast Roleplay",
    "Participation is encouraged to keep the community operating in a smooth direction",
    "Showcase unique skills that will contribute to realistic and immersive roleplay scenarios",
  ],
  divisions: [
    {
      name: "Organizations",
      description: "Mafias, Motorcycle Clubs, and other organized groups",
      icon: Users,
    },
    {
      name: "Businesses",
      description: "Establish and run various businesses throughout the city",
      icon: Building,
    },
    {
      name: "Judicial Services",
      description: "Court cases and legal proceedings within the roleplay environment",
      icon: Gavel,
    },
  ],
  requirements: [
    "Must be Whitelisted in Florida Coast Roleplay",
    "Have communication skills",
    "Experience is preferred but not required",
  ],
  leaders: [
    { name: "John Doe", title: "Civilian Operations Director", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "Jane Smith", title: "Deputy Director", avatar: "/placeholder.svg?height=40&width=40" },
  ],
}

export default function DepartmentPage() {
  const DeptIcon = department.icon

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Departments" }, // No href makes this non-clickable
    { label: department.name },
  ]

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Department Header */}
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-8">
          <div className={`h-2 w-full bg-blue-500`}></div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`rounded-full p-3 ${department.color}`}>
                <DeptIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{department.name}</h1>
                <p className="text-muted-foreground">{department.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-accent px-3 py-1 rounded text-foreground">
                <span className="font-medium">Members:</span> {department.memberCount}
              </div>
              {department.subdivisions.map((sub, index) => (
                <div key={index} className="bg-accent px-3 py-1 rounded text-foreground">
                  {sub}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Advertisement */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Civilian Operations</h2>
              <p className="text-foreground leading-relaxed">{department.advertisement}</p>
            </div>

            {/* About */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">About Civilian Operations</h2>
              <p className="text-foreground leading-relaxed">{department.about}</p>
            </div>

            {/* Divisions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">What We Offer</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {department.divisions.map((division, index) => {
                  const DivIcon = division.icon
                  return (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="rounded-full p-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          <DivIcon className="h-5 w-5" />
                        </div>
                        <h3 className="font-medium text-foreground">{division.name}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm">{division.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Membership Guidelines */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Membership Guidelines</h2>
              <ul className="list-disc pl-5 text-foreground space-y-2">
                {department.membershipGuidelines.map((guideline, index) => (
                  <li key={index}>{guideline}</li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Requirements to Join</h2>
              <ul className="list-disc pl-5 text-foreground space-y-2">
                {department.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>

              <div className="mt-6">
                <Link
                  href="/connect"
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
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Leadership</h2>
              <div className="space-y-4">
                {department.leaders.map((leader, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={leader.avatar || "/placeholder.svg"}
                      alt={leader.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-foreground">{leader.name}</div>
                      <div className="text-sm text-muted-foreground">{leader.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Departments */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Other Departments</h2>
              <div className="space-y-3">
                <Link
                  href="/departments/bso"
                  className="flex items-center gap-3 p-2 hover:bg-accent rounded-md text-foreground"
                >
                  <Shield className="h-5 w-5 text-amber-400" />
                  <span>BSO – Broward Sheriff's Office</span>
                </Link>
                <Link
                  href="/departments/mpd"
                  className="flex items-center gap-3 p-2 hover:bg-accent rounded-md text-foreground"
                >
                  <Shield className="h-5 w-5 text-purple-400" />
                  <span>MPD – Miami Police Department</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
