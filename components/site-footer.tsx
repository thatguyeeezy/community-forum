import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="dark:bg-gray-900 bg-gray-100 dark:text-white text-gray-800 mt-12">
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
            <p className="dark:text-gray-400 text-gray-500 text-sm">
              A realistic FiveM roleplay community focused on quality roleplay and immersive experiences.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4 dark:text-gray-200 text-gray-700 border-b dark:border-gray-700 border-gray-200 pb-2">
              Links
            </h3>
            <ul className="space-y-2 text-sm dark:text-gray-400 text-gray-500">
              <li>
                <Link href="/" className="hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-blue-400">
                  Forums
                </Link>
              </li>
              <li>
                <Link href="/members" className="hover:text-blue-400">
                  Members
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-blue-400">
                  Rules
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 dark:text-gray-200 text-gray-700 border-b dark:border-gray-700 border-gray-200 pb-2">
              Connect
            </h3>
            <div className="flex space-x-3 mb-4">
              <a
                href="#"
                className="w-8 h-8 dark:bg-gray-800 bg-gray-200 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 dark:bg-gray-800 bg-gray-200 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a
                href="https://discord.gg/DaPzAREBGp"
                className="w-8 h-8 dark:bg-gray-800 bg-gray-200 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 dark:bg-gray-800 bg-gray-200 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
            <p className="text-sm dark:text-gray-500 text-gray-400">
              © {new Date().getFullYear().toString()} Florida Coast Roleplay.
              <br />
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
