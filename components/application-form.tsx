"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitApplication } from "@/app/actions/application"
import { toast } from "@/components/ui/use-toast"

interface ApplicationQuestion {
  id: number
  questionText: string
  questionType: string
  required: boolean
  order: number
  options?: any
}

interface ApplicationTemplate {
  id: number
  name: string
  description?: string | null
  questions: ApplicationQuestion[]
}

interface ApplicationFormProps {
  template: ApplicationTemplate
}

export function ApplicationForm({ template }: ApplicationFormProps) {
  const router = useRouter()
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (questionId: number, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleCheckboxChange = (questionId: number, option: string, checked: boolean) => {
    const currentValues = responses[questionId] ? responses[questionId].split(",") : []

    let newValues: string[]
    if (checked) {
      newValues = [...currentValues, option]
    } else {
      newValues = currentValues.filter((val) => val !== option)
    }

    setResponses((prev) => ({
      ...prev,
      [questionId]: newValues.join(","),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const missingRequired = template.questions
      .filter((q) => q.required)
      .filter((q) => !responses[q.id] || responses[q.id].trim() === "")
      .map((q) => q.questionText)

    if (missingRequired.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in the following required fields: ${missingRequired.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Format responses for submission
      const formattedResponses = Object.entries(responses).map(([questionId, response]) => ({
        questionId: Number(questionId),
        response,
      }))

      await submitApplication(template.id, formattedResponses)

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      })

      // Redirect to applications page
      router.push("/applications")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while submitting your application",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {template.questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {question.questionText}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {question.questionType === "text" && (
                <Input
                  value={responses[question.id] || ""}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  placeholder="Your answer"
                />
              )}

              {question.questionType === "textarea" && (
                <Textarea
                  value={responses[question.id] || ""}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  placeholder="Your answer"
                  rows={5}
                />
              )}

              {question.questionType === "select" && question.options && (
                <Select
                  value={responses[question.id] || ""}
                  onValueChange={(value) => handleInputChange(question.id, value)}
                >
                  <SelectTrigger>
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
                    const currentValues = responses[question.id] ? responses[question.id].split(",") : []
                    const isChecked = currentValues.includes(option)

                    return (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${question.id}-${option}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => handleCheckboxChange(question.id, option, checked === true)}
                        />
                        <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </form>
  )
}
