import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="text-center text-sm leading-loose text-muted-foreground md:text-left">
        © 2025 {" "}
          <Link
            href="https://discord.gg/DaPzAREBGp"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Florida Coast RP
          </Link>
          .
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/terms" className="underline underline-offset-4">
            Terms
          </Link>
          <Link href="/privacy" className="underline underline-offset-4">
            Privacy
          </Link>
          <Link href="/contact" className="underline underline-offset-4">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}

