"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
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
import { Loader2, Plus, Trash2, GripVertical, ArrowUp, ArrowDown, Users, Shield, Info } from "lucide-react"
import { createTemplate, updateTemplate } from "@/app/actions/template"
import { fetchDiscordRoleName } from "@/app/actions/discord"

// Define department options
const DEPARTMENTS = ["WHITELIST", "CIV", "FIRE", "BSO", "FHP", "FWC", "MPD", "MEDIA", "COMMS"]

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
  isDiscordIdField?: boolean
}

interface ReviewBoardMember {
  id: number
  name: string
  discordId?: string | null
}

interface TemplateFormProps {
  template?: {
    id: number
    departmentId: string
    name: string
    description: string | null
    active: boolean
    requiresInterview: boolean
    questions: {
      id: number
      questionText: string
      questionType: string
      required: boolean
      order: number
      options: string[] | null
      isDiscordIdField: boolean
    }[]
    reviewBoard?: {
      id: number
      members: {
        id: number
        name: string
        discordId?: string | null
      }[]
      discordRoleIds: string | null
    }
  }
}

export function TemplateForm({ template }: TemplateFormProps) {
  const [name, setName] = useState(template?.name || "")
  const [departmentId, setDepartmentId] = useState(template?.departmentId || "")
  const [description, setDescription] = useState(template?.description || "")
  const [active, setActive] = useState(template?.active ?? true)
  const [requiresInterview, setRequiresInterview] = useState(template?.requiresInterview ?? false)
  const [questions, setQuestions] = useState<Question[]>(
    template?.questions || [
      {
        questionText: "Discord ID",
        questionType: "text",
        required: true,
        order: 0,
        options: null,
        isDiscordIdField: true,
      },
    ],
  )
  const [reviewBoardMembers, setReviewBoardMembers] = useState<ReviewBoardMember[]>(
    template?.reviewBoard?.members || [],
  )
  const [discordRoleIds, setDiscordRoleIds] = useState<string[]>(
    template?.reviewBoard?.discordRoleIds ? template?.reviewBoard?.discordRoleIds.split(",") : [],
  )
  const [newDiscordRoleId, setNewDiscordRoleId] = useState("")
  const [discordRoleNames, setDiscordRoleNames] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<ReviewBoardMember[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Effect to load Discord role names when component mounts
  useEffect(() => {
    const loadDiscordRoleNames = async () => {
      const roleNames: Record<string, string> = {}

      for (const roleId of discordRoleIds) {
        try {
          const name = await fetchDiscordRoleName(roleId)
          roleNames[roleId] = name
        } catch (error) {
          console.error(`Error fetching role name for ${roleId}:`, error)
          roleNames[roleId] = "Unknown Role"
        }
      }

      setDiscordRoleNames(roleNames)
    }

    if (discordRoleIds.length > 0) {
      loadDiscordRoleNames()
    }
  }, [discordRoleIds])

  // Effect to search for users when searchTerm changes
  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        // Using the existing users endpoint with search parameter
        const response = await fetch(`/api/users?search=${encodeURIComponent(searchTerm)}&limit=5`)
        if (response.ok) {
          const data = await response.json()
          // Handle both response formats: array or object with users property
          const users = Array.isArray(data) ? data : data.users || []

          // Filter out users who are already in the review board
          setSearchResults(
            users.filter((user: ReviewBoardMember) => !reviewBoardMembers.some((member) => member.id === user.id)),
          )
        } else {
          console.error("Error searching users:", await response.text())
          setSearchResults([])
        }
      } catch (error) {
        console.error("Error searching users:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        searchUsers()
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, reviewBoardMembers])

  // Function to fetch Discord role name
  const getDiscordRoleName = useCallback(
    async (roleId: string) => {
      if (discordRoleNames[roleId]) return discordRoleNames[roleId] // Check if already cached

      try {
        const roleName = await fetchDiscordRoleName(roleId)
        setDiscordRoleNames((prev) => ({ ...prev, [roleId]: roleName })) // Cache the role name
        return roleName
      } catch (error) {
        console.error("Error fetching Discord role name:", error)
        return "Unknown Role"
      }
    },
    [discordRoleNames],
  )

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
    newQuestions[targetIndex].order = currentOrder

    // Swap positions in array
    ;[newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]]

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

  const addReviewBoardMember = (member: ReviewBoardMember) => {
    if (!reviewBoardMembers.some((m) => m.id === member.id)) {
      setReviewBoardMembers([...reviewBoardMembers, member])
      setSearchResults(searchResults.filter((result) => result.id !== member.id))
      setSearchTerm("")
    }
  }

  const removeReviewBoardMember = (memberId: number) => {
    setReviewBoardMembers(reviewBoardMembers.filter((member) => member.id !== memberId))
  }

  const handleAddDiscordRoleId = async () => {
    if (newDiscordRoleId.trim() === "") return

    // Validate Discord role ID format (must be numeric)
    if (!/^\d+$/.test(newDiscordRoleId)) {
      toast({
        title: "Validation Error",
        description: `Invalid Discord role ID: ${newDiscordRoleId}. Must be numeric.`,
        variant: "destructive",
      })
      return
    }

    // Check if the role ID is already added
    if (discordRoleIds.includes(newDiscordRoleId)) {
      toast({
        title: "Validation Error",
        description: `Discord role ID ${newDiscordRoleId} is already added.`,
        variant: "destructive",
      })
      return
    }

    // Fetch the role name and add the role ID to the list
    try {
      const roleName = await getDiscordRoleName(newDiscordRoleId)
      setDiscordRoleNames((prev) => ({ ...prev, [newDiscordRoleId]: roleName }))
      setDiscordRoleIds([...discordRoleIds, newDiscordRoleId])
      setNewDiscordRoleId("")
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch Discord role name for ID ${newDiscordRoleId}. Please ensure the ID is valid.`,
        variant: "destructive",
      })
    }
  }

  const handleRemoveDiscordRoleId = (roleId: string) => {
    setDiscordRoleIds(discordRoleIds.filter((id) => id !== roleId))
    setDiscordRoleNames((prev) => {
      const { [roleId]: removed, ...rest } = prev
      return rest
    })
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

    // Check if Discord ID field exists
    const hasDiscordIdField = visibleQuestions.some((q) => q.isDiscordIdField)
    if (!hasDiscordIdField) {
      toast({
        title: "Validation Error",
        description: "A Discord ID field is required.",
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
          requiresInterview,
          questions: visibleQuestions,
          deletedQuestionIds: questions.filter((q) => q.id && q.isDeleted).map((q) => q.id!),
          reviewBoard: {
            memberIds: reviewBoardMembers.map((member) => member.id),
            discordRoleIds: discordRoleIds.join(",").trim() ? discordRoleIds.join(",") : null,
          },
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
          requiresInterview,
          questions: visibleQuestions,
          reviewBoard: {
            memberIds: reviewBoardMembers.map((member) => member.id),
            discordRoleIds: discordRoleIds.join(",").trim() ? discordRoleIds.join(",") : null,
          },
        })

        toast({
          title: "Template Created",
          description: "The application template has been created successfully.",
        })
      }

      // Check if we're in review board or rnr path and redirect accordingly
      const path = window.location.pathname
      const redirectBase = path.includes("/reviewboard/")
        ? "/reviewboard/applications/templates"
        : "/rnr/applications/templates"
      router.push(redirectBase)
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

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch id="active" checked={active} onCheckedChange={setActive} disabled={isSubmitting} />
                <Label htmlFor="active">Active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="requiresInterview"
                  checked={requiresInterview}
                  onCheckedChange={setRequiresInterview}
                  disabled={isSubmitting}
                />
                <Label htmlFor="requiresInterview">Requires Interview</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Board Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Review Board</h3>

          <div className="space-y-4">
            {/* Discord Role IDs Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="newDiscordRoleId">Discord Role IDs ({discordRoleIds.length})</Label>
                {discordRoleIds.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {discordRoleIds.length} role{discordRoleIds.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="newDiscordRoleId"
                  type="number"
                  value={newDiscordRoleId}
                  onChange={(e) => setNewDiscordRoleId(e.target.value)}
                  placeholder="Enter Discord Role ID and press Enter"
                  disabled={isSubmitting}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddDiscordRoleId()
                    }
                  }}
                />
                <Button type="button" size="sm" onClick={handleAddDiscordRoleId} disabled={isSubmitting}>
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter Discord role IDs from the main Discord server that should have access to review these applications
              </p>

              {/* Display Added Discord Role IDs */}
              {discordRoleIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {discordRoleIds.map((roleId) => (
                    <Badge key={roleId} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                      {discordRoleNames[roleId] || roleId}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => handleRemoveDiscordRoleId(roleId)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-3 w-3 text-gray-400" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              {discordRoleIds.length === 0 && <div className="text-sm text-gray-400 mt-2">No Discord roles added</div>}
            </div>

            {/* Review Board Members Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="memberSearch">Add Review Board Members</Label>
                {reviewBoardMembers.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {reviewBoardMembers.length} member{reviewBoardMembers.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="memberSearch"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or Discord ID (min 2 characters)..."
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Type at least 2 characters to search for users by name or Discord ID
              </p>
            </div>

            {/* Search Results */}
            {isSearching && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-400">Searching...</span>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-md p-2">
                <p className="text-xs text-gray-400 mb-2">Search Results:</p>
                <div className="space-y-1">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-md cursor-pointer"
                      onClick={() => addReviewBoardMember(user)}
                    >
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                        {user.discordId && <span className="text-xs text-gray-400">Discord ID: {user.discordId}</span>}
                      </div>
                      <Plus className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isSearching && searchTerm.length >= 2 && searchResults.length === 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-md p-2">
                <p className="text-xs text-gray-400">No users found matching "{searchTerm}"</p>
              </div>
            )}

            {/* Selected Members */}
            <div className="space-y-2">
              <Label>Selected Review Board Members ({reviewBoardMembers.length})</Label>
              {reviewBoardMembers.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {reviewBoardMembers.map((member) => (
                    <Badge key={member.id} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                      <div className="flex items-center">
                        <span>{member.name}</span>
                        {member.discordId && (
                          <div className="ml-1 group relative">
                            <Info className="h-3 w-3 text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Discord ID: {member.discordId}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeReviewBoardMember(member.id)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-3 w-3 text-gray-400" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No members selected</p>
              )}
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
                      disabled={index === 0 || isSubmitting || question.isDiscordIdField}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveQuestion(index, "down")}
                      disabled={
                        index === questions.filter((q) => !q.isDeleted).length - 1 ||
                        isSubmitting ||
                        question.isDiscordIdField
                      }
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(index)}
                      disabled={isSubmitting || question.isDiscordIdField}
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
                        disabled={isSubmitting || question.isDiscordIdField}
                      />
                      {question.isDiscordIdField && (
                        <p className="text-xs text-blue-400">This is a required Discord ID field</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`question-type-${index}`}>Question Type</Label>
                      <Select
                        value={question.questionType}
                        onValueChange={(value) => updateQuestion(index, "questionType", value)}
                        disabled={isSubmitting || question.isDiscordIdField}
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
                      disabled={isSubmitting || question.isDiscordIdField}
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
        <Link href="/reviewboard/applications/templates">
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
