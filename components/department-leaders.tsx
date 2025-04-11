"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Leader {
  profileId: number | null
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
          // If profileId is 0, return vacant data with no profileId
          if (leader.profileId === 0) {
            return {
              ...leader,
              profileId: null,
              name: "Vacant",
              avatar: "/placeholder.svg?height=40&width=40",
            }
          }

          try {
            const response = await fetch(`/api/users/${leader.profileId}`)

            if (!response.ok) {
              // If user not found, return vacant data with no profileId
              return {
                ...leader,
                profileId: null,
                name: "Vacant",
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
            // If fetch fails, return vacant data with no profileId
            return {
              ...leader,
              profileId: null,
              name: "Vacant",
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
        <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${leader.profileId === null ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
          {leader.profileId === null ? (
            <div className="relative">
              <img
                src={leader.avatar}
                alt={leader.name}
                className="w-10 h-10 rounded-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">VACANT</span>
              </div>
            </div>
          ) : (
            <Link href={`/profile/${leader.profileId}`}>
              <img
                src={leader.avatar}
                alt={leader.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>
          )}
          <div>
            {leader.profileId === null ? (
              <div className="flex flex-col">
                <span className="font-medium text-gray-500 dark:text-gray-400">{leader.name}</span>
                <span className="text-sm text-muted-foreground italic">{leader.title}</span>
              </div>
            ) : (
              <div className="flex flex-col">
                <Link href={`/profile/${leader.profileId}`} className="font-medium text-foreground hover:underline">
                  {leader.name}
                </Link>
                <span className="text-sm text-muted-foreground">{leader.title}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
