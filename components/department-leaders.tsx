"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Leader {
  profileId: number
  title: string
}

interface LeaderWithProfile extends Leader {
  name: string
  avatar: string
}

interface DepartmentLeadersProps {
  leaders: Leader[]
}

export function DepartmentLeaders({ leaders }: DepartmentLeadersProps) {
  const [leadersWithProfiles, setLeadersWithProfiles] = useState<LeaderWithProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderProfiles = async () => {
      try {
        const leaderPromises = leaders.map(async (leader) => {
          try {
            const response = await fetch(`/api/users/${leader.profileId}`)

            if (!response.ok) {
              // Fallback data if user not found
              return {
                ...leader,
                name: "Unknown User",
                avatar: "/placeholder.svg?height=40&width=40",
              }
            }

            const userData = await response.json()

            return {
              ...leader,
              name: userData.name || userData.username || "Unknown User",
              avatar: userData.image || "/placeholder.svg?height=40&width=40",
            }
          } catch (error) {
            console.error(`Error fetching profile ${leader.profileId}:`, error)
            // Fallback data if fetch fails
            return {
              ...leader,
              name: "Unknown User",
              avatar: "/placeholder.svg?height=40&width=40",
            }
          }
        })

        const resolvedLeaders = await Promise.all(leaderPromises)
        setLeadersWithProfiles(resolvedLeaders)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching leader profiles:", error)
        setIsLoading(false)
      }
    }

    fetchLeaderProfiles()
  }, [leaders])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((_, index) => (
          <div key={index} className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div>
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {leadersWithProfiles.map((leader, index) => (
        <div key={index} className="flex items-center gap-3">
          <Link href={`/profile/${leader.profileId}`}>
            <img
              src={leader.avatar || "/placeholder.svg"}
              alt={leader.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
          <div>
            <Link href={`/profile/${leader.profileId}`} className="font-medium text-foreground hover:underline">
              {leader.name}
            </Link>
            <div className="text-sm text-muted-foreground">{leader.title}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
