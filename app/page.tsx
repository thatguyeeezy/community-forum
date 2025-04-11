export default function ForumHomepage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Header with subtle asymmetry */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-3">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="Florida Coast RP Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="font-semibold text-xl">Florida Coast RP</span>
            </div>

            <nav className="hidden md:flex">
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="inline-block px-2 py-1 font-medium text-gray-100 border-b-2 border-blue-500">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-block px-2 py-1 font-medium text-gray-300 hover:text-gray-100 border-b-2 border-transparent hover:border-gray-600"
                  >
                    Forums
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-block px-2 py-1 font-medium text-gray-300 hover:text-gray-100 border-b-2 border-transparent hover:border-gray-600"
                  >
                    Members
                  </a>
                </li>
                <li>
                  <a href="#" className="inline-block px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded">
                    Join
                  </a>
                </li>
              </ul>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-300 hover:text-gray-100" aria-label="Toggle dark/light mode">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              </button>
              <button className="p-2 text-gray-300 hover:text-gray-100" aria-label="Search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with asymmetrical layout */}
      <section className="relative bg-gray-800 border-b border-gray-700 overflow-hidden">
        {/* Replace the light blue background with an image carousel background */}
        <div className="absolute right-0 top-0 w-1/2 h-full z-0 overflow-hidden">
          {/* Image Carousel in Background */}
          <div className="relative w-full h-full">
            <div className="flex animate-carousel absolute inset-0">
              <div className="min-w-full h-full relative">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=800')] bg-cover bg-center opacity-60"></div>
                </div>
              </div>
              <div className="min-w-full h-full relative">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=800')] bg-cover bg-center opacity-60"></div>
                </div>
              </div>
              <div className="min-w-full h-full relative">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=800')] bg-cover bg-center opacity-60"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagonal overlay to create a more interesting visual */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-800/80 to-transparent transform -skew-x-12 origin-top-right"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold mb-4 text-gray-100">Welcome to Florida Coast RP</h1>
            <p className="text-gray-300 mb-6">
              Join our realistic FiveM roleplay community and experience immersive law enforcement, emergency services,
              and civilian interactions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Join Discord
              </a>
              <a
                href="#"
                className="inline-block px-6 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with asymmetrical three-column layout */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Recent Activity */}
          <div className="lg:w-1/4 order-2 lg:order-1">
            <div className="sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-gray-100 border-b border-gray-700 pb-2">Recent Activity</h2>

              <div className="space-y-6">
                <div className="relative pl-4 border-l-2 border-blue-500">
                  <a href="#" className="font-medium text-gray-100 hover:text-blue-400">
                    New police vehicles added
                  </a>
                  <div className="text-sm text-gray-400 mt-1">Posted by Admin, 2h ago</div>
                  <div className="text-sm text-gray-300 mt-2">
                    Check out the new police vehicles that have been added to the server!
                  </div>
                </div>

                <div className="relative pl-4 border-l-2 border-gray-600">
                  <a href="#" className="font-medium text-gray-100 hover:text-blue-400">
                    Server maintenance
                  </a>
                  <div className="text-sm text-gray-400 mt-1">Posted by Moderator, 5h ago</div>
                  <div className="text-sm text-gray-300 mt-2">
                    The server will be down for maintenance on Friday from 2-4 PM EST.
                  </div>
                </div>

                <div className="relative pl-4 border-l-2 border-gray-600">
                  <a href="#" className="font-medium text-gray-100 hover:text-blue-400">
                    Welcome to our newest members
                  </a>
                  <div className="text-sm text-gray-400 mt-1">Posted by Community Manager, 1d ago</div>
                  <div className="text-sm text-gray-300 mt-2">Please welcome our newest members to the community!</div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold mb-3 text-gray-100 border-b border-gray-700 pb-2">Online Now</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-blue-300 font-medium">
                    JD
                  </div>
                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-blue-300 font-medium">
                    MS
                  </div>
                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-blue-300 font-medium">
                    AK
                  </div>
                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-blue-300 font-medium">
                    RL
                  </div>
                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-blue-300 font-medium">
                    TJ
                  </div>
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    +3
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Categories */}
          <div className="lg:w-2/4 order-1 lg:order-2">
            <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-gray-700 pb-2">Categories</h2>

            <div className="space-y-8">
              {/* Category 1 - Announcements */}
              <div className="bg-gray-800 shadow-md border-l-4 border-blue-500">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-100">Community Announcements</h3>
                      <p className="text-gray-300 mt-1">Official announcements from the team</p>
                    </div>
                    <div className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded">12 threads</div>
                  </div>

                  <div className="mt-4 border-t border-gray-700 pt-3">
                    <a href="#" className="block py-2 hover:bg-gray-700 px-3 -mx-3 rounded">
                      <div className="font-medium text-gray-100">Welcome to our community!</div>
                      <div className="text-sm text-gray-400">Started by Admin, 2 days ago</div>
                    </a>
                    <a href="#" className="block py-2 hover:bg-gray-700 px-3 -mx-3 rounded">
                      <div className="font-medium text-gray-100">Important server rules update</div>
                      <div className="text-sm text-gray-400">Started by Moderator, 1 week ago</div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Category 2 - Recruitment */}
              <div className="bg-gray-800 shadow-md border-l-4 border-gray-600">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-100">Recruitment & Applications</h3>
                      <p className="text-gray-300 mt-1">Information about joining and applications</p>
                    </div>
                    <div className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded">8 threads</div>
                  </div>

                  <div className="mt-4 border-t border-gray-700 pt-3">
                    <a href="#" className="block py-2 hover:bg-gray-700 px-3 -mx-3 rounded">
                      <div className="font-medium text-gray-100">Police Department Recruitment Open</div>
                      <div className="text-sm text-gray-400">Started by ChiefOfPolice, 3 days ago</div>
                    </a>
                    <a href="#" className="block py-2 hover:bg-gray-700 px-3 -mx-3 rounded">
                      <div className="font-medium text-gray-100">EMS Recruitment Information</div>
                      <div className="text-sm text-gray-400">Started by EMSDirector, 5 days ago</div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Category 3 - General Discussion */}
              <div className="bg-gray-800 shadow-md border-l-4 border-gray-600">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-100">General Discussion</h3>
                      <p className="text-gray-300 mt-1">General topics and community discussions</p>
                    </div>
                    <div className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded">25 threads</div>
                  </div>

                  <div className="mt-4 border-t border-gray-700 pt-3">
                    <a href="#" className="block py-2 hover:bg-gray-700 px-3 -mx-3 rounded">
                      <div className="font-medium text-gray-100">What's your favorite vehicle?</div>
                      <div className="text-sm text-gray-400">Started by CarEnthusiast, 1 day ago</div>
                    </a>
                    <a href="#" className="block py-2 hover:bg-gray-700 px-3 -mx-3 rounded">
                      <div className="font-medium text-gray-100">Best places to roleplay?</div>
                      <div className="text-sm text-gray-400">Started by NewPlayer, 4 days ago</div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Category 4 - Server Updates */}
              <div className="bg-gray-800 shadow-md border-l-4 border-gray-600">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-100">Server Updates</h3>
                      <p className="text-gray-300 mt-1">Changelogs and server updates</p>
                    </div>
                    <div className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded">7 threads</div>
                  </div>

                  <div className="mt-4 border-t border-gray-700 pt-3">
                    <a href="#" className="block py-2 hover:bg-gray-700 px-3 -mx-3 rounded">
                      <div className="font-medium text-gray-100">Update v3.5 - New vehicles and weapons</div>
                      <div className="text-sm text-gray-400">Started by Developer, 1 week ago</div>
                    </a>
                    <a href="#" className="block py-2 hover:bg-gray-700 px-3 -mx-3 rounded">
                      <div className="font-medium text-gray-100">Patch Notes v3.4.2</div>
                      <div className="text-sm text-gray-400">Started by Admin, 2 weeks ago</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Community Highlights */}
          <div className="lg:w-1/4 order-3">
            <div className="sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-gray-100 border-b border-gray-700 pb-2">
                Community Highlights
              </h2>

              {/* Featured Event */}
              <div className="bg-gray-800 shadow-md p-5 mb-6 border-t-4 border-blue-500">
                <h3 className="font-bold mb-2 text-gray-100">Featured Event</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Join us this weekend for the grand opening of the new shopping mall!
                </p>
                <div className="text-sm text-gray-400">Saturday, 8PM EST</div>
              </div>

              {/* Server Status */}
              <div className="bg-gray-800 shadow-md p-5 mb-6 border-l-4 border-blue-500">
                <h3 className="font-bold mb-2 text-gray-100">Server Status</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-gray-300">Online: 34 players</span>
                </div>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-100">1,250</div>
                    <div className="text-sm text-gray-400">Members</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-100">3,705</div>
                    <div className="text-sm text-gray-400">Discord</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 shadow-md p-5 mb-6 border-l-4 border-blue-500">
                <h3 className="font-bold mb-2 text-gray-100">Discord</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Join our Discord server to stay connected with the community!
                </p>
                <a href="#" className="inline-block px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  Join Now
                </a>
              </div>

              <div className="bg-gray-800 shadow-md p-5">
                <h3 className="font-bold mb-3 text-gray-100 border-b border-gray-700 pb-2">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="flex items-center text-gray-300 hover:text-blue-400">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mr-2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Server Rules
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-gray-300 hover:text-blue-400">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mr-2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      How to Join
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-gray-300 hover:text-blue-400">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mr-2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Staff Applications
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-gray-300 hover:text-blue-400">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mr-2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Report a Player
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="relative mr-3">
                  <img
                    src="/placeholder.svg?height=32&width=32"
                    alt="Florida Coast RP Logo"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="font-bold text-lg">Florida Coast RP</span>
              </div>
              <p className="text-gray-400 text-sm">
                A realistic FiveM roleplay community focused on quality roleplay and immersive experiences.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-gray-200 border-b border-gray-700 pb-2">Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Forums
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Members
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Rules
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-gray-200 border-b border-gray-700 pb-2">Connect</h3>
              <div className="flex space-x-3 mb-4">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
              <p className="text-sm text-gray-500">
                © 2023 Florida Coast Roleplay.
                <br />
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
