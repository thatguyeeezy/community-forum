"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { updatePrimaryDepartment } from "@/app/actions/sync-department"
import { useToast } from "@/hooks/use-toast"

interface SelectDepartmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: number
  departments: string[]
  onSuccess?: (selectedDepartment: string) => void
}

export function SelectDepartmentDialog({
  open,
  onOpenChange,
  userId,
  departments,
  onSuccess,
}: SelectDepartmentDialogProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Set the first department as default when the dialog opens or departments change
  useEffect(() => {
    if (departments.length > 0 && (!selectedDepartment || !departments.includes(selectedDepartment))) {
      setSelectedDepartment(departments[0])
    }
  }, [departments, selectedDepartment])

  // Update the handleSubmit function to close both dialogs and refresh the page
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
          description: result.message,
        })

        // Call the onSuccess callback if provided
        if (onSuccess) {
          onSuccess(selectedDepartment)
        }

        // Close this dialog
        onOpenChange(false)

        // Refresh the page to show the updated department
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update primary department",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/80" />
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Select Primary Department</DialogTitle>
          <DialogDescription className="text-gray-300">
            We found multiple departments in your Discord roles. Please select your primary department.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedDepartment} onValueChange={setSelectedDepartment} className="space-y-3">
            {departments.map((dept) => (
              <div key={dept} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={dept} id={`dept-${dept}`} className="border-gray-500 text-blue-400" />
                <Label htmlFor={`dept-${dept}`} className="cursor-pointer text-gray-200">
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
            className="bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedDepartment}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
