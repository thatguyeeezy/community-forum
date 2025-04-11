export default function DepartmentsLoading() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="h-8 w-48 bg-gray-800 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="h-2 w-full bg-gray-700"></div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-full p-2 bg-gray-700 h-9 w-9 animate-pulse"></div>
                  <div className="h-6 w-40 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-4"></div>

                <div className="mb-4">
                  <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                  <div className="space-y-1">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-3 w-full bg-gray-700 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="h-10 w-full bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
