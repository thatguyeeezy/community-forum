// components/activity-tracker.tsx
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ActivityTracker() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Track user activity on page load and navigation
    const trackActivity = async () => {
      try {
        await fetch('/api/activity', {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'pragma': 'no-cache',
            'cache-control': 'no-cache',
          }
        })
      } catch (error) {
        console.error('Failed to track activity:', error)
      }
    }
    
    trackActivity()
  }, [pathname])
  
  // This component doesn't render anything
  return null
}