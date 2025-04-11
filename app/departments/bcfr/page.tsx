import { Stethoscope, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function BCFRPage() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-300">BCFR – Broward County Fire Rescue</span>
        </div>

        {/* Department Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-8">
          <div className="h-2 w-full bg-red-600"></div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="rounded-full p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-100">BCFR – Broward County Fire Rescue</h1>
                <p className="text-gray-400">Emergency medical services and fire response</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">
                <span className="font-medium">Members:</span> 42
              </div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">Fire Operations</div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">EMS</div>
              <div className="bg-gray-700 px-3 py-1 rounded text-gray-300">Special Operations</div>
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
                Broward County Fire Rescue (BCFR) provides emergency medical services and fire response throughout
                Broward County. Our dedicated team of firefighters and paramedics work around the clock to protect lives
                and property. BCFR responds to medical emergencies, structure fires, vehicle accidents, hazardous
                materials incidents, and other emergency situations.
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Requirements</h2>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>18+ years old</li>
                <li>Clean record on the server</li>
                <li>Basic understanding of medical terminology</li>
                <li>Ability to work in a team environment</li>
                <li>Minimum 15 hours of civilian playtime</li>
              </ul>
            </div>

            {/* Application Process */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">How to Join</h2>
              <p className="text-gray-300 leading-relaxed">
                Applications for BCFR are processed through our website. After submitting your application, you'll be
                contacted for an interview. If accepted, you'll undergo training at the fire academy before being
                assigned to a station. The training covers basic firefighting techniques, emergency medical procedures,
                and department protocols.
              </p>

              <div className="mt-6">
                <Link
                  href={`/apply?department=bcfr`}
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
                    alt="Fire Chief"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-200">Michael Torres</div>
                    <div className="text-sm text-gray-400">Fire Chief</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Deputy Chief"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-200">Lisa Rodriguez</div>
                    <div className="text-sm text-gray-400">Deputy Chief</div>
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
