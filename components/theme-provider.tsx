"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Use a ref to track if we've initialized
  const initialized = React.useRef(false)

  // Initialize theme only once on the client side
  React.useEffect(() => {
    if (!initialized.current) {
      // Get stored theme or default to dark
      const storedTheme = localStorage.getItem("theme-mode") || "dark"
      document.documentElement.classList.toggle("dark", storedTheme === "dark")
      initialized.current = true
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
