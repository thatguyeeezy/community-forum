"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ApplicationStatusBadge } from "@/components/application-status-badge"
import { ArrowLeft, Clock, CheckCircle, XCircle, FileText } from "lucide-react"
import Link from "next/link"

export default function ApplicationStatusPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchApplication() {
      try {
        setLoading(true)
        const response = await fetch(`/api/applications/${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError("Application not found")
          } else if (response.status === 403) {
            setError("You don't have permission to view this application")
          } else {
            setError("Failed to load application")
          }
          setLoading(false)
          return
        }

        const data = await response.json()
        setApplication(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching application:", err)
        setError("Failed to load application")
        setLoading(false)
      }
    }

    if (id && status !== "loading") {
      fetchApplication()
    }
  }, [id, status])

  if (status === "loading") {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Please wait while we load your application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/applications/status/${id}`)}`)
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading Application</CardTitle>
            <CardDescription>Please wait while we load your application details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Button asChild>
                <Link href="/applications">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Applications
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Application Not Found</CardTitle>
            <CardDescription>
              The application you're looking for doesn't exist or you don't have permission to view it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Button asChild>
                <Link href="/applications">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Applications
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Format dates
  const submittedDate = new Date(application.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const updatedDate = new Date(application.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{application.template?.name || "Department Application"}</CardTitle>
              <CardDescription>Submitted on {submittedDate}</CardDescription>
            </div>
            <ApplicationStatusBadge status={application.status} interviewStatus={application.interviewStatus} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2 text-sm">
            {application.status === "PENDING" && <Clock className="h-5 w-5 text-amber-500" />}
            {application.status === "ACCEPTED" && <CheckCircle className="h-5 w-5 text-blue-500" />}
            {application.status === "COMPLETED" && <CheckCircle className="h-5 w-5 text-green-500" />}
            {application.status === "DENIED" && <XCircle className="h-5 w-5 text-red-500" />}

            <span className="font-medium">
              {application.status === "PENDING" && "Your application is currently under review."}
              {application.status === "ACCEPTED" &&
                application.interviewStatus === "AWAITING_INTERVIEW" &&
                "Your application has been accepted. You will be contacted for an interview."}
              {application.status === "ACCEPTED" &&
                application.interviewStatus === "INTERVIEW_FAILED" &&
                "Your interview was unsuccessful. You may be eligible to try again after the cooldown period."}
              {application.status === "COMPLETED" &&
                "Congratulations! Your application has been completed successfully."}
              {application.status === "DENIED" && "Your application has been denied."}
            </span>
          </div>

          {application.cooldownUntil && (
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-md">
              <p className="text-red-800 dark:text-red-300">
                You are in a cooldown period until {new Date(application.cooldownUntil).toLocaleDateString()}. You
                cannot submit a new application for this department until after this date.
              </p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-2">Application Details</h3>
            <Separator className="mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{application.template?.departmentId || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{updatedDate}</p>
              </div>
            </div>
          </div>

          {application.notes && application.notes.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Notes</h3>
              <Separator className="mb-4" />

              <div className="space-y-4">
                {application.notes.map((note: any) => (
                  <div key={note.id} className="bg-muted p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      {new Date(note.createdAt).toLocaleDateString()} - {note.author?.name || "Staff"}
                    </p>
                    <p>{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-between">
            <Button asChild variant="outline">
              <Link href="/profile">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile
              </Link>
            </Button>

            {application.status === "DENIED" && !application.cooldownUntil && (
              <Button asChild>
                <Link href="/applications">
                  <FileText className="mr-2 h-4 w-4" />
                  Apply Again
                </Link>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
