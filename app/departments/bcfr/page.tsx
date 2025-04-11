import { Flame, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { DepartmentLeaders } from "@/components/department-leaders"

// Department data
const department = {
  id: "bcfr",
  name: "FCRP COUNTY FIRE RESCUE",
  description: "Emergency medical services and fire response",
  memberCount: 42,
  icon: Flame,
  color: "bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-300",
  textColor: "text-red-500 dark:text-red-400",
  accentColor: "bg-red-600 hover:bg-red-700",
  subdivisions: ["EMS Division", "Fire Division", "Special Operations"],
  aboutUs: `The Florida Coast Roleplay Fire Rescue Services Department is a professional, educational department. Dedicated to the safety, development, and service of our members and the public. We are proud to serve the following counties Broward County, Palm Beach County, Miami-Dade County and surrounding unincorporated areas, with 24-hour coverage from 9 fully staffed stations, protecting approximately 80 square miles of diverse terrain.

Our mission goes beyond traditional firefighting we specialize in fire prevention, rescue operations, emergency medical response, and technical disciplines such as hazardous materials response, urban search and rescue, water rescue services, forestry operations, and aircraft rescue. Our department also operates advanced support units including Air Operations, an Aircraft Rescue Firefighting, HAZMAT operations, a Technical Rescue Team, and a Fire Investigations/Prevention Bureau

We believe in building a supportive and educational environment for all members, where continuous learning and real-world experience go hand-in-hand. With a strong emphasis on in-depth training both classroom-based and hands-on, our department is designed to help you grow and develop as both a responder and a leader. 

Above all, Florida Coast Roleplay Fire Rescue Department is a family, a diverse and passionate group of individuals committed to excellence, teamwork, and self-improvement. Whether you're new to emergency services or a seasoned, we welcome you to be part of something Big!`,
  missionStatement: `The mission of The Florida Coast Roleplay Fire Rescue Services Department is to protect lives, reduce harm, and safeguard property through the unified and professional delivery of fire suppression, emergency medical services, and disaster response. We are committed to serving the residents and visitors of our counties with integrity, compassion, and excellence.`,
  requirements: ["18+ years old", "Clean record on the server", "Ability to pass background check"],
  leaders: [
    { profileId: 3, title: "Fire Chief" },
    { profileId: 1, title: "Deputy Chief" },
    { profileId: 4, title: "Assistant Chief" },
    { profileId: 5, title: "Battalion Chief" },
  ],
  divisions: [
    {
      name: "EMS Division",
      description: "Provides emergency medical services and transport throughout the county.",
      icon: "/images/ems-icon.png",
    },
    {
      name: "Fire Suppression",
      description: "Primary firefighting operations and response to fire emergencies.",
      icon: "/images/fire-icon.png",
    },
    {
      name: "HAZMAT Operations",
      description: "Specialized response to hazardous materials incidents and chemical emergencies.",
      icon: "/images/hazmat-icon.png",
    },
    {
      name: "Technical Rescue",
      description: "Specialized rescue operations including confined space, high angle, and structural collapse.",
      icon: "/images/rescue-icon.png",
    },
  ],
  featuredImages: [
    {
      src: "/images/fire-1.png",
      alt: "",
    },
    {
      src: "/images/fire-2.png",
      alt: "",
    },
    {
      src: "/images/fire-3.png",
      alt: "",
    },
  ],
}

export default function DepartmentPage() {
  const DeptIcon = department.icon

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Departments", href: "/departments" }, // No href makes this non-clickable
    { label: "BCFR – Broward County Fire Rescue" },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Banner */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img src="/images/fd-banner.png" alt="Fire Department Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
            <div className="flex items-center gap-4 mb-4">
              <DeptIcon className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-2">{department.name}</h1>
            <p className="text-xl text-gray-200 text-center max-w-2xl">{department.description}</p>
          </div>
        </div>

        {/* About Us Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
            <span className="text-red-500">About</span> Us
          </h2>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-8"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                {department.aboutUs}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-full h-auto object-cover">
                <img src="https://media.discordapp.net/attachments/1336191599482503228/1360317993829138432/fcrplogofd.png?ex=67faae5b&is=67f95cdb&hm=1df9fad79737fee095c4d2f7fc80a9c29b5d4dcc7ed5c473203e229b45cb74f9&=&format=webp&quality=lossless" alt="Fire Department Badge" className="w-full h-auto rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
            <span className="text-red-500">Mission</span> Statement
          </h2>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-8"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg italic">
                {department.missionStatement}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm text-center">
              <h3 className="text-2xl font-bold text-red-500 mb-4">Become a Firefighter Today!</h3>
              <p className="text-gray-800 dark:text-gray-200 mb-6">
                Join our team and make a difference in your community.
              </p>
              <Link
                href={`/apply?department=${department.id}`}
                className="inline-block py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold text-lg"
              >
                APPLY HERE
              </Link>
            </div>
          </div>
        </div>

        {/* Leadership */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
            <span className="text-red-500">Department</span> Leadership
          </h2>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-8"></div>

          <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
            <DepartmentLeaders leaders={department.leaders} />
          </div>
        </div>

        {/* Divisions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
            <span className="text-red-500">Our</span> Divisions
          </h2>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {department.divisions.map((division, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                  <Flame className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{division.name}</h3>
                <p className="text-gray-700 dark:text-gray-300">{division.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Media Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
            <span className="text-red-500">Media</span> Gallery
          </h2>
          <div className="h-1 w-24 bg-red-500 mx-auto mb-8"></div>

          <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {department.featuredImages.map((image, index) => (
                <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
                  <img
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-medium">{image.alt}</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Add more placeholder images to fill the grid */}
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={`extra-${index}`} className="relative h-48 rounded-lg overflow-hidden group">
                  <img
                    src={`/placeholder.svg?height=300&width=400&text=FD+Image+${index + 4}`}
                    alt={`Fire Department Image ${index + 4}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-medium">Fire Department Activity</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
