import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-700 bg-gray-900">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="text-center text-sm leading-loose text-gray-400 md:text-left">
          © 2025{" "}
          <Link
            href="https://discord.gg/DaPzAREBGp"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-gray-300 underline underline-offset-4 hover:text-blue-400 transition-colors"
          >
            Florida Coast RP
          </Link>
          .
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <Link href="/terms" className="underline underline-offset-4 hover:text-blue-400 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="underline underline-offset-4 hover:text-blue-400 transition-colors">
            Privacy
          </Link>
          <Link href="/contact" className="underline underline-offset-4 hover:text-blue-400 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
