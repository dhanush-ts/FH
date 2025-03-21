"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PlusCircle, Pencil, Trash2, Save, X, GraduationCap, Building, Clock, Award, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner" // Added toast import
import { useMediaQuery } from "@/hooks/use-media-query"

// Import API functions
import { fetchData, createData, updateData, deleteData } from "@/lib/api"

export default function EducationTimeline() {
  // State for education entries
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [activeEntryId, setActiveEntryId] = useState(null)
  const [visibleEntries, setVisibleEntries] = useState([])
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Form state
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    start_year: "",
    end_year: "",
    grade: "",
  })

  // Refs for scrolling
  const formRef = useRef(null)
  const timelineRef = useRef(null)
  const entryRefs = useRef({})

  // Fetch education data on component mount
  useEffect(() => {
    const getEducationData = async () => {
      try {
        setLoading(true)
        const data = await fetchData("user/education/")
        // Sort by start_year (oldest first)
        setEntries(data.sort((a, b) => -a.start_year + b.start_year))
      } catch (error) {
        console.error("Failed to fetch education data:", error)
        toast("Failed to load education data")
      } finally {
        setLoading(false)
      }
    }

    getEducationData()
  }, [])

  // Scroll to form when it appears
  useEffect(() => {
    if ((isAddingNew || editingId) && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }, [isAddingNew, editingId])

  // Set up intersection observer for timeline items
  useEffect(() => {
    if (!timelineRef.current || entries.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleEntries((prev) => {
              if (!prev.includes(entry.target.dataset.id)) {
                return [...prev, entry.target.dataset.id]
              }
              return prev
            })
          }
        })
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" },
    )

    // Create refs for each entry and observe them
    setTimeout(() => {
      entries.forEach((entry) => {
        const element = document.getElementById(`timeline-item-${entry.id}`)
        if (element) {
          entryRefs.current[entry.id] = element
          observer.observe(element)
        }
      })
    }, 100)

    return () => {
      Object.values(entryRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [entries, loading])

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? Number.parseInt(value) : "") : value,
    }))
  }

  const resetForm = () => {
    setFormData({
      degree: "",
      institution: "",
      start_year: "",
      end_year: "",
      grade: "",
    })
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      setActionLoading(true)
      // Convert form data keys to match API expectations
      const apiData = {
        degree: formData.degree,
        institution: formData.institution,
        start_year: formData.start_year,
        end_year: formData.end_year || null,
        grade: formData.grade,
      }

      const newEducation = await createData("user/education/", apiData)

      // Convert API response keys to match component expectations
      const formattedEducation = {
        ...newEducation,
        start_year: newEducation.start_year,
        end_year: newEducation.end_year,
      }

      setEntries((prev) => [...prev, formattedEducation].sort((a, b) => a.start_year - b.start_year))
      setIsAddingNew(false)
      resetForm()
      toast("Education added successfully")
    } catch (error) {
      toast("Error adding education")
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingId) return

    try {
      setActionLoading(true)
      // Convert form data keys to match API expectations
      const apiData = {
        degree: formData.degree,
        institution: formData.institution,
        start_year: formData.start_year,
        end_year: formData.end_year || null,
        grade: formData.grade || "",
      }

      const updatedEducation = await updateData(`user/education/${editingId}/`, apiData)

      // Convert API response keys to match component expectations
      const formattedEducation = {
        ...updatedEducation,
        start_year: updatedEducation.start_year,
        end_year: updatedEducation.end_year,
      }

      setEntries((prev) =>
        prev
          .map((item) => (item.id === formattedEducation.id ? formattedEducation : item))
          .sort((a, b) => a.start_year - b.start_year),
      )
      setEditingId(null)
      resetForm()
      toast("Education updated successfully")
    } catch (error) {
      toast("Error updating education")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setActionLoading(true)
      await deleteData(`user/education/${id}/`)
      setEntries((prev) => prev.filter((item) => item.id !== id))
      toast("Education deleted successfully")
    } catch (error) {
      toast("Error deleting education")
    } finally {
      setActionLoading(false)
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

  const cancelForm = () => {
    resetForm()
    setIsAddingNew(false)
    setEditingId(null)
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleCardHover = (id) => {
    setActiveEntryId(id)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const mobileItemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const formVariants = {
    hidden: { opacity: 0, height: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      height: "auto",
      scale: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  }

  const cardVariants = {
    initial: {
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    active: {
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
  }

  const mobileCardVariants = {
    initial: {
      scale: 1,
      opacity: 1, // Ensure cards are visible initially
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    hover: {
      scale: 1.01,
      boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.1), 0 8px 8px -5px rgba(0, 0, 0, 0.04)",
    },
    visible: {
      scale: [0.98, 1.01, 1],
      opacity: 1, // Ensure cards are visible when "visible"
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const iconVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  }

  const timelineDotVariants = {
    initial: {
      scale: 1,
      backgroundColor: "var(--primary)",
    },
    hover: {
      scale: 1.2,
      backgroundColor: "var(--primary)",
      boxShadow: "0 0 0 4px rgba(var(--primary-rgb), 0.3)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const mobileDotVariants = {
    initial: {
      scale: 1,
      opacity: 1, // Ensure dots are visible initially
      backgroundColor: "var(--primary)",
    },
    animate: {
      scale: [1, 1.2, 1],
      opacity: 1, // Ensure dots remain visible during animation
      boxShadow: [
        "0 0 0 0px rgba(var(--primary-rgb), 0.3)",
        "0 0 0 4px rgba(var(--primary-rgb), 0.3)",
        "0 0 0 2px rgba(var(--primary-rgb), 0.3)",
      ],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 2,
      },
    },
    visible: {
      opacity: 1, // Ensure dots are visible when "visible"
      scale: [0.5, 1.2, 1],
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Educational History
          </h2>
        </div>

        <div className="animate-pulse space-y-12">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-40 bg-gray-100 dark:bg-gray-800 rounded-xl ${i % 2 === 0 ? "ml-0 md:ml-[10%]" : "ml-0 md:mr-[10%]"}`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <motion.div
            initial="initial"
            whileHover="hover"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
          >
            <GraduationCap className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 text-lg font-semibold">
            Educational Journey
          </span>
        </h2>

        {!isAddingNew && !editingId && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsAddingNew(true)}
              className="bg-primary hover:bg-primary/90 text-white rounded-md px-5 shadow-md"
              disabled={actionLoading}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Education
            </Button>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(isAddingNew || editingId) && (
          <motion.div
            ref={formRef}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </motion.div>
                  {editingId ? "Edit Education" : "Add New Education"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {editingId ? "Update your educational details" : "Enter your educational details"}
                </p>
              </div>

              <form onSubmit={editingId ? handleEditSubmit : handleAddSubmit}>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution" className="text-sm font-medium">
                      Institution <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      placeholder="e.g. Stanford University"
                      required
                      className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="degree" className="text-sm font-medium">
                      Degree <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="degree"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      placeholder="e.g. Bachelor of Science in Computer Science"
                      required
                      className="w-full rounded-lg"
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
                        value={formData.start_year || ""}
                        onChange={handleInputChange}
                        placeholder="e.g. 2018"
                        required
                        className="w-full rounded-lg"
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
                        value={formData.end_year || ""}
                        onChange={handleInputChange}
                        placeholder="Leave blank if current"
                        className="w-full rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade" className="text-sm font-medium">
                      Grade <span className="text-gray-400 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="grade"
                      name="grade"
                      type="number"
                      value={formData.grade || ""}
                      onChange={handleInputChange}
                      placeholder="Grade (1-10)"
                      className="w-full rounded-lg"
                      max={"10"}
                      min={"1"}
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelForm}
                      disabled={actionLoading}
                      className="flex items-center gap-1 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      type="submit"
                      disabled={actionLoading}
                      className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1 rounded-lg"
                    >
                      <Save className="h-4 w-4" />
                      {actionLoading ? "Saving..." : "Save"}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {entries.length === 0 && !isAddingNew && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center shadow-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <GraduationCap className="h-16 w-16 mx-auto text-primary/60 mb-4" />
          </motion.div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No education history</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Add your educational background to showcase your qualifications and academic journey.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsAddingNew(true)}
              className="bg-primary hover:bg-primary/90 text-white rounded-md px-6 py-2 shadow-md"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Timeline */}
      {entries.length > 0 && !isAddingNew && !editingId && (
        <div className="relative" ref={timelineRef}>
          {/* Desktop Timeline */}
          {!isMobile && (
            <>
              {/* Timeline line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/10 via-primary/50 to-primary/10 transform -translate-x-1/2 hidden md:block" />

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-16 md:space-y-24"
              >
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    variants={itemVariants}
                    id={`timeline-item-${entry.id}`}
                    data-id={entry.id}
                    className={`relative group timeline-item ${index % 2 === 0 ? "md:pr-[5%]" : "md:pl-[5%] md:flex md:justify-end"}`}
                    onMouseEnter={() => handleCardHover(entry.id)}
                    onMouseLeave={() => handleCardHover(null)}
                  >
                    {/* Timeline dot */}
                    <motion.div
                      variants={timelineDotVariants}
                      initial="initial"
                      whileHover="hover"
                      animate={activeEntryId === entry.id ? "hover" : "initial"}
                      className="absolute left-1/2 w-10 h-10 bg-primary rounded-full items-center justify-center transform -translate-x-1/2 z-10 hidden md:flex shadow-md"
                    >
                      <motion.div variants={iconVariants} initial="initial" whileHover="hover">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </motion.div>
                    </motion.div>

                    {/* Year indicator for desktop */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className={`hidden md:block absolute top-0 ${index % 2 === 0 ? "right-1/3" : "left-1/3"}`}
                    >
                      <div
                        className={`font-bold text-lg px-3 py-1 rounded-full ${index % 2 === 0 ? "bg-primary/10 text-primary" : "bg-primary text-white"} flex items-center gap-1 shadow-sm`}
                      >
                        <Calendar className="w-4 h-4" />
                        {entry.start_year}
                      </div>
                    </motion.div>

                    <motion.div
                      variants={cardVariants}
                      initial="initial"
                      whileHover="hover"
                      animate={activeEntryId === entry.id ? "active" : "initial"}
                      className={cn(
                        "bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700",
                        expandedId === entry.id ? "ring-2 ring-primary shadow-xl" : "shadow-md",
                        "md:max-w-[45%] md:w-[45%]",
                        index % 2 === 0 ? "ml-0" : "mr-0",
                      )}
                      style={{
                        background:
                          index % 2 === 0
                            ? "linear-gradient(to right, rgba(var(--primary-rgb), 0.03), rgba(var(--primary-rgb), 0.08))"
                            : "linear-gradient(to left, rgba(var(--primary-rgb), 0.03), rgba(var(--primary-rgb), 0.08))",
                      }}
                    >
                      <div className="p-6 relative">
                        {/* Mobile year indicator */}
                        <div className="md:hidden mb-3">
                          <div className="font-bold text-sm px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1 w-auto">
                            <Calendar className="w-3 h-3" />
                            {entry.start_year} - {entry.end_year || "Present"}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => startEdit(entry)}
                              disabled={actionLoading || isAddingNew || !!editingId}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </motion.div>

                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                              onClick={() => handleDelete(entry.id)}
                              disabled={actionLoading || isAddingNew || !!editingId}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </motion.div>
                        </div>

                        <div className="mb-4">
                          <motion.h3
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2"
                          >
                            {entry.degree}
                          </motion.h3>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex items-center text-gray-600 dark:text-gray-400 mb-3"
                          >
                            <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
                              <Building className="h-5 w-5 mr-2 text-primary" />
                            </motion.div>
                            <span className="font-medium">{entry.institution}</span>
                          </motion.div>

                          <div className="hidden md:flex items-center text-sm text-gray-500 dark:text-gray-500 mb-3">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {entry.start_year} - {entry.end_year || "Present"}
                            </span>
                          </div>

                          {entry.grade && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                              className="flex items-center text-sm mb-2"
                            >
                              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary">
                                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                  <Award className="h-4 w-4" />
                                </motion.div>
                                <span className="font-medium">{entry.grade} GPA</span>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {/* Mobile Timeline */}
          {isMobile && (
            <div className="relative pl-8 md:hidden">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/10 via-primary/50 to-primary/10" />

              <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="visible" 
                className="space-y-12"
                style={{ opacity: 1 }} // Force opacity to be visible
              >
                {entries.map((entry, index) => {
                  const isVisible = visibleEntries.includes(entry.id) || true; // Force visibility

                  return (
                    <motion.div
                      key={entry.id}
                      variants={mobileItemVariants}
                      initial="hidden"
                      animate="visible" // Always use visible state
                      id={`timeline-item-${entry.id}`}
                      data-id={entry.id}
                      className="relative group"
                      onTouchStart={() => handleCardHover(entry.id)}
                      onTouchEnd={() => handleCardHover(null)}
                      style={{ opacity: 1 }} // Force opacity to be visible
                    >
                      {/* Timeline dot */}
                      <motion.div
                        variants={mobileDotVariants}
                        initial="initial"
                        animate="animate" // Always animate
                        className="absolute -left-4 top-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center transform -translate-x-1/2 z-10 shadow-md"
                        style={{ opacity: 1 }} // Force opacity to be visible
                      >
                        <motion.div
                          initial={{ scale: 1 }}
                          animate={{ scale: 1, rotate: [0, 360] }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <GraduationCap className="w-4 h-4 text-white" />
                        </motion.div>
                      </motion.div>

                      {/* Year bubble */}
                      <motion.div
                        initial={{ opacity: 1, y: 0, x: 0 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        className="absolute -left-4 top-10 transform -translate-x-1/2"
                      >
                        <div className="font-bold text-sm px-2 py-1 rounded-md bg-primary text-white flex items-center gap-1 shadow-md">
                          {entry.start_year}
                        </div>
                      </motion.div>

                      {/* Card */}
                      <motion.div
                        variants={mobileCardVariants}
                        initial="initial"
                        whileTap="hover"
                        animate="visible" // Always use visible state
                        className={cn(
                          "bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700 shadow-md ml-4",
                          activeEntryId === entry.id && "ring-2 ring-primary shadow-xl",
                        )}
                        style={{
                          background: `linear-gradient(135deg, 
                            rgba(var(--primary-rgb), 0.03) 0%, 
                            rgba(var(--primary-rgb), 0.08) 50%, 
                            rgba(var(--primary-rgb), 0.03) 100%)`,
                          opacity: 1, // Force opacity to be visible
                        }}
                      >
                        <div className="p-5 relative">
                          {/* Action buttons */}
                          <div className="absolute top-3 right-3 flex gap-1">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => startEdit(entry)}
                                disabled={actionLoading}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                                onClick={() => handleDelete(entry.id)}
                                disabled={actionLoading}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </motion.div>
                          </div>

                          <div>
                            <motion.h3
                              initial={{ opacity: 1, y: 0 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 pr-16"
                            >
                              {entry.degree}
                            </motion.h3>

                            <motion.div
                              initial={{ opacity: 1, y: 0 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center text-gray-600 dark:text-gray-400 mb-2"
                            >
                              <Building className="h-4 w-4 mr-2 text-primary" />
                              <span className="font-medium">{entry.institution}</span>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 1, y: 0 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center text-sm text-gray-500 dark:text-gray-500 mb-2"
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              <span>
                                {entry.start_year} - {entry.end_year || "Present"}
                              </span>
                            </motion.div>

                            {entry.grade && (
                              <motion.div
                                initial={{ opacity: 1, scale: 1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center text-sm"
                              >
                                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary">
                                  <Award className="h-3.5 w-3.5" />
                                  <span className="font-medium">{entry.grade} GPA</span>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* Add CSS for timeline animations */}
      <style jsx global>{`
        @media (min-width: 768px) {
          .timeline-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
          }
          
          .timeline-item-visible {
            opacity: 1 !important;
            transform: translateY(0);
          }
        }
        
        /* Force mobile timeline items to be visible */
        @media (max-width: 767px) {
          .timeline-item {
            opacity: 1 !important;
            transform: none !important;
          }
        }
        
        @media (prefers-reduced-motion) {
          .timeline-item {
            transition: opacity 0.5s ease;
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}
