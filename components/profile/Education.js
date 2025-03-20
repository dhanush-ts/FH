"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Save, X, Calendar, School, GraduationCap, BookOpen, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { fetchData, createData, updateData, deleteData } from "@/lib/api"

export default function Education() {
  const [loading, setLoading] = useState(true)
  const [educationList, setEducationList] = useState([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    start_year: new Date().getFullYear(),
    end_year: "",
    grade: "",
  })
  const newFormRef = useRef(null)
  const editFormRef = useRef(null)

  useEffect(() => {
    const getEducationData = async () => {
      try {
        setLoading(true)
        const data = await fetchData("user/education/")
        setEducationList(data)
      } catch (error) {
        toast("Error loading education data")
      } finally {
        setLoading(false)
      }
    }

    getEducationData()
  }, [])

  useEffect(() => {
    if (isAddingNew && newFormRef.current) {
      setTimeout(() => {
        newFormRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }

    if (editingId && editFormRef.current) {
      setTimeout(() => {
        editFormRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }, [isAddingNew, editingId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name.includes("year") ? Number.parseInt(value) || "" : value }))
  }

  const resetForm = () => {
    setFormData({
      degree: "",
      institution: "",
      start_year: new Date().getFullYear(),
      end_year: "",
      grade: "",
    })
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const newEducation = await createData("user/education/", formData)
      setEducationList((prev) => [...prev, newEducation])
      setIsAddingNew(false)
      resetForm()

      toast("Education added successfully")
    } catch (error) {
      toast("Error adding education")
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingId) return

    try {
      setLoading(true)
      const updatedEducation = await updateData(`user/education/${editingId}/`, formData)

      // Optimistically update UI
      setEducationList((prev) => prev.map((item) => (item.id === updatedEducation.id ? updatedEducation : item)))
      setEditingId(null)
      resetForm()

      toast("Education updated successfully")
    } catch (error) {
      toast("Error updating education")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      await deleteData(`user/education/${id}/`)

      // Optimistically update UI
      setEducationList((prev) => prev.filter((item) => item.id !== id))

      toast("Education deleted successfully")
    } catch (error) {
      toast("Error deleting education")
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (education) => {
    setFormData({
      degree: education.degree,
      institution: education.institution,
      start_year: education.start_year,
      end_year: education.end_year || "",
      grade: education.grade || "",
    })
    setEditingId(education.id)
  }

  const cancelEdit = () => {
    setEditingId(null)
    resetForm()
  }

  const cancelAdd = () => {
    setIsAddingNew(false)
    resetForm()
  }

  if (loading && educationList.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-primary" />
            Education
          </h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    )
  }

  // Animation variants
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const formVariants = {
    hidden: { opacity: 0, y: -20, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        duration: 0.4,
        height: { duration: 0.4 },
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      height: 0,
      transition: {
        duration: 0.3,
        height: { duration: 0.3 },
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <BookOpen className="h-6 w-6 mr-2 text-primary" />
          Education
        </h2>

        {!isAddingNew && (
          <Button
            onClick={() => setIsAddingNew(true)}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
            disabled={isAddingNew || editingId !== null}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        )}
      </div>

      {/* Add New Education Form */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            ref={newFormRef}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <Card className="border-2 border-primary/20 shadow-lg bg-white dark:bg-gray-800">
              <CardHeader className="bg-primary/5 dark:bg-primary/10">
                <CardTitle className="text-xl flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                  Add New Education
                </CardTitle>
                <CardDescription>Enter your educational background details</CardDescription>
              </CardHeader>

              <form onSubmit={handleAddSubmit}>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="degree" className="text-sm font-medium">
                      Degree/Qualification <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="degree"
                      name="degree"
                      placeholder="B.E. Computer Science"
                      value={formData.degree}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution" className="text-sm font-medium">
                      Institution <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="institution"
                      name="institution"
                      placeholder="University/School Name"
                      value={formData.institution}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_year" className="text-sm font-medium">
                        Start Year <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="start_year"
                        name="start_year"
                        type="number"
                        placeholder="2020"
                        value={formData.start_year || ""}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_year" className="text-sm font-medium">
                        End Year <span className="text-gray-400 text-xs">(Optional)</span>
                      </Label>
                      <Input
                        id="end_year"
                        name="end_year"
                        type="number"
                        placeholder="2024 or leave blank for present"
                        value={formData.end_year || ""}
                        onChange={handleChange}
                        className="border-gray-300 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade" className="text-sm font-medium">
                      Grade/CGPA <span className="text-gray-400 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="grade"
                      name="grade"
                      placeholder="8.5"
                      value={formData.grade || ""}
                      onChange={handleChange}
                      className="border-gray-300 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between p-6 pt-0">
                  <Button type="button" variant="outline" onClick={cancelAdd} className="border-gray-300">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {educationList.length === 0 && !isAddingNew ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-white dark:bg-gray-800 shadow-sm"
          >
            <GraduationCap className="h-16 w-16 text-primary/30 mb-4" />
            <p className="text-muted-foreground text-center max-w-md">
              No education details added yet. Click the "Add Education" button to add your educational background.
            </p>
          </motion.div>
        ) : (
          <motion.div className="grid gap-6" variants={containerVariants} initial="hidden" animate="visible">
            {educationList.map((education) => (
              <AnimatePresence key={education.id} mode="wait">
                {editingId === education.id ? (
                  <motion.div
                    ref={editFormRef}
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="overflow-hidden"
                  >
                    <Card className="border-2 border-primary/20 shadow-lg bg-white dark:bg-gray-800">
                      <CardHeader className="bg-primary/5 dark:bg-primary/10">
                        <CardTitle className="text-xl flex items-center">
                          <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                          Edit Education
                        </CardTitle>
                        <CardDescription>Update your educational background details</CardDescription>
                      </CardHeader>

                      <form onSubmit={handleEditSubmit}>
                        <CardContent className="p-6 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`edit-degree-${education.id}`} className="text-sm font-medium">
                              Degree/Qualification <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`edit-degree-${education.id}`}
                              name="degree"
                              value={formData.degree || ""}
                              onChange={handleChange}
                              required
                              className="border-gray-300 focus:ring-primary focus:border-primary"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`edit-institution-${education.id}`} className="text-sm font-medium">
                              Institution <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`edit-institution-${education.id}`}
                              name="institution"
                              value={formData.institution || ""}
                              onChange={handleChange}
                              required
                              className="border-gray-300 focus:ring-primary focus:border-primary"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`edit-start_year-${education.id}`} className="text-sm font-medium">
                                Start Year <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id={`edit-start_year-${education.id}`}
                                name="start_year"
                                type="number"
                                value={formData.start_year || ""}
                                onChange={handleChange}
                                required
                                className="border-gray-300 focus:ring-primary focus:border-primary"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-end_year-${education.id}`} className="text-sm font-medium">
                                End Year <span className="text-gray-400 text-xs">(Optional)</span>
                              </Label>
                              <Input
                                id={`edit-end_year-${education.id}`}
                                name="end_year"
                                type="number"
                                placeholder="Leave blank for present"
                                value={formData.end_year || ""}
                                onChange={handleChange}
                                className="border-gray-300 focus:ring-primary focus:border-primary"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`edit-grade-${education.id}`} className="text-sm font-medium">
                              Grade/CGPA <span className="text-gray-400 text-xs">(Optional)</span>
                            </Label>
                            <Input
                              id={`edit-grade-${education.id}`}
                              name="grade"
                              value={formData.grade || ""}
                              onChange={handleChange}
                              className="border-gray-300 focus:ring-primary focus:border-primary"
                            />
                          </div>
                        </CardContent>

                        <CardFooter className="flex justify-between p-6 pt-0">
                          <Button type="button" variant="outline" onClick={cancelEdit} className="border-gray-300">
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Updating..." : "Update"}
                          </Button>
                        </CardFooter>
                      </form>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div variants={itemVariants} className="group" layout>
                    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 group-hover:translate-y-[-2px]">
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                        <div>
                          <CardTitle className="text-xl font-bold">{education.degree}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <School className="h-4 w-4 mr-1 text-primary" />
                            {education.institution}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEdit(education)}
                            className="rounded-full opacity-70 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                            disabled={isAddingNew || editingId !== null}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Calendar className="h-4 w-4 mr-1 text-primary/70" />
                          <span>
                            {education.start_year} - {education.end_year || "Present"}
                          </span>
                        </div>
                        {education.grade && (
                          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            Grade: {education.grade}
                          </div>
                        )}

                        <motion.div
                          className="mt-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(education)}
                            className="text-xs"
                            disabled={isAddingNew || editingId !== null}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(education.id)}
                            className="text-xs"
                            disabled={isAddingNew || editingId !== null}
                          >
                            Delete
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

