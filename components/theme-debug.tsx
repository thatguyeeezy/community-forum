"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeDebug() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 bg-card text-card-foreground p-4 rounded-md shadow-lg z-50">
      <p>Theme: {theme}</p>
      <p>Resolved Theme: {resolvedTheme}</p>
      <p>HTML Class: {document.documentElement.classList.contains("dark") ? "dark" : "light"}</p>
    </div>
  )
}
