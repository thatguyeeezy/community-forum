"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationStatusBadge } from "@/components/application-status-badge"
import { getAvailableTemplates } from "@/app/actions/application"
import { FileText, ArrowRight, Loader2 } from "lucide-react"

export default function ApplicationsPage() {
  const { data: session, status } = useSession()
  const [userApplications, setUserApplications] = useState([])
  const [availableTemplates, setAvailableTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      if (session?.user) {
        try {
          setIsLoading(true)
          // Fetch user's applications
          const response = await fetch(`/api/users/${session.user.id}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch applications: ${response.status} ${response.statusText}`)
          }
          const applicationsData = await response.json()
          setUserApplications(applicationsData)

          // Fetch available templates
          const templatesData = await getAvailableTemplates()
          setAvailableTemplates(templatesData)
        } catch (error) {
          console.error("Error fetching applications:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (status === "authenticated") {
      fetchApplications()
    }
  }, [session, status])

  if (status === "loading" || isLoading) {
    return (
      <div className="container max-w-6xl py-8 space-y-8">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading applications...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Department Applications</h1>
        <p className="text-muted-foreground mt-2">Apply to join departments or check your application status</p>
      </div>

      {userApplications.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Applications</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {userApplications.map((application: any) => (
              <Card key={application.id}>
                <CardHeader>
                  <CardTitle>{application.template.name}</CardTitle>
                  <CardDescription>Submitted on {new Date(application.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <ApplicationStatusBadge status={application.status} interviewStatus={application.interviewStatus} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/applications/status/${application.id}`}>
                      View Status
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Applications</h2>
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">You have no applications yet.</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Applications</h2>
        {availableTemplates.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableTemplates.map((template: any) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Department Application</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/applications/${template.id}`}>
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No applications are currently available for you.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
