import { Shield, Flame } from "lucide-react"
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { DepartmentLeaders } from "@/components/department-leaders"

// Department data
const department = {
  id: "bcfr",
  name: "BCFR – Broward County Fire Rescue",
  description: "Emergency medical services and fire response",
  memberCount: 42,
  icon: Flame,
  color: "bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-300",
  textColor: "text-red-500 dark:text-red-400",
  accentColor: "bg-red-600 hover:bg-red-700",
  subdivisions: ["EMS Division", "Fire Division", "Special Operations"],
  longDescription:
    "Broward County Fire Rescue (BCFR) provides emergency medical services and fire response throughout Broward County. BCFR personnel respond to medical emergencies, fires, and other incidents requiring specialized rescue operations.",
  requirements: ["OPEN TO ANYONE / NON WHITELIST TOO", "18 Years Of Age", "Preferred Past FiveM Experience"],
  leaders: [
    { profileId: 1, title: "Fire Chief" },
    { profileId: 2, title: "Deputy Chief" },
  ],
  applicationProcess:
    "Applications for BCFR are processed through our website. After submitting your application, you'll be contacted for an interview, followed by academy training if accepted.",
  featuredImages: [
    {
      src: "/images/fire-1.png",
      alt: "BCFR in action",
    },
    {
      src: "/images/fire-2.png",
      alt: "BCFR emergency response",
    },
    {
      src: "/images/fire-3.png",
      alt: "BCFR team",
    },
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
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Department Header */}
        <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden mb-8 shadow-sm">
          <div className="h-2 w-full bg-red-500"></div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`rounded-full p-3 ${department.color}`}>
                <DeptIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{department.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{department.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-gray-200 dark:bg-slate-700 px-3 py-1 rounded text-gray-800 dark:text-gray-200">
                <span className="font-medium">Members:</span> {department.memberCount}
              </div>
              {department.subdivisions.map((sub, index) => (
                <div
                  key={index}
                  className="bg-gray-200 dark:bg-slate-700 px-3 py-1 rounded text-gray-800 dark:text-gray-200"
                >
                  {sub}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Advertisement */}
        <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Join Our Team</h2>
          <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
            <p className="mb-4">
              Join the Broward Sheriff Fire Rescue Team! Are you ready to make a difference and be part of an elite team
              dedicated to saving lives and protecting the community? The Broward Sheriff Fire Rescue is actively
              recruiting passionate and driven individuals. Don't wait—apply today and live the dream that LEO Officers
              aspire to!
            </p>
            <div className="mt-6">
              <Link
                href={`/apply?department=${department.id}`}
                className={`inline-block py-2 px-4 ${department.accentColor} text-white rounded`}
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Images */}
        <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Featured Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {department.featuredImages.map((image, index) => (
              <div
                key={index}
                className="relative h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700"
              >
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Department Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">About</h2>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{department.longDescription}</p>
            </div>

            {/* Requirements */}
            <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Requirements</h2>
              <ul className="list-disc pl-5 text-gray-800 dark:text-gray-200 space-y-2">
                {department.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Application Process */}
            <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">How to Join</h2>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{department.applicationProcess}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Leadership */}
            <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Leadership</h2>
              <DepartmentLeaders leaders={department.leaders} />
            </div>

            {/* Related Departments */}
            <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Other Departments</h2>
              <div className="space-y-3">
                <Link
                  href="/departments/fhp"
                  className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-slate-700/70 rounded-md text-gray-800 dark:text-gray-200"
                >
                  <Shield className="h-5 w-5 text-green-500 dark:text-green-400" />
                  <span>FHP – Florida Highway Patrol</span>
                </Link>
                <Link
                  href="/departments/bso"
                  className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-slate-700/70 rounded-md text-gray-800 dark:text-gray-200"
                >
                  <Shield className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                  <span>BSO – Broward Sheriff's Office</span>
                </Link>
                <Link
                  href="/departments/mpd"
                  className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-slate-700/70 rounded-md text-gray-800 dark:text-gray-200"
                >
                  <Shield className="h-5 w-5 text-purple-500 dark:text-purple-400" />
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
