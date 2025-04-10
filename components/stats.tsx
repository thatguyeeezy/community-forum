export function Stats() {
  const checkValue = (value: number | undefined) => {
    return value !== undefined ? value : 0
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-[#1e2330] rounded-md p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-400">Total Members</div>
            <div className="text-xl font-bold">{checkValue(0)}</div>
          </div>
          <div className="text-blue-400">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-[#1e2330] rounded-md p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-400">Active Today</div>
            <div className="text-xl font-bold">{checkValue(0)}</div>
          </div>
          <div className="text-blue-400">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-[#1e2330] rounded-md p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-400">Threads</div>
            <div className="text-xl font-bold">{checkValue(0)}</div>
          </div>
          <div className="text-blue-400">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-[#1e2330] rounded-md p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-400">Posts</div>
            <div className="text-xl font-bold">{checkValue(0)}</div>
          </div>
          <div className="text-blue-400">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
