import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-700 bg-gray-900">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <p className="text-center text-sm text-gray-400 md:text-left">
          &copy; {new Date().getFullYear()} Florida Coast Roleplay. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/terms" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
            Privacy
          </Link>
          <Link href="/contact" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
