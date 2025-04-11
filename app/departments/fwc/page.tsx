import { Fish, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function FWCPage() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-300">FWC – Florida Wildlife Commission</span>
        </div>

        {/* Department Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-8">
          <div className="h-2 w-full bg-teal-600"></div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="rounded-full p-3 bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">
                <Fish className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-100">FWC – Florida Wildlife Commission</h1>
                <p className="text-gray-400">Wildlife conservation and enforcement</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">
                <span className="font-medium">Members:</span> 35
              </div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">Law Enforcement</div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">Conservation</div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">Boating Safety</div>
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
                The Florida Wildlife Commission (FWC) is responsible for conserving the state's fish and wildlife
                resources and enforcing related laws. FWC officers patrol wilderness areas, waterways, and coastal
                regions to protect wildlife and ensure compliance with hunting, fishing, and boating regulations. The
                department also conducts research and educational programs to promote conservation.
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Requirements</h2>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>18+ years old</li>
                <li>Clean record on the server</li>
                <li>Knowledge of wildlife and conservation</li>
                <li>Ability to work in outdoor environments</li>
                <li>Minimum 15 hours of civilian playtime</li>
              </ul>
            </div>

            {/* Application Process */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">How to Join</h2>
              <p className="text-gray-300 leading-relaxed">
                Applications for FWC are processed through our website. After submitting your application, you'll be
                contacted for an interview, followed by field training if accepted. Training includes wildlife
                identification, conservation law, boating safety, and enforcement procedures.
              </p>

              <div className="mt-6">
                <Link
                  href={`/apply?department=fwc`}
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
                    alt="FWC Director"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-200">Thomas Green</div>
                    <div className="text-sm text-gray-400">FWC Director</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Deputy Director"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-200">Emily Chen</div>
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
                  href="/departments/fhp"
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-md text-gray-300 hover:text-gray-100"
                >
                  <span className="text-green-400">FHP – Florida Highway Patrol</span>
                </Link>
                <Link
                  href="/departments/nscg"
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-md text-gray-300 hover:text-gray-100"
                >
                  <span className="text-cyan-400">NSCG – Naval Sea Coast Guard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
