"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { reviewApplication, recordInterview } from "@/app/actions/application"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface ApplicationReviewActionsProps {
  application: {
    id: number
    status: string
    interviewStatus: string | null
  }
}

export function ApplicationReviewActions({ application }: ApplicationReviewActionsProps) {
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleReview = async (action: "accept" | "deny") => {
    setIsSubmitting(true)
    try {
      await reviewApplication(application.id, action, note)
      toast({
        title: action === "accept" ? "Application accepted" : "Application denied",
        description: "The application has been updated successfully.",
      })
      setNote("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInterview = async (result: "completed" | "failed") => {
    setIsSubmitting(true)
    try {
      await recordInterview(application.id, result, note)
      toast({
        title: result === "completed" ? "Interview completed" : "Interview failed",
        description: "The interview status has been updated successfully.",
      })
      setNote("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render different actions based on application status
  if (application.status === "PENDING") {
    return (
      <div className="space-y-4">
        <Textarea
          placeholder="Add a note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex space-x-2">
          <Button onClick={() => handleReview("accept")} disabled={isSubmitting} className="flex-1">
            <CheckCircle className="mr-2 h-4 w-4" />
            Accept
          </Button>
          <Button onClick={() => handleReview("deny")} variant="destructive" disabled={isSubmitting} className="flex-1">
            <XCircle className="mr-2 h-4 w-4" />
            Deny
          </Button>
        </div>
      </div>
    )
  }

  if (application.status === "ACCEPTED" && application.interviewStatus === "AWAITING_INTERVIEW") {
    return (
      <div className="space-y-4">
        <Textarea
          placeholder="Add a note about the interview (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex space-x-2">
          <Button onClick={() => handleInterview("completed")} disabled={isSubmitting} className="flex-1">
            <CheckCircle className="mr-2 h-4 w-4" />
            Interview Completed
          </Button>
          <Button
            onClick={() => handleInterview("failed")}
            variant="destructive"
            disabled={isSubmitting}
            className="flex-1"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Interview Failed
          </Button>
        </div>
      </div>
    )
  }

  // For completed or denied applications
  return (
    <div className="p-4 bg-muted rounded-md text-center">
      <AlertCircle className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
      <p className="text-muted-foreground">No actions available for this application status.</p>
    </div>
  )
}
