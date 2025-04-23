"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { reviewApplication, recordInterview } from "@/app/actions/application"
import { CheckCircle, XCircle, Clock, CheckCheck, AlertTriangle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ApplicationReviewActionsProps {
  applicationId: number
  status: string
  interviewStatus?: string | null
}

export function ApplicationReviewActions({ applicationId, status, interviewStatus }: ApplicationReviewActionsProps) {
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReview = async (action: "accept" | "deny") => {
    try {
      setIsSubmitting(true)
      await reviewApplication(applicationId, action, note)
      toast({
        title: action === "accept" ? "Application accepted" : "Application denied",
        description: "The application has been updated successfully.",
      })
      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while reviewing the application",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInterview = async (result: "completed" | "failed") => {
    try {
      setIsSubmitting(true)
      await recordInterview(applicationId, result, note)
      toast({
        title: result === "completed" ? "Interview completed" : "Interview failed",
        description: "The interview result has been recorded.",
      })
      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while recording the interview result",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render different actions based on application status
  if (status === "PENDING") {
    return (
      <Card className="border-l-4 border-amber-500 bg-gray-800 shadow">
        <CardHeader>
          <CardTitle className="text-gray-100">Review Application</CardTitle>
          <CardDescription className="text-gray-400">Accept or deny this application</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mb-4 bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={() => handleReview("deny")}
            disabled={isSubmitting}
            className="flex items-center"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Deny
          </Button>
          <Button
            variant="default"
            onClick={() => handleReview("accept")}
            disabled={isSubmitting}
            className="flex items-center bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Accept
          </Button>
        </CardFooter>
      </Card>
    )
  } else if (status === "ACCEPTED" && interviewStatus === "AWAITING_INTERVIEW") {
    return (
      <Card className="border-l-4 border-blue-500 bg-gray-800 shadow">
        <CardHeader>
          <CardTitle className="text-gray-100">Record Interview</CardTitle>
          <CardDescription className="text-gray-400">Record the result of the interview</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add interview notes (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mb-4 bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={() => handleInterview("failed")}
            disabled={isSubmitting}
            className="flex items-center"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Failed
          </Button>
          <Button
            variant="default"
            onClick={() => handleInterview("completed")}
            disabled={isSubmitting}
            className="flex items-center bg-blue-600 hover:bg-blue-700"
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Completed
          </Button>
        </CardFooter>
      </Card>
    )
  } else {
    return (
      <Card className="border-l-4 border-gray-500 bg-gray-800 shadow">
        <CardHeader>
          <CardTitle className="text-gray-100">Application Status</CardTitle>
          <CardDescription className="text-gray-400">
            {status === "DENIED"
              ? "This application has been denied"
              : status === "COMPLETED"
                ? "This application has been completed"
                : "This application has been processed"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-gray-400">
            <Clock className="mr-2 h-4 w-4" />
            <span>No further actions required</span>
          </div>
        </CardContent>
      </Card>
    )
  }
}
