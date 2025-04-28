"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  User,
  Settings,
  Save,
  HelpCircle,
  Mail,
  Phone,
  Github,
  Linkedin,
  Plus,
  Trash2,
  GripVertical,
  Type,
  AlignLeft,
  ListChecks,
  CheckSquare,
} from "lucide-react"
import { fetchWithAuth } from "@/app/api"
import { v4 as uuidv4 } from "uuid"

const DEFAULT_QUESTIONS = [
  {
    id: "name",
    label: "Name",
    description: "Collect the participant's full name",
    icon: User,
  },
  {
    id: "email",
    label: "Email",
    description: "Collect the participant's email address",
    icon: Mail,
  },
  {
    id: "gender",
    label: "Gender",
    description: "Collect the participant's gender",
    icon: User,
  },
  {
    id: "phone",
    label: "Phone",
    description: "Collect the participant's phone number",
    icon: Phone,
  },
  {
    id: "github_url",
    label: "GitHub URL",
    description: "Collect the participant's GitHub profile URL",
    icon: Github,
  },
  {
    id: "linkedin_url",
    label: "LinkedIn URL",
    description: "Collect the participant's LinkedIn profile URL",
    icon: Linkedin,
  },
]

export function OnboardingQuestionsForm({ eventId, initialData }) {
  const router = useRouter()

  // Parse initial data
  const parseInitialData = () => {
    if (!initialData) {
      return {
        default_questions: ["Name", "Email", "Gender", "Phone", "Github URL", "LinkedIn URL"],
        custom_questions: [],
      }
    }
    return {
      ...initialData,
      default_questions: Array.isArray(initialData.default_questions) ? initialData.default_questions : [],
      custom_questions: Array.isArray(initialData.custom_questions) ? initialData.custom_questions : [],
    }
  }

  // Initial form data
  const defaultFormData = parseInitialData()

  // Store initial data in a ref to persist original values
  const originalDataRef = useRef({ ...defaultFormData })

  const [formData, setFormData] = useState(defaultFormData)
  const [activeTab, setActiveTab] = useState("default")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Track new questions separately from modified existing questions
  const [newQuestions, setNewQuestions] = useState([])
  const [modifiedQuestions, setModifiedQuestions] = useState([])
  const [deletedQuestions, setDeletedQuestions] = useState([])

  // Form setup
  const form = useForm({
    defaultValues: defaultFormData,
  })

  // Handle default questions changes
  const handleDefaultQuestionToggle = (questionLabel, isChecked) => {
    setFormData((prev) => {
      const updatedDefaultQuestions = Array.isArray(prev.default_questions) ? [...prev.default_questions] : []

      if (isChecked && !updatedDefaultQuestions?.includes(questionLabel)) {
        // Add the question
        updatedDefaultQuestions.push(questionLabel)
      } else if (!isChecked && updatedDefaultQuestions?.includes(questionLabel)) {
        // Remove the question
        const index = updatedDefaultQuestions.indexOf(questionLabel)
        updatedDefaultQuestions.splice(index, 1)
      }

      return {
        ...prev,
        default_questions: updatedDefaultQuestions,
      }
    })
  }

  // Create a new empty question
  const addQuestion = () => {
    const tempId = uuidv4()
    const newQuestion = {
      question: "",
      keyword: "",
      question_type: "Line",
      options: null,
      tempId, // Temporary ID for React keys
      isNew: true, // Flag to identify new questions
    }

    // Add to UI
    setFormData((prev) => ({
      ...prev,
      custom_questions: [...prev.custom_questions, newQuestion],
    }))

    // Track this new question separately
    setNewQuestions((prev) => [
      ...prev,
      {
        tempId,
        question: "",
        keyword: "",
        question_type: "Line",
        options: null,
      },
    ])
  }

  // Update a question field
  const updateQuestion = (index, field, value) => {
    setFormData((prev) => {
      const updatedQuestions = [...prev.custom_questions]
      const questionToUpdate = { ...updatedQuestions[index] }

      // Update the field
      questionToUpdate[field] = value

      // If changing question type, reset options if needed
      if (field === "question_type") {
        if (value === "Line" || value === "Text") {
          questionToUpdate.options = null
        } else if (!questionToUpdate.options) {
          questionToUpdate.options = []
        }
      }

      updatedQuestions[index] = questionToUpdate

      // Handle tracking changes differently for new vs existing questions
      if (questionToUpdate.isNew) {
        // Update in newQuestions array
        setNewQuestions((prev) => {
          return prev.map((q) => (q.tempId === questionToUpdate.tempId ? { ...q, [field]: value } : q))
        })
      } else if (questionToUpdate.id) {
        // Check if this question is already in our modified questions array
        const existingIndex = modifiedQuestions.findIndex((q) => q.id === questionToUpdate.id)

        if (existingIndex >= 0) {
          // Update existing entry
          setModifiedQuestions((prev) => {
            const updated = [...prev]
            updated[existingIndex] = {
              ...updated[existingIndex],
              [field]: value,
            }
            return updated
          })
        } else {
          // Add new entry to modified questions
          setModifiedQuestions((prev) => [
            ...prev,
            {
              id: questionToUpdate.id,
              question: questionToUpdate.question,
              keyword: questionToUpdate.keyword,
              question_type: questionToUpdate.question_type,
              options: questionToUpdate.options,
              [field]: value,
            },
          ])
        }
      }

      return {
        ...prev,
        custom_questions: updatedQuestions,
      }
    })
  }

  // Remove a question
  const removeQuestion = (index) => {
    setFormData((prev) => {
      const updatedQuestions = [...prev.custom_questions]
      const questionToRemove = updatedQuestions[index]

      // If it's an existing question (has an ID), add to deleted list
      if (questionToRemove.id && typeof questionToRemove.id === "number") {
        setDeletedQuestions((prev) => [...prev, { id: questionToRemove.id, question: null }])

        // Also remove from modified list if it was there
        setModifiedQuestions((prev) => prev.filter((q) => q.id !== questionToRemove.id))
      }
      // If it's a new question, remove from new questions list
      else if (questionToRemove.isNew) {
        setNewQuestions((prev) => prev.filter((q) => q.tempId !== questionToRemove.tempId))
      }

      updatedQuestions.splice(index, 1)

      return {
        ...prev,
        custom_questions: updatedQuestions,
      }
    })
  }

  const addOption = (questionIndex) => {
    setFormData((prev) => {
      const updatedQuestions = [...prev.custom_questions]
      const questionToUpdate = { ...updatedQuestions[questionIndex] }

      const currentOptions = Array.isArray(questionToUpdate.options) ? questionToUpdate.options : []

      // Add a new empty option
      questionToUpdate.options = [...currentOptions, ""]
      updatedQuestions[questionIndex] = questionToUpdate

      // Handle tracking changes differently for new vs existing questions
      if (questionToUpdate.isNew) {
        // Update in newQuestions array
        setNewQuestions((prev) => {
          return prev.map((q) =>
            q.tempId === questionToUpdate.tempId ? { ...q, options: questionToUpdate.options } : q,
          )
        })
      } else if (questionToUpdate.id) {
        // Check if this question is already in our modified questions array
        const existingIndex = modifiedQuestions.findIndex((q) => q.id === questionToUpdate.id)

        if (existingIndex >= 0) {
          // Update existing entry
          setModifiedQuestions((prev) => {
            const updated = [...prev]
            updated[existingIndex] = {
              ...updated[existingIndex],
              options: questionToUpdate.options,
            }
            return updated
          })
        } else {
          // Add new entry to modified questions
          setModifiedQuestions((prev) => [
            ...prev,
            {
              id: questionToUpdate.id,
              question: questionToUpdate.question,
              keyword: questionToUpdate.keyword,
              question_type: questionToUpdate.question_type,
              options: questionToUpdate.options,
            },
          ])
        }
      }

      return {
        ...prev,
        custom_questions: updatedQuestions,
      }
    })
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    setFormData((prev) => {
      const updatedQuestions = [...prev.custom_questions]
      const questionToUpdate = { ...updatedQuestions[questionIndex] }

      if (Array.isArray(questionToUpdate.options)) {
        const updatedOptions = [...questionToUpdate.options]
        updatedOptions[optionIndex] = value
        questionToUpdate.options = updatedOptions
      }

      updatedQuestions[questionIndex] = questionToUpdate

      // Handle tracking changes differently for new vs existing questions
      if (questionToUpdate.isNew) {
        // Update in newQuestions array
        setNewQuestions((prev) => {
          return prev.map((q) =>
            q.tempId === questionToUpdate.tempId ? { ...q, options: questionToUpdate.options } : q,
          )
        })
      } else if (questionToUpdate.id) {
        // Check if this question is already in our modified questions array
        const existingIndex = modifiedQuestions.findIndex((q) => q.id === questionToUpdate.id)

        if (existingIndex >= 0) {
          // Update existing entry
          setModifiedQuestions((prev) => {
            const updated = [...prev]
            updated[existingIndex] = {
              ...updated[existingIndex],
              options: questionToUpdate.options,
            }
            return updated
          })
        } else {
          // Add new entry to modified questions
          setModifiedQuestions((prev) => [
            ...prev,
            {
              id: questionToUpdate.id,
              question: questionToUpdate.question,
              keyword: questionToUpdate.keyword,
              question_type: questionToUpdate.question_type,
              options: questionToUpdate.options,
            },
          ])
        }
      }

      return {
        ...prev,
        custom_questions: updatedQuestions,
      }
    })
  }

  const removeOption = (questionIndex, optionIndex) => {
    setFormData((prev) => {
      const updatedQuestions = [...prev.custom_questions]
      const questionToUpdate = { ...updatedQuestions[questionIndex] }

      if (Array.isArray(questionToUpdate.options)) {
        const updatedOptions = [...questionToUpdate.options]
        updatedOptions.splice(optionIndex, 1)
        questionToUpdate.options = updatedOptions
      }

      updatedQuestions[questionIndex] = questionToUpdate

      // Handle tracking changes differently for new vs existing questions
      if (questionToUpdate.isNew) {
        // Update in newQuestions array
        setNewQuestions((prev) => {
          return prev.map((q) =>
            q.tempId === questionToUpdate.tempId ? { ...q, options: questionToUpdate.options } : q,
          )
        })
      } else if (questionToUpdate.id) {
        // Check if this question is already in our modified questions array
        const existingIndex = modifiedQuestions.findIndex((q) => q.id === questionToUpdate.id)

        if (existingIndex >= 0) {
          // Update existing entry
          setModifiedQuestions((prev) => {
            const updated = [...prev]
            updated[existingIndex] = {
              ...updated[existingIndex],
              options: questionToUpdate.options,
            }
            return updated
          })
        } else {
          // Add new entry to modified questions
          setModifiedQuestions((prev) => [
            ...prev,
            {
              id: questionToUpdate.id,
              question: questionToUpdate.question,
              keyword: questionToUpdate.keyword,
              question_type: questionToUpdate.question_type,
              options: questionToUpdate.options,
            },
          ])
        }
      }

      return {
        ...prev,
        custom_questions: updatedQuestions,
      }
    })
  }

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case "Line":
        return <Type className="h-4 w-4" />
      case "Text":
        return <AlignLeft className="h-4 w-4" />
      case "Dropdown":
        return <ListChecks className="h-4 w-4" />
      case "Checkbox":
        return <CheckSquare className="h-4 w-4" />
      default:
        return <Type className="h-4 w-4" />
    }
  }

  const removeDuplicates = (questions) => {
    const seen = new Set();
    return questions.filter(q => {
      if (seen.has(q.id)) return false;
      seen.add(q.id);
      return true;
    });
  };
  
  const prepareSubmissionData = () => {
    // Prepare new questions for submission (without tempId and isNew flag)
    const formattedNewQuestions = newQuestions.map(q => ({
      id: q.id,  // Ensure ID exists for deduplication
      question: q.question,
      keyword: q.keyword,
      question_type: q.question_type,
      options: q.options,
    }));
  
    // Remove duplicates from modified & deleted questions
    const uniqueQuestions = removeDuplicates(modifiedQuestions);
    const uniqueDeletedQuestions = removeDuplicates(deletedQuestions);
  
    // Combine all changes
    const allChanges = [...formattedNewQuestions, ...uniqueQuestions, ...uniqueDeletedQuestions];
  
    return {
      default_questions: formData.default_questions,
      custom_questions: allChanges,
    };
  };
  

  const onSubmit = async () => {
    setIsSubmitting(true)

    try {
      const dataToSubmit = prepareSubmissionData()
      console.log(dataToSubmit)
      const response = await fetchWithAuth(`/event-registration/host/onboarding-question/${eventId}/`, {
        method: "POST",
        body: JSON.stringify(dataToSubmit),
      })

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`)
      }
      const responseData = await response.json()

      originalDataRef.current = JSON.parse(JSON.stringify(responseData))
      // Reset all change tracking
      setNewQuestions([])
      setModifiedQuestions([])
      setDeletedQuestions([])

      // router.push(`/host/create/${eventId}/venue`)
    } catch (error) {
      console.error("Error saving questions:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mb-20">
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-green-800 flex items-center">
                <User className="mr-3 h-8 w-8 text-green-600" />
                Registration Questions
              </h1>
              <p className="mt-2 text-green-700 ml-11">Customize the questions for your event registration form</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <motion.div
            className="absolute -top-4 -right-4 h-20 w-20 bg-green-100 rounded-full z-0 opacity-70"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeatType: "reverse",
            }}
          />

          <Card className="p-6 border-green-100 shadow-lg bg-white/90 backdrop-blur-sm relative z-10 overflow-hidden">
            <motion.div
              className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full -translate-y-20 translate-x-20 z-0"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                ease: "linear",
              }}
            />

            <CardHeader>
              <CardTitle className="text-2xl text-green-800">Form Configuration</CardTitle>
              <CardDescription>Configure the questions that will appear on your registration form</CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger
                        value="default"
                        className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Default Questions
                      </TabsTrigger>
                      <TabsTrigger
                        value="custom"
                        className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Custom Questions
                      </TabsTrigger>
                    </TabsList>

                    {/* Default Questions Tab */}
                    <TabsContent value="default" className="mt-0">
                      <div className="space-y-6">
                        <div className="text-sm text-green-700 mb-4">
                          Select which default questions to include in your registration form.
                        </div>

                        <div className="space-y-4">
                          {DEFAULT_QUESTIONS?.map((question) => (
                            <motion.div
                              key={question.id}
                              variants={itemVariants}
                              className="flex items-center justify-between p-4 rounded-lg border border-green-100 bg-white hover:bg-green-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                  <question.icon className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <Label
                                    htmlFor={`default-${question.id}`}
                                    className="text-base font-medium text-green-800 flex items-center gap-2"
                                  >
                                    {question.label}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-green-800 text-white border-green-700">
                                        <p>{question.description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </Label>
                                </div>
                              </div>

                              <Checkbox
                                id={`default-${question.id}`}
                                checked={formData.default_questions?.includes(question.label)}
                                onCheckedChange={(checked) => handleDefaultQuestionToggle(question.label, checked)}
                                className="h-5 w-5 border-green-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="custom" className="mt-0">
                      <div className="space-y-6">
                        <div className="text-sm text-green-700 mb-4">
                          Create custom questions for your registration form. You can add different types of questions
                          like text fields, dropdowns, and checkboxes.
                        </div>

                        <AnimatePresence>
                          {formData.custom_questions?.map((question, index) => (
                            <motion.div
                              key={question.id || question.tempId || index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                              transition={{ duration: 0.3 }}
                              className="mb-4"
                            >
                              <Card className="border-green-100">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                      <div className="bg-green-100 p-2 rounded-full">
                                        <GripVertical className="h-5 w-5 text-green-600" />
                                      </div>
                                      <span className="font-medium text-green-800">Question {index + 1}</span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeQuestion(index)}
                                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <Label htmlFor={`question-${index}`} className="text-green-800 mb-1 block">
                                        Question Text
                                      </Label>
                                      <Input
                                        id={`question-${index}`}
                                        value={question.question || ""}
                                        onChange={(e) => updateQuestion(index, "question", e.target.value)}
                                        placeholder="Enter your question"
                                        className="border-green-200 focus-visible:ring-green-500"
                                      />
                                    </div>

                                    <div>
                                      <Label
                                        htmlFor={`keyword-${index}`}
                                        className="text-green-800 mb-1 block md:flex items-center gap-2"
                                      >
                                        Keyword
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-green-800 text-white border-green-700">
                                            <p>A short identifier for this question (used in data exports)</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </Label>
                                      <Input
                                        id={`keyword-${index}`}
                                        value={question.keyword || ""}
                                        onChange={(e) => updateQuestion(index, "keyword", e.target.value)}
                                        placeholder="e.g., Native, Graduation Year"
                                        maxLength={20}
                                        className="border-green-200 focus-visible:ring-green-500"
                                      />
                                    </div>
                                  </div>

                                  <div className="mb-4">
                                    <Label htmlFor={`type-${index}`} className="text-green-800 mb-1 block">
                                      Question Type
                                    </Label>
                                    <Select
                                      value={question.question_type || "Line"}
                                      onValueChange={(value) => updateQuestion(index, "question_type", value)}
                                    >
                                      <SelectTrigger
                                        id={`type-${index}`}
                                        className="border-green-200 focus:ring-green-500"
                                      >
                                        <SelectValue placeholder="Select question type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Line" className="flex items-center">
                                          <div className="flex items-center">
                                            <Type className="h-4 w-4 mr-2" />
                                            <span>Single Line Text</span>
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="Text">
                                          <div className="flex items-center">
                                            <AlignLeft className="h-4 w-4 mr-2" />
                                            <span>Multi-line Text</span>
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="Dropdown">
                                          <div className="flex items-center">
                                            <ListChecks className="h-4 w-4 mr-2" />
                                            <span>Dropdown</span>
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="Checkbox">
                                          <div className="flex items-center">
                                            <CheckSquare className="h-4 w-4 mr-2" />
                                            <span>Checkbox</span>
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {(question.question_type === "Dropdown" || question.question_type === "Checkbox") && (
                                    <div className="mt-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <Label className="text-green-800">Options</Label>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => addOption(index)}
                                          className="text-green-600 border-green-200 hover:bg-green-50"
                                        >
                                          <Plus className="h-4 w-4 mr-1" />
                                          Add Option
                                        </Button>
                                      </div>

                                      <div className="space-y-2">
                                        <AnimatePresence>
                                          {Array.isArray(question.options) &&
                                            question.options.length > 0 &&
                                            question.options.map((option, optionIndex) => (
                                              <motion.div
                                                key={`${index}-${optionIndex}`}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex items-center gap-2"
                                              >
                                                <Input
                                                  value={option || ""}
                                                  onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                                  placeholder={`Option ${optionIndex + 1}`}
                                                  className="border-green-200 focus-visible:ring-green-500"
                                                />
                                                <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="icon"
                                                  onClick={() => removeOption(index, optionIndex)}
                                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </motion.div>
                                            ))}
                                        </AnimatePresence>
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        <Button
                          type="button"
                          onClick={addQuestion}
                          className="w-full bg-green-100 text-green-800 hover:bg-green-200 border border-green-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Question
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <motion.div
                    className="flex justify-end pt-4"
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        onClick={onSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 group"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            <span>Saving...</span>
                          </div>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save & Continue
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  )
}
