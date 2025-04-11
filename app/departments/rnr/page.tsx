import { Users } from "lucide-react"
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { DepartmentLeaders } from "@/components/department-leaders"

// Department data
const department = {
  id: "rnr",
  name: "FCRP RECRUITMENT & RETENTION",
  description: "Connecting people with opportunities and fostering growth",
  memberCount: 1,
  icon: Users,
  color: "bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-300",
  textColor: "text-blue-500 dark:text-blue-400",
  accentColor: "bg-blue-600 hover:bg-blue-700",
  leaders: [
    { profileId: 3, title: "Director" },
    { profileId: 1, title: "Deputy Director" },
    { profileId: 4, title: "Recruitment Manager" },
  ],
  aboutUs: `Looking for a Department That Makes an Impact? Join FCRP Recruitment & Retention Team!

Are you passionate about connecting people with opportunities? Do you thrive on building relationships, solving challenges, and creating an environment where people want to stay and grow? Then a career in Recruitment & Retention is calling your name!

Why Recruitment & Retention?

Be the Face for Growth: Every organization's success begins with its people. As a Recruitment & Retention Team Member, you play a pivotal role in shaping the community.
Build Meaningful Relationships: This department is all about people. Whether it's finding the perfect candidate or ensuring a valued employee feels supported, you'll build connections that last a lifetime.
High Demand, Endless Opportunities: Recruitment and Retention are among the most in-demand skills today. Mastering this craft opens doors to industries across the globe, giving you a world of opportunities.

Why Join Us?

Inspiring Workplace: We believe in practicing what we preach—our own team culture is rooted in collaboration, recognition, and growth.
Support for Your Success: Get access to cutting-edge tools, professional development resources, and mentorship to become a leader in our department.
Make an Impact: Your work will directly impact people's lives and contribute to the community success story.

What Makes Our Team Special?

Supportive Leadership: We believe in teamwork and mentorship, ensuring you have the tools and guidance to succeed in your role.
Be a Part of Something Bigger: Your efforts will ensure the continued growth and success of a vibrant, inclusive roleplay community where creativity thrives.`,
  missionStatement: `YOUR Future STARTS Here

Don't just settle for a job—choose this department where you can make a difference. Recruitment & Retention is more than applications & Interviews; it's about fostering environments where people can thrive. Join us and be part of shaping the future, one hire and one happy employee at a time.

Ready to start the journey? Apply today and join the Recruitment & Retention movement!`,
}

export default function DepartmentPage() {
  const DeptIcon = department.icon

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Departments", href: "/departments" },
    { label: "Recruitment & Retention" },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Breadcrumbs */}
      <div className="container mx-auto py-4 px-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Banner */}
      <div className="w-full bg-gray-800 dark:bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-8 flex items-center">
          <div className="bg-blue-600 p-4 rounded-full text-white mr-4">
            <DeptIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{department.name}</h1>
            <p className="text-gray-300">{department.description}</p>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-4">
          <div className="inline-block bg-gray-700 px-3 py-1 rounded text-gray-300">
            <span className="font-medium">Members:</span> {department.memberCount}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* About Us Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-6">
            <span className="text-blue-500">About</span> <span className="text-gray-900 dark:text-white">Us</span>
          </h2>
          <div className="h-1 w-24 bg-blue-500 mx-auto mb-8"></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{department.aboutUs}</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-2 max-w-[200px]">
                  <div className="bg-blue-600 p-3 rounded-lg flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="bg-blue-700 p-3 rounded-lg flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="bg-blue-700 p-3 rounded-lg flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="bg-blue-600 p-3 rounded-lg flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                <h3 className="text-2xl font-bold text-blue-500 mb-4">Become a Team Member Today!</h3>
                <p className="text-gray-800 dark:text-gray-200 mb-6">
                  Join our team and make a difference in your community.
                </p>
                <Link
                  href={`/apply?department=${department.id}`}
                  className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-lg"
                >
                  JOIN OUR TEAM
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement and Leadership Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mission Statement */}
          <div>
            <h2 className="text-3xl font-bold mb-2">
              <span className="text-blue-500">Mission</span>{" "}
              <span className="text-gray-900 dark:text-white">Statement</span>
            </h2>
            <div className="h-1 w-24 bg-blue-500 mb-6"></div>

            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line italic">
                {department.missionStatement}
              </p>
            </div>
          </div>

          {/* Leadership */}
          <div>
            <h2 className="text-3xl font-bold mb-2">
              <span className="text-blue-500">Department</span>{" "}
              <span className="text-gray-900 dark:text-white">Leadership</span>
            </h2>
            <div className="h-1 w-24 bg-blue-500 mb-6"></div>

            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <DepartmentLeaders leaders={department.leaders} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
