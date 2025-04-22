import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus, InterviewStatus } from "@prisma/client"

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus
  interviewStatus?: InterviewStatus | null
}

export function ApplicationStatusBadge({ status, interviewStatus }: ApplicationStatusBadgeProps) {
  if (status === "PENDING") {
    return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>
  }

  if (status === "ACCEPTED") {
    if (interviewStatus === "AWAITING_INTERVIEW") {
      return <Badge className="bg-blue-500 hover:bg-blue-600">Awaiting Interview</Badge>
    }
    return <Badge className="bg-blue-500 hover:bg-blue-600">Accepted</Badge>
  }

  if (status === "COMPLETED") {
    return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
  }

  if (status === "DENIED") {
    return <Badge className="bg-red-500 hover:bg-red-600">Denied</Badge>
  }

  if (status === "CANCELLED") {
    return <Badge className="bg-gray-500 hover:bg-gray-600">Cancelled</Badge>
  }

  return <Badge>Unknown</Badge>
}
