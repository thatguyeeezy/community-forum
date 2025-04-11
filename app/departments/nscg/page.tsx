import { Anchor, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function NSCGPage() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-300">NSCG – Naval Sea Coast Guard</span>
        </div>

        {/* Department Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-8">
          <div className="h-2 w-full bg-cyan-600"></div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="rounded-full p-3 bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300">
                <Anchor className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-100">NSCG – Naval Sea Coast Guard</h1>
                <p className="text-gray-400">Maritime law enforcement and rescue</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">
                <span className="font-medium">Members:</span> 45
              </div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">Maritime Patrol</div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">Search and Rescue</div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">Port Security</div>
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
                The Naval Sea Coast Guard (NSCG) is responsible for maritime law enforcement, search and rescue
                operations, and port security. Our personnel patrol coastal waters, respond to distress calls, enforce
                boating regulations, and protect maritime infrastructure. NSCG works closely with other law enforcement
                agencies to ensure safety on the water.
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Requirements</h2>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>18+ years old</li>
                <li>Clean record on the server</li>
                <li>Knowledge of maritime operations</li>
                <li>Ability to work in marine environments</li>
                <li>Minimum 15 hours of civilian playtime</li>
              </ul>
            </div>

            {/* Application Process */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">How to Join</h2>
              <p className="text-gray-300 leading-relaxed">
                Applications for NSCG are processed through our website. After submitting your application, you'll be
                contacted for an interview, followed by basic training if accepted. Training includes maritime law
                enforcement, navigation, search and rescue techniques, and boat handling.
              </p>

              <div className="mt-6">
                <Link
                  href={`/apply?department=nscg`}
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
                    alt="NSCG Commander"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-200">William Anderson</div>
                    <div className="text-sm text-gray-400">NSCG Commander</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Deputy Commander"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-200">Sophia Rodriguez</div>
                    <div className="text-sm text-gray-400">Deputy Commander</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Departments */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Related Departments</h2>
              <div className="space-y-3">
                <Link
                  href="/departments/fwc"
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-md text-gray-300 hover:text-gray-100"
                >
                  <span className="text-teal-400">FWC – Florida Wildlife Commission</span>
                </Link>
                <Link
                  href="/departments/bso"
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-md text-gray-300 hover:text-gray-100"
                >
                  <span className="text-blue-400">BSO – Broward Sheriff's Office</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
