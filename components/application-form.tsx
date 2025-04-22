"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { submitApplication } from "@/app/actions/application"
import { Loader2 } from "lucide-react"

interface ApplicationFormProps {
  template: {
    id: number
    name: string
    questions: {
      id: number
      questionText: string
      questionType: string
      required: boolean
      options: any | null
    }[]
  }
}

export function ApplicationForm({ template }: ApplicationFormProps) {
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [errors, setErrors] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (questionId: number, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))

    // Clear error if value is provided
    if (value.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (questionId: number, option: string, checked: boolean) => {
    const currentValues = responses[questionId]?.split(",") || []
    let newValues: string[]

    if (checked) {
      newValues = [...currentValues, option]
    } else {
      newValues = currentValues.filter((val) => val !== option)
    }

    setResponses((prev) => ({ ...prev, [questionId]: newValues.join(",") }))

    // Clear error if at least one option is selected
    if (newValues.length > 0) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<number, string> = {}
    let isValid = true

    template.questions.forEach((question) => {
      if (question.required) {
        const response = responses[question.id]

        if (!response || response.trim() === "") {
          newErrors[question.id] = "This field is required"
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Format responses for server action
      const formattedResponses = Object.entries(responses).map(([questionId, response]) => ({
        questionId: Number(questionId),
        response,
      }))

      await submitApplication(template.id, formattedResponses)

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
      })

      router.push("/applications")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while submitting your application.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6">
        <div className="space-y-6">
          {template.questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label htmlFor={`question-${question.id}`} className="text-base font-medium">
                {question.questionText}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>

              {question.questionType === "text" && (
                <Input
                  id={`question-${question.id}`}
                  value={responses[question.id] || ""}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className={errors[question.id] ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
              )}

              {question.questionType === "textarea" && (
                <Textarea
                  id={`question-${question.id}`}
                  value={responses[question.id] || ""}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className={`min-h-[100px] ${errors[question.id] ? "border-red-500" : ""}`}
                  disabled={isSubmitting}
                />
              )}

              {question.questionType === "select" && question.options && (
                <Select
                  value={responses[question.id] || ""}
                  onValueChange={(value) => handleInputChange(question.id, value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className={errors[question.id] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {question.options.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {question.questionType === "radio" && question.options && (
                <RadioGroup
                  value={responses[question.id] || ""}
                  onValueChange={(value) => handleInputChange(question.id, value)}
                  className="space-y-2"
                  disabled={isSubmitting}
                >
                  {question.options.map((option: string) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                      <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.questionType === "checkbox" && question.options && (
                <div className="space-y-2">
                  {question.options.map((option: string) => {
                    const currentValues = responses[question.id]?.split(",") || []
                    const isChecked = currentValues.includes(option)

                    return (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${question.id}-${option}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => handleCheckboxChange(question.id, option, checked === true)}
                          disabled={isSubmitting}
                        />
                        <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                      </div>
                    )
                  })}
                </div>
              )}

              {errors[question.id] && <p className="text-sm text-red-500">{errors[question.id]}</p>}
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/applications")} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Application
        </Button>
      </div>
    </form>
  )
}
