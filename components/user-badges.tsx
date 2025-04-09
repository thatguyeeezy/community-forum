// components/user-badges.tsx
import { Badge } from "@/components/ui/badge"

interface UserBadgesProps {
  isEarlyAdopter?: boolean
  postCount?: number
  threadCount?: number
}

export function UserBadges({ isEarlyAdopter, postCount, threadCount }: UserBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {isEarlyAdopter && (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
        >
          Early Adopter
        </Badge>
      )}
      {threadCount && threadCount > 100 && (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Active Threader
        </Badge>
      )}
      {postCount && postCount > 500 && (
        <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
          Prolific Poster
        </Badge>
      )}
    </div>
  )
}

