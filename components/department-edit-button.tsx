"use client"

import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Link from "next/link"

interface DepartmentEditButtonProps {
  departmentId: string
  canEdit: boolean
}

export function DepartmentEditButton({ departmentId, canEdit }: DepartmentEditButtonProps) {
  if (!canEdit) {
    return null
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={`/admin/departments/${departmentId}/edit`} className="flex items-center">
        <Edit className="h-4 w-4 mr-2" />
        Edit Department
      </Link>
    </Button>
  )
}

