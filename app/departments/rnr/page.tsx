import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { DepartmentLeaders } from "@/components/department-leaders"
import { Users, UserPlus, Heart, Briefcase } from "lucide-react"

// Department data
const department = {
  id: "rnr",
  name: "Recruitment & Retention",
  description: "Connecting people with opportunities and fostering growth",
  memberCount: 1,
  accentColor: "blue",
  leaders: [
    { profileId: 0, title: "Director" },
    { profileId: 0, title: "Deputy Director" },
    { profileId: 0, title: "Recruitment Manager" },
    { profileId: 0, title: "Retention Specialist" },
  ],
}

export default function RnRDepartmentPage() {
  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pb-12">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Departments", href: "/departments" },
          { label: "Recruitment & Retention", href: `/departments/${department.id}` },
        ]}
      />

      {/* Department Header */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-sm mb-8">
          <div className="flex items-center gap-6">
            <div className="bg-blue-600 p-4 rounded-full text-white">
              <Users size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">FCRP RECRUITMENT & RETENTION</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{department.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
              Members: {department.memberCount}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* About Us Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">
            <span className="text-blue-600">About</span> Us
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-2"></div>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* About Content */}
            <div className="lg:col-span-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <p className="text-gray-800 dark:text-gray-200 mb-4">
                <span className="font-bold text-lg text-blue-600">
                  Looking for a Department That Makes an Impact? Join FCRP Recruitment & Retention Team!
                </span>
              </p>

              <p className="text-gray-800 dark:text-gray-200 mb-4">
                Are you passionate about connecting people with opportunities? Do you thrive on building relationships,
                solving challenges, and creating an environment where people want to stay and grow? Then a career in
                Recruitment & Retention is calling your name!
              </p>

              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                Why Recruitment & Retention?
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-800 dark:text-gray-200">
                <li>
                  <span className="font-semibold">Be the Face for Growth:</span> Every organization's success begins
                  with its people. As a Recruitment & Retention Team Member, you play a pivotal role in shaping the
                  community.
                </li>
                <li>
                  <span className="font-semibold">Build Meaningful Relationships:</span> This department is all about
                  people. Whether it's finding the perfect candidate or ensuring a valued employee feels supported,
                  you'll build connections that last a lifetime.
                </li>
                <li>
                  <span className="font-semibold">High Demand, Endless Opportunities:</span> Recruitment and Retention
                  are among the most in-demand skills today. Mastering this craft opens doors to industries across the
                  globe, giving you a world of opportunities.
                </li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3">Why Join Us?</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-800 dark:text-gray-200">
                <li>
                  <span className="font-semibold">Inspiring Workplace:</span> We believe in practicing what we
                  preach—our own team culture is rooted in collaboration, recognition, and growth.
                </li>
                <li>
                  <span className="font-semibold">Support for Your Success:</span> Get access to cutting-edge tools,
                  professional development resources, and mentorship to become a leader in our department.
                </li>
                <li>
                  <span className="font-semibold">Make an Impact:</span> Your work will directly impact people's lives
                  and contribute to the community success story.
                </li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                What Makes Our Team Special?
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-800 dark:text-gray-200">
                <li>
                  <span className="font-semibold">Supportive Leadership:</span> We believe in teamwork and mentorship,
                  ensuring you have the tools and guidance to succeed in your role.
                </li>
                <li>
                  <span className="font-semibold">Be a Part of Something Bigger:</span> Your efforts will ensure the
                  continued growth and success of a vibrant, inclusive roleplay community where creativity thrives.
                </li>
              </ul>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4">
              {/* Department Logo */}
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6 flex justify-center">
                <div className="grid grid-cols-2 gap-4 max-w-[250px]">
                  <div className="flex items-center justify-center bg-blue-600 p-4 rounded-lg text-white">
                    <UserPlus size={48} />
                  </div>
                  <div className="flex items-center justify-center bg-blue-700 p-4 rounded-lg text-white">
                    <Heart size={48} />
                  </div>
                  <div className="flex items-center justify-center bg-blue-700 p-4 rounded-lg text-white">
                    <Briefcase size={48} />
                  </div>
                  <div className="flex items-center justify-center bg-blue-600 p-4 rounded-lg text-white">
                    <Users size={48} />
                  </div>
                </div>
              </div>

              {/* Apply Now */}
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <h3 className="text-2xl font-bold text-blue-600 mb-2">Become a Team Member Today!</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Join our team and make a difference in your community.
                </p>
                <Link
                  href={`/departments/${department.id}/apply`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  JOIN OUR TEAM
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement and Leadership */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Mission Statement */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-center mb-6">
              <span className="text-blue-600">Mission</span> Statement
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-2"></div>
            </h2>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <p className="text-gray-800 dark:text-gray-200 italic">YOUR Future STARTS Here</p>
              <p className="text-gray-800 dark:text-gray-200 mt-4">
                Don't just settle for a job—choose this department where you can make a difference. Recruitment &
                Retention is more than applications & Interviews; it's about fostering environments where people can
                thrive. Join us and be part of shaping the future, one hire and one happy employee at a time.
              </p>
              <p className="text-gray-800 dark:text-gray-200 mt-4 font-semibold">
                Ready to start the journey? Apply today and join the Recruitment & Retention movement!
              </p>
            </div>
          </div>

          {/* Leadership */}
          <div>
            <h2 className="text-2xl font-bold text-center mb-6">
              <span className="text-blue-600">Leader</span>ship
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-2"></div>
            </h2>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <DepartmentLeaders leaders={department.leaders} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
