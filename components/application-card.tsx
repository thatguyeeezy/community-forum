import Link from "next/link"
import { FileText, ArrowRight, Building, Shield, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ApplicationCardProps {
  template: {
    id: number
    name: string
    description: string | null
    departmentId: string
  }
}

export function ApplicationCard({ template }: ApplicationCardProps) {
  // Get department icon based on department ID
  const getDepartmentIcon = (departmentId: string) => {
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
  const getDepartmentName = (departmentId: string) => {
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

  // Get department badge color based on department ID
  const getDepartmentBadgeColor = (departmentId: string) => {
    switch (departmentId) {
      case "BSO":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "MPD":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "BSFR":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "CIV":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-200 overflow-hidden">
      <div className="p-6 flex items-start space-x-4">
        <div className="bg-gray-700 p-3 rounded-lg">{getDepartmentIcon(template.departmentId)}</div>
        <div>
          <h3 className="text-xl font-semibold text-gray-100">{template.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{template.description || "Department Application"}</p>
          <Badge className={`mt-3 ${getDepartmentBadgeColor(template.departmentId)}`}>
            {getDepartmentName(template.departmentId)}
          </Badge>
        </div>
      </div>
      <CardContent className="border-t border-gray-700 bg-gray-750 p-4">
        <div className="flex items-center text-sm text-gray-400">
          <FileText className="mr-2 h-4 w-4" />
          <span>Application ID: {template.id}</span>
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
  )
}
