"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { updatePrimaryDepartment } from "@/app/actions/sync-department"

interface SelectDepartmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: number
  departments: string[]
  onSuccess?: () => void
}

export function SelectDepartmentDialog({
  open,
  onOpenChange,
  userId,
  departments,
  onSuccess,
}: SelectDepartmentDialogProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>(departments[0] || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!selectedDepartment) {
      toast({
        title: "Error",
        description: "Please select a department",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await updatePrimaryDepartment(userId, selectedDepartment)

      if (result.success) {
        toast({
          title: "Success",
          description: `Primary department set to ${selectedDepartment}`,
        })
        onOpenChange(false)
        if (onSuccess) onSuccess()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update primary department",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating primary department:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Primary Department</DialogTitle>
          <DialogDescription>
            We found multiple departments for your account. Please select your primary department.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedDepartment} onValueChange={setSelectedDepartment} className="space-y-3">
            {departments.map((dept) => (
              <div key={dept} className="flex items-center space-x-2">
                <RadioGroupItem value={dept} id={`dept-${dept}`} />
                <Label htmlFor={`dept-${dept}`} className="font-medium text-gray-900 dark:text-gray-100">
                  {dept}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
