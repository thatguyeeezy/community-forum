"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Ensure we only render theme switching in the client to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Force dark theme initially to avoid flash
  React.useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
