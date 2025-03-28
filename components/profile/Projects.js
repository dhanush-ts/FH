"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, Calendar, Link2, Code, Briefcase, Save, X, ExternalLink, Github, Globe, Clock, CheckCircle2, ChevronDown, ChevronUp, PlusCircle } from 'lucide-react'
import { CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { fetchWithAuth } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function Projects() {
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [projectList, setProjectList] = useState([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [visibleProjects, setVisibleProjects] = useState([])
  const isMobile = useMediaQuery("(max-width: 768px)")
  const projectsRef = useRef(null)
  const projectRefs = useRef({})
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    link: "",
  })

  useEffect(() => {
    const getProjectData = async () => {
      try {
        setLoading(true)
        const response = await fetchWithAuth("/user/project/")
        const data = await response.json()
        setProjectList(data)
      } catch (error) {
        toast.error("Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    getProjectData()
  }, [])

  // Scroll to form when it appears
  useEffect(() => {
    if ((isAddingNew || editingId) && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }, [isAddingNew, editingId])

  // Set up intersection observer for project items
  useEffect(() => {
    if (!projectsRef.current || projectList.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleProjects((prev) => {
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

    // Create refs for each project and observe them
    setTimeout(() => {
      projectList.forEach((project) => {
        const element = document.getElementById(`project-item-${project.id}`)
        if (element) {
          projectRefs.current[project.id] = element
          observer.observe(element)
        }
      })
    }, 100)

    return () => {
      Object.values(projectRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [projectList, loading])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      link: "",
    })
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      setActionLoading(true)
      // Format data according to the expected API structure
      const apiData = {
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        link: formData.link || null,
      }

      const response = await fetchWithAuth("/user/project/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const newProject = await response.json()
      setProjectList((prev) => [...prev, newProject])
      setIsAddingNew(false)
      resetForm()
      toast.success("Project added successfully")
    } catch (error) {
      console.error("Failed to add project:", error)
      toast.error("Error adding project")
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingId) return

    try {
      setActionLoading(true)
      // Format data according to the expected API structure
      const apiData = {
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        link: formData.link || null,
      }

      const response = await fetchWithAuth(`/user/project/${editingId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const updatedProject = await response.json()
      setProjectList((prev) => prev.map((item) => (item.id === updatedProject.id ? updatedProject : item)))
      setEditingId(null)
      resetForm()
      toast.success("Project updated successfully")
    } catch (error) {
      console.error("Failed to update project:", error)
      toast.error("Error updating project")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setActionLoading(true)
      await fetchWithAuth(`/user/project/${id}/`, {
        method: "DELETE",
      })
      setProjectList((prev) => prev.filter((item) => item.id !== id))
      toast.success("Project deleted successfully")
    } catch (error) {
      toast.error("Error deleting project")
    } finally {
      setActionLoading(false)
    }
  }

  const startEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      start_date: project.start_date,
      end_date: project.end_date || "",
      link: project.link || "",
    })
    setEditingId(project.id)
    setExpandedId(null)
  }

  const cancelForm = () => {
    resetForm()
    setIsAddingNew(false)
    setEditingId(null)
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleProjectHover = (id) => {
    setActiveProjectId(id)
  }

  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Present"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  // Get project duration in months
  const getProjectDuration = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()

    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())

    if (months < 1) return "< 1 month"
    if (months === 1) return "1 month"
    return `${months} months`
  }

  // Get project status
  const getProjectStatus = (endDate) => {
    if (!endDate) return "active"
    return "completed"
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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

  if (loading && projectList.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Projects</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
            </div>
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
            <Briefcase className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 text-lg font-semibold">
            Project Showcase
          </span>
        </h2>

        {!isAddingNew && !editingId && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsAddingNew(true)}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 rounded-full px-5 shadow-md"
              disabled={actionLoading}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Project
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
                    <Code className="h-5 w-5 text-primary" />
                  </motion.div>
                  {editingId ? "Edit Project" : "Add New Project"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {editingId ? "Update your project details" : "Enter your project details"}
                </p>
              </div>

              <form onSubmit={editingId ? handleEditSubmit : handleAddSubmit}>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Project Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Inventory Management System"
                      required
                      className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your project, technologies used, and your role"
                      required
                      className="min-h-[100px] w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date" className="text-sm font-medium">
                        Start Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="start_date"
                        name="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_date" className="text-sm font-medium">
                        End Date <span className="text-gray-400 text-xs">(Optional)</span>
                      </Label>
                      <Input
                        id="end_date"
                        name="end_date"
                        type="date"
                        value={formData.end_date || ""}
                        onChange={handleChange}
                        placeholder="Leave blank if current"
                        className="w-full rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link" className="text-sm font-medium">
                      Project Link <span className="text-gray-400 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="link"
                      name="link"
                      value={formData.link || ""}
                      onChange={handleChange}
                      placeholder="e.g. https://github.com/yourusername/project"
                      className="w-full rounded-lg"
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
      <AnimatePresence>
        {projectList.length === 0 && !isAddingNew && !editingId ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Code className="h-20 w-20 text-primary/30 mb-6" />
            </motion.div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No projects yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Showcase your work by adding projects to your portfolio. Highlight your skills and accomplishments.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsAddingNew(true)}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 rounded-full px-6 shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Project
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div ref={projectsRef}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {projectList.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  id={`project-item-${project.id}`}
                  data-id={project.id}
                  className={`group ${expandedId === project.id ? "md:col-span-2" : ""}`}
                  onMouseEnter={() => handleProjectHover(project.id)}
                  onMouseLeave={() => handleProjectHover(null)}
                >
                  <motion.div
                    variants={cardVariants}
                    initial="initial"
                    whileHover="hover"
                    animate={activeProjectId === project.id ? "active" : "initial"}
                    className={cn(
                      "h-full rounded-xl overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700",
                      "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",
                      "hover:border-primary/30 dark:hover:border-primary/30",
                      expandedId === project.id ? "ring-2 ring-primary shadow-xl" : "shadow-md",
                    )}
                  >
                    <div className="relative">
                      {/* Header with gradient */}
                      <div className="p-6 pb-4">
                        <div className="flex flex-col">
                          {/* Project status badge - moved to top right */}
                          <div className="absolute top-4 right-4 z-10">
                            {getProjectStatus(project.end_date) === "active" ? (
                              <Badge className="bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-400 hover:bg-green-500/30 border-green-500/30 flex items-center gap-1 px-2.5 py-1">
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                >
                                  <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-1"></span>
                                </motion.div>
                                Active
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-500/20 text-blue-600 dark:bg-blue-500/30 dark:text-blue-400 hover:bg-blue-500/30 border-blue-500/30 flex items-center gap-1 px-2.5 py-1">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>

                          <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 pr-24"
                          >
                            {project.title}
                          </motion.h3>

                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3.5 w-3.5 mr-1 text-primary/70" />
                              <span>
                                {formatDate(project.start_date)} - {formatDate(project.end_date)}
                              </span>
                            </div>

                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="h-3.5 w-3.5 mr-1 text-primary/70" />
                              <span>{getProjectDuration(project.start_date, project.end_date)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Collapsed view */}
                        {expandedId !== project.id && (
                          <div className="relative">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                            >
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                                {project.description}
                              </p>
                            </motion.div>

                            {/* Gradient fade for text */}
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
                          </div>
                        )}

                        {/* Expanded view */}
                        {expandedId === project.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="mt-2"
                          >
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-4">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Project Description
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                {project.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-primary/70" />
                                  Timeline
                                </h4>
                                <div className="text-sm">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                                    <span className="font-medium">{formatDate(project.start_date)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                                    <span className="font-medium">{formatDate(project.end_date)}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-primary/70" />
                                  Duration
                                </h4>
                                <div className="text-sm">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Total Time:</span>
                                    <span className="font-medium">
                                      {getProjectDuration(project.start_date, project.end_date)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                    <span className="font-medium">
                                      {getProjectStatus(project.end_date) === "active" ? (
                                        <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                                          <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                                          Active
                                        </span>
                                      ) : (
                                        <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                          <CheckCircle2 className="h-3 w-3" />
                                          Completed
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {project.link && (
                              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                                  <Link2 className="h-4 w-4 text-primary/70" />
                                  Project Link
                                </h4>
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 break-all"
                                >
                                  {project.link.includes("github") ? (
                                    <Github className="h-4 w-4 flex-shrink-0" />
                                  ) : (
                                    <Globe className="h-4 w-4 flex-shrink-0" />
                                  )}
                                  {project.link}
                                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                </a>
                              </div>
                            )}

                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEdit(project)}
                                className="rounded-full"
                              >
                                <Edit className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </Button>

                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(project.id)}
                                className="rounded-full"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Footer with link and expand button */}
                      <CardFooter className="p-4 pt-2 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
                        {project.link && expandedId !== project.id ? (
                          <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            {project.link.includes("github") ? (
                              <Github className="h-4 w-4 mr-1.5" />
                            ) : (
                              <Globe className="h-4 w-4 mr-1.5" />
                            )}
                            <span className="font-medium">View Project</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </motion.a>
                        ) : (
                          <div className="flex-1"></div>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(project.id)}
                          className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {expandedId === project.id ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              <span className="text-xs">Collapse</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              <span className="text-xs">Details</span>
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CSS for animations */}
      <style jsx global>{`
        @media (prefers-reduced-motion) {
          .animate-pulse {
            animation: none !important;
          }
          
          .transition-all,
          .transition-opacity,
          .transition-colors {
            transition: none !important;
          }
        }
        
        .project-item {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .project-item-visible {
          opacity: 1 !important;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}
