export default function DepartmentLoading() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-16 bg-gray-800 rounded animate-pulse"></div>
          <div className="h-4 w-4 bg-gray-800 rounded-full animate-pulse"></div>
          <div className="h-4 w-24 bg-gray-800 rounded animate-pulse"></div>
          <div className="h-4 w-4 bg-gray-800 rounded-full animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-800 rounded animate-pulse"></div>
        </div>

        {/* Department Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-8">
          <div className="h-2 w-full bg-gray-700"></div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="rounded-full p-3 bg-gray-700 h-12 w-12 animate-pulse"></div>
              <div>
                <div className="h-8 w-64 bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-48 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="h-6 w-32 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="h-6 w-40 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-2 pl-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Application Process */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="h-6 w-36 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>

              <div className="mt-6">
                <div className="h-10 w-32 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Leadership */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="h-6 w-32 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
                    <div>
                      <div className="h-5 w-32 bg-gray-700 rounded animate-pulse mb-1"></div>
                      <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Departments */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="h-6 w-48 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <div className="h-5 w-5 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-5 w-40 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
                <div className="h-4 w-32 bg-gray-700 rounded animate-pulse mx-auto mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
