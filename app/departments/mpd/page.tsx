import { Shield, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function MPDPage() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-300">MPD – Miami Police Department</span>
        </div>

        {/* Department Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-8">
          <div className="h-2 w-full bg-indigo-600"></div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="rounded-full p-3 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-100">MPD – Miami Police Department</h1>
                <p className="text-gray-400">City law enforcement agency</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">
                <span className="font-medium">Members:</span> 92
              </div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">Patrol Division</div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">Detective Bureau</div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">Special Units</div>
            </div>
          </div>
        </div>

        {/* Department Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">About</h2>
              <p className="text-gray-300 leading-relaxed">
                The Miami Police Department (MPD) is responsible for law enforcement within the city of Miami. Our
                officers patrol neighborhoods, respond to calls for service, investigate crimes, and work to build
                positive relationships with the community. MPD is committed to reducing crime and improving the quality
                of life for all residents and visitors.
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Requirements</h2>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>18+ years old</li>
                <li>Clean record on the server</li>
                <li>Ability to pass background check</li>
                <li>Strong communication skills</li>
                <li>Minimum 15 hours of civilian playtime</li>
              </ul>
            </div>

            {/* Application Process */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">How to Join</h2>
              <p className="text-gray-300 leading-relaxed">
                Applications for MPD are processed through our website. After submitting your application, you'll be
                contacted for an interview, followed by a background check. If accepted, you'll attend the police
                academy for training in law enforcement procedures, firearms, defensive tactics, and department
                policies.
              </p>

              <div className="mt-6">
                <Link
                  href={`/apply?department=mpd`}
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
                <div className="flex items-center gap-3">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Police Chief"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-200">David Martinez</div>
                    <div className="text-sm text-gray-400">Police Chief</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Assistant Chief"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-200">Jennifer Taylor</div>
                    <div className="text-sm text-gray-400">Assistant Chief</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Departments */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Related Departments</h2>
              <div className="space-y-3">
                <Link
                  href="/departments/bso"
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-md text-gray-300 hover:text-gray-100"
                >
                  <span className="text-blue-400">BSO – Broward Sheriff's Office</span>
                </Link>
                <Link
                  href="/departments/fhp"
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-md text-gray-300 hover:text-gray-100"
                >
                  <span className="text-green-400">FHP – Florida Highway Patrol</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
