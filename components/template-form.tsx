"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react"
import { createTemplate, updateTemplate } from "@/app/actions/template"

// Define department options
const DEPARTMENTS = ["BSFR", "BSO", "MPD", "FHP", "COMMS", "FWC", "CIV", "RNR"]

// Define question types
const QUESTION_TYPES = [
  { value: "text", label: "Short Text" },
  { value: "textarea", label: "Long Text" },
  { value: "select", label: "Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkboxes" },
]

interface Question {
  id?: number
  questionText: string
  questionType: string
  required: boolean
  order: number
  options: string[] | null
  isNew?: boolean
  isDeleted?: boolean
}

interface TemplateFormProps {
  template?: {
    id: number
    departmentId: string
    name: string
    description: string | null
    active: boolean
    questions: {
      id: number
      questionText: string
      questionType: string
      required: boolean
      order: number
      options: string[] | null
    }[]
  }
}

export function TemplateForm({ template }: TemplateFormProps) {
  const [name, setName] = useState(template?.name || "")
  const [departmentId, setDepartmentId] = useState(template?.departmentId || "")
  const [description, setDescription] = useState(template?.description || "")
  const [active, setActive] = useState(template?.active ?? true)
  const [questions, setQuestions] = useState<Question[]>(
    template?.questions || [{ questionText: "", questionType: "text", required: true, order: 0, options: null }],
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "text",
        required: true,
        order: questions.length,
        options: null,
        isNew: true,
      },
    ])
  }

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions]

    if (newQuestions[index].id) {
      // Mark existing question as deleted instead of removing it
      newQuestions[index].isDeleted = true
    } else {
      // Remove new question completely
      newQuestions.splice(index, 1)
    }

    setQuestions(newQuestions)
  }

  const moveQuestion = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === questions.length - 1)) {
      return
    }

    const newQuestions = [...questions]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    // Swap order values
    const currentOrder = newQuestions[index].order
    newQuestions[index].order = newQuestions[targetIndex].order
    newQuestions[targetIndex].order = currentOrder[
      // Swap positions in array
      (newQuestions[index], newQuestions[targetIndex])
    ] = [newQuestions[targetIndex], newQuestions[index]]

    setQuestions(newQuestions)
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }

    // Reset options when changing question type
    if (field === "questionType") {
      if (["select", "radio", "checkbox"].includes(value)) {
        newQuestions[index].options = newQuestions[index].options || ["Option 1"]
      } else {
        newQuestions[index].options = null
      }
    }

    setQuestions(newQuestions)
  }

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions]
    const currentOptions = newQuestions[questionIndex].options || []
    newQuestions[questionIndex].options = [...currentOptions, `Option ${currentOptions.length + 1}`]
    setQuestions(newQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions]
    if (newQuestions[questionIndex].options) {
      newQuestions[questionIndex].options![optionIndex] = value
      setQuestions(newQuestions)
    }
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions]
    if (newQuestions[questionIndex].options) {
      newQuestions[questionIndex].options = newQuestions[questionIndex].options!.filter((_, i) => i !== optionIndex)
      setQuestions(newQuestions)
    }
  }

  const validateForm = () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Template name is required.",
        variant: "destructive",
      })
      return false
    }

    if (!departmentId) {
      toast({
        title: "Validation Error",
        description: "Department is required.",
        variant: "destructive",
      })
      return false
    }

    // Check if there are any visible questions
    const visibleQuestions = questions.filter((q) => !q.isDeleted)
    if (visibleQuestions.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one question is required.",
        variant: "destructive",
      })
      return false
    }

    // Validate each question
    for (let i = 0; i < visibleQuestions.length; i++) {
      const question = visibleQuestions[i]

      if (!question.questionText.trim()) {
        toast({
          title: "Validation Error",
          description: `Question ${i + 1} text is required.`,
          variant: "destructive",
        })
        return false
      }

      // Validate options for select, radio, checkbox
      if (["select", "radio", "checkbox"].includes(question.questionType)) {
        if (!question.options || question.options.length === 0) {
          toast({
            title: "Validation Error",
            description: `Question ${i + 1} requires at least one option.`,
            variant: "destructive",
          })
          return false
        }

        // Check for empty options
        for (let j = 0; j < question.options.length; j++) {
          if (!question.options[j].trim()) {
            toast({
              title: "Validation Error",
              description: `Question ${i + 1} has an empty option.`,
              variant: "destructive",
            })
            return false
          }
        }
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Filter out deleted questions and prepare data
      const visibleQuestions = questions
        .filter((q) => !q.isDeleted)
        .map((q, index) => ({
          ...q,
          order: index, // Ensure order is sequential
        }))

      if (template) {
        // Update existing template
        await updateTemplate({
          id: template.id,
          name,
          departmentId,
          description,
          active,
          questions: visibleQuestions,
          deletedQuestionIds: questions.filter((q) => q.id && q.isDeleted).map((q) => q.id!),
        })

        toast({
          title: "Template Updated",
          description: "The application template has been updated successfully.",
        })
      } else {
        // Create new template
        await createTemplate({
          name,
          departmentId,
          description,
          active,
          questions: visibleQuestions,
        })

        toast({
          title: "Template Created",
          description: "The application template has been created successfully.",
        })
      }

      router.push("/rnr/applications/templates")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., BSO Application"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={departmentId} onValueChange={setDepartmentId} disabled={isSubmitting}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a description of this application"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="active" checked={active} onCheckedChange={setActive} disabled={isSubmitting} />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Questions</h2>
        <Button type="button" onClick={addQuestion} variant="outline" size="sm" disabled={isSubmitting}>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      {questions.map(
        (question, index) =>
          !question.isDeleted && (
            <Card key={index} className="relative">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 absolute right-4 top-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveQuestion(index, "up")}
                      disabled={index === 0 || isSubmitting}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveQuestion(index, "down")}
                      disabled={index === questions.filter((q) => !q.isDeleted).length - 1 || isSubmitting}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(index)}
                      disabled={isSubmitting}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`question-${index}`}>Question Text</Label>
                      <Input
                        id={`question-${index}`}
                        value={question.questionText}
                        onChange={(e) => updateQuestion(index, "questionText", e.target.value)}
                        placeholder="Enter question text"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`question-type-${index}`}>Question Type</Label>
                      <Select
                        value={question.questionType}
                        onValueChange={(value) => updateQuestion(index, "questionType", value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id={`question-type-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {QUESTION_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`required-${index}`}
                      checked={question.required}
                      onCheckedChange={(checked) => updateQuestion(index, "required", checked)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor={`required-${index}`}>Required</Label>
                  </div>

                  {/* Options for select, radio, checkbox */}
                  {["select", "radio", "checkbox"].includes(question.questionType) && question.options && (
                    <div className="space-y-3">
                      <Label>Options</Label>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <Input
                            value={option}
                            onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                            disabled={isSubmitting}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(index, optionIndex)}
                            disabled={question.options!.length <= 1 || isSubmitting}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(index)}
                        disabled={isSubmitting}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Option
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ),
      )}

      <div className="flex justify-between">
        <Link href="/rnr/applications/templates">
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {template ? "Update Template" : "Create Template"}
        </Button>
      </div>
    </form>
  )
}
