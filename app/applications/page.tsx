"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getAvailableTemplates, getAvailableDepartments } from "@/app/actions/application"
import { FileText, Loader2, Building, Shield, Briefcase, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ApplicationCard } from "@/components/application-card"

export default function ApplicationsPage() {
  const { data: session, status } = useSession()
  const [availableTemplates, setAvailableTemplates] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentsData = await getAvailableDepartments()
        setDepartments(departmentsData)
      } catch (error) {
        console.error("Error fetching departments:", error)
      }
    }

    if (status === "authenticated") {
      fetchDepartments()
    }
  }, [status])

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true)
        // Fetch available templates with department filter
        const filter = selectedDepartment === "all" ? undefined : selectedDepartment
        const templatesData = await getAvailableTemplates(filter)
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
  }, [status, selectedDepartment])

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
      case "BSFR":
        return <Building className="h-10 w-10 text-red-500" />
      case "CIV":
        return <Briefcase className="h-10 w-10 text-green-500" />
      default:
        return <FileText className="h-10 w-10 text-gray-400" />
    }
  }

  // Get department name based on department ID
  const getDepartmentName = (departmentId) => {
    switch (departmentId) {
      case "BSO":
        return "Broward Sheriff's Office"
      case "MPD":
        return "Municipal Police Department"
      case "BSFR":
        return "Broward Sheriff Fire Rescue"
      case "CIV":
        return "Civilian Department"
      default:
        return departmentId
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container max-w-6xl py-12 mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-3">Department Applications</h1>
            <p className="text-xl text-gray-400">Apply to join departments or check your application status</p>
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {getDepartmentName(dept)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-800 pb-2">Available Applications</h2>

          {availableTemplates.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableTemplates.map((template) => (
                <ApplicationCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400 text-lg">
                  {selectedDepartment === "all"
                    ? "No applications are currently available for you."
                    : `No applications available for ${getDepartmentName(selectedDepartment)}.`}
                </p>
                <p className="text-gray-500 mt-2">
                  {selectedDepartment === "all"
                    ? "Check back later or contact an administrator."
                    : "Try selecting a different department or check back later."}
                </p>
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
