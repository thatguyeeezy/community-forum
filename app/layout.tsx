import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SessionProvider } from "@/components/session-provider"
import { Toaster } from "@/components/ui/toaster"
import { ThemeDebug } from "@/components/theme-debug"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Florida Coast RP",
  description: "Florida Coast Roleplay Community",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`} suppressHydrationWarning>
        <SessionProvider>
          <ThemeProvider>
            <SiteHeader />
            <main>{children}</main>
            <Toaster />
            <ThemeDebug />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
