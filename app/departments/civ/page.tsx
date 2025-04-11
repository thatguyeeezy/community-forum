import { Users, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function CIVPage() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-300">CIV – Civilian</span>
        </div>

        {/* Department Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-8">
          <div className="h-2 w-full bg-purple-600"></div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="rounded-full p-3 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-100">CIV – Civilian</h1>
                <p className="text-gray-400">Civilian operations and roleplay</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">
                <span className="font-medium">Members:</span> 245
              </div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">Businesses</div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">Criminal Organizations</div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">Civilian Jobs</div>
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
                The Civilian Department encompasses all non-law enforcement roleplay within Florida Coast RP. From
                legitimate business owners to criminal organizations, the civilian department offers the most diverse
                roleplay opportunities. Members can establish businesses, form criminal enterprises, or take on various
                civilian jobs throughout the city.
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Requirements</h2>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>Discord account</li>
                <li>Basic understanding of FiveM</li>
                <li>Ability to follow server rules</li>
              </ul>
            </div>

            {/* Application Process */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">How to Join</h2>
              <p className="text-gray-300 leading-relaxed">
                To join the Civilian Department, simply connect to our server and create your character. No formal
                application is required, but you must follow all server rules and guidelines. New players will receive a
                brief orientation to help them get started with civilian roleplay.
              </p>

              <div className="mt-6">
                <Link
                  href="/connect"
                  className="inline-block py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Connect Now
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
                    alt="Civilian Director"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-200">John Doe</div>
                    <div className="text-sm text-gray-400">Civilian Director</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Deputy Director"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-200">Jane Smith</div>
                    <div className="text-sm text-gray-400">Deputy Director</div>
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
                  href="/departments/mpd"
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-md text-gray-300 hover:text-gray-100"
                >
                  <span className="text-green-400">MPD – Miami Police Department</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
