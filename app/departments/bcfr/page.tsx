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
      src: "https://media.discordapp.net/attachments/992665389987278939/1352496147830411304/Screenshot_2025-03-20_231604.png?ex=67fa91f1&is=67f94071&hm=6ef805811618029230c9b30fcc399f7fe7d693d31c398b07e42669ed3d18b943&=&format=webp&quality=lossless&width=928&height=493",
      alt: "",
    },
    {
      src: "https://media.discordapp.net/attachments/992665389987278939/1356708539418148935/FiveM_by_Cfx.re_4_1_2025_3_12_14_PM.png?ex=67fabbca&is=67f96a4a&hm=d7b077ff9b8668ff12dca6781b1d807a84193a686a68dc69d8afc9fb9aaacd2f&=&format=webp&quality=lossless&width=1032&height=581",
      alt: "",
    },
    {
      src: "https://media.discordapp.net/attachments/992665389987278939/1339020115693273098/Screenshot_501.png?ex=67fa52e9&is=67f90169&hm=932d2b0ddc62d160118eef788520a27d54edfed4482d2a57c7b187413219539f&=&format=webp&quality=lossless&width=928&height=522",
      alt: "",
    },
    {
      src: "https://media.discordapp.net/attachments/992665389987278939/1354994213967626443/image.png?ex=67fa6df3&is=67f91c73&hm=52d1317d6426b0e1a1aacce031087997e108b018a936a068d4b7b998ed713fa3&=&format=webp&quality=lossless&width=1032&height=580",
      alt: "",
    },
    {
      src: "https://media.discordapp.net/attachments/1144075650051878963/1354496165781176491/image.png?ex=67fa985b&is=67f946db&hm=5f513d78a0b2623d50eade0decea2ccdec0d79cd32b350697cf330383fdbc3db&=&format=webp&quality=lossless&width=550&height=300",
      alt: "",
    },
    {
      src: "https://media.discordapp.net/attachments/1144075650051878963/1355724052890783754/Screenshot_2025-03-29_215900.png?ex=67fa72aa&is=67f9212a&hm=c21cbf03f05d0df0732d0a135916358940d7541d1bd6619ab7659f6618c46edd&=&format=webp&quality=lossless&width=928&height=595",
      alt: "",
    },
    {
      src: "https://media.discordapp.net/attachments/1144075650051878963/1358180423213125653/image.png?ex=67fad096&is=67f97f16&hm=bd987687090e48dad2247746f053e1d053afa4800ff611350ca7631fb50ae9c2&=&format=webp&quality=lossless&width=1032&height=543",
      alt: "",
    },
    {
      src: "https://media.discordapp.net/attachments/1144075650051878963/1359268384520274272/Screenshot_2025-04-07_224923.png?ex=67fad154&is=67f97fd4&hm=be24ae424f1d66a0868c56c3e3928016187a50c08f90b7e7fef4e23ca3965cae&=&format=webp&quality=lossless&width=1032&height=560",
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
        <div className="relative w-full h-[300px] md:h-[250px] rounded-lg overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img src="https://media.discordapp.net/attachments/1336191599482503228/1360313363909054564/Screenshot_2025-03-02_182908.png?ex=67faaa0b&is=67f9588b&hm=e471d602fad72e3e45b8ef457445211807bc47e7ae498ace153d72efcafaa561&=&format=webp&quality=lossless&width=928&height=494" alt="Fire Department Banner" className="w-full h-full object-cover object-[center_40%]" />
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
              <div className="w-full h-auto object-cover4">
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
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
