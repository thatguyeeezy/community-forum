"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getAvailableTemplates } from "@/app/actions/application"
import { FileText, ArrowRight, Loader2, Building, Shield, Briefcase } from "lucide-react"

export default function ApplicationsPage() {
  const { data: session, status } = useSession()
  const [availableTemplates, setAvailableTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true)
        // Fetch available templates
        const templatesData = await getAvailableTemplates()
        setAvailableTemplates(templatesData)
      } catch (error) {
        console.error("Error fetching templates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchTemplates()
    }
  }, [status])

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container max-w-6xl py-12 mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-400">Loading available applications...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Get department icon based on department ID
  const getDepartmentIcon = (departmentId) => {
    switch (departmentId) {
      case "BSO":
        return <Shield className="h-10 w-10 text-amber-500" />
      case "MPD":
        return <Shield className="h-10 w-10 text-blue-500" />
      case "BCFR":
        return <Building className="h-10 w-10 text-red-500" />
      case "CIV":
        return <Briefcase className="h-10 w-10 text-green-500" />
      default:
        return <FileText className="h-10 w-10 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container max-w-6xl py-12 mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Department Applications</h1>
          <p className="text-xl text-gray-400">Apply to join departments or check your application status</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-800 pb-2">Available Applications</h2>

          {availableTemplates.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-200 overflow-hidden"
                >
                  <div className="p-6 flex items-start space-x-4">
                    <div className="bg-gray-700 p-3 rounded-lg">{getDepartmentIcon(template.departmentId)}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-100">{template.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{template.description || "Department Application"}</p>
                    </div>
                  </div>
                  <CardContent className="border-t border-gray-700 bg-gray-750 p-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Department: {template.departmentId}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-750 p-4 pt-0">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400 text-lg">No applications are currently available for you.</p>
                <p className="text-gray-500 mt-2">Check back later or contact an administrator.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mt-8">
          <h3 className="text-xl font-semibold mb-3">Application Process</h3>
          <p className="text-gray-400 mb-4">
            After submitting your application, it will be reviewed by our staff. You can check the status of your
            applications in your profile page.
          </p>
          <div className="flex justify-end">
            <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Link href={`/profile/${session.user.id}`}>View Your Applications</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
