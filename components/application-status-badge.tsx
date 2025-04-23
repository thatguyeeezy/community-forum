import { Badge } from "@/components/ui/badge"

type ApplicationStatus = "PENDING" | "ACCEPTED" | "DENIED" | "COMPLETED" | "CANCELLED"
type InterviewStatus = "AWAITING_INTERVIEW" | "INTERVIEW_COMPLETED" | "INTERVIEW_FAILED" | null

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus
  interviewStatus?: InterviewStatus
}

export function ApplicationStatusBadge({ status, interviewStatus }: ApplicationStatusBadgeProps) {
  // Determine badge variant and text based on status and interviewStatus
  let variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning" | null =
    null
  let text = status

  switch (status) {
    case "PENDING":
      variant = "secondary"
      text = "Pending Review"
      break
    case "ACCEPTED":
      if (interviewStatus === "AWAITING_INTERVIEW") {
        variant = "warning"
        text = "Awaiting Interview"
      } else if (interviewStatus === "INTERVIEW_FAILED") {
        variant = "destructive"
        text = "Interview Failed"
      } else {
        variant = "warning"
        text = "Accepted"
      }
      break
    case "DENIED":
      variant = "destructive"
      text = "Denied"
      break
    case "COMPLETED":
      variant = "success"
      text = "Completed"
      break
    case "CANCELLED":
      variant = "outline"
      text = "Cancelled"
      break
  }

  return <Badge variant={variant}>{text}</Badge>
}
