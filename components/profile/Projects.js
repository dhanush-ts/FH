"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, MoreVertical, Calendar, Link2, Code, Briefcase } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { fetchWithAuth } from "@/lib/api"

export default function Projects() {
  const [loading, setLoading] = useState(true)
  const [projectList, setProjectList] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const getProjectData = async () => {
      try {
        setLoading(true)
        const response = await fetchWithAuth("/user/project/")
        const data = await response.json()
        setProjectList(data)
      } catch (error) {
        toast("Error")
      } finally {
        setLoading(false)
      }
    }

    getProjectData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Fix the handleAddSubmit function to properly format the data for POST request
  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
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
      setIsAddDialogOpen(false)
      setFormData({
        title: "",
        description: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        link: "",
      })
      toast.success("Project added successfully")
    } catch (error) {
      console.error("Failed to add project:", error)
      toast.error("Error adding project")
    } finally {
      setLoading(false)
    }
  }

  // Fix the handleEditSubmit function to properly format the data for PATCH request
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!currentProject) return

    try {
      setLoading(true)
      // Format data according to the expected API structure
      const apiData = {
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        link: formData.link || null,
      }

      const response = await fetchWithAuth(`/user/project/${currentProject.id}/`, {
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
      setIsEditDialogOpen(false)
      setCurrentProject(null)
      toast.success("Project updated successfully")
    } catch (error) {
      console.error("Failed to update project:", error)
      toast.error("Error updating project")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      await fetchWithAuth(`/user/project/${id}/`, {
        method: "DELETE",
      })
      setProjectList((prev) => prev.filter((item) => item.id !== id))
      toast("Success")
    } catch (error) {
      toast("Error")
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (project) => {
    setCurrentProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      start_date: project.start_date,
      end_date: project.end_date || undefined,
      link: project.link || undefined,
    })
    setIsEditDialogOpen(true)
  }

  if (loading && projectList.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <Briefcase className="h-6 w-6 mr-2 text-primary" />
            Projects
          </h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Briefcase className="h-6 w-6 mr-2 text-primary" />
          Projects
        </h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Project</DialogTitle>
              <DialogDescription>Add details about your project</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Project Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Inventory Management System"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your project"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="min-h-[100px] border-gray-300 focus:ring-primary focus:border-primary resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="text-sm font-medium">
                      Start Date
                    </Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date" className="text-sm font-medium">
                      End Date (Optional)
                    </Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date || ""}
                      onChange={handleChange}
                      className="border-gray-300 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link" className="text-sm font-medium">
                    Project Link (Optional)
                  </Label>
                  <Input
                    id="link"
                    name="link"
                    placeholder="https://github.com/yourusername/project"
                    value={formData.link || ""}
                    onChange={handleChange}
                    className="border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <AnimatePresence>
        {projectList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-white dark:bg-gray-800 shadow-sm"
          >
            <Code className="h-16 w-16 text-primary/30 mb-4" />
            <p className="text-muted-foreground text-center max-w-md">
              No projects added yet. Click the "Add Project" button to showcase your work.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {projectList.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group"
              >
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 group-hover:translate-y-[-2px]">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                    <div>
                      <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1 text-primary" />
                        {project.start_date} - {project.end_date || "Present"}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full opacity-70 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => openEditDialog(project)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm">{project.description}</p>
                    {project.link && (
                      <motion.div className="mt-4" whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:underline"
                        >
                          <Link2 className="h-4 w-4 mr-1" />
                          View Project
                        </a>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update your project details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-sm font-medium">
                  Project Title
                </Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  required
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  required
                  className="min-h-[100px] border-gray-300 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start_date" className="text-sm font-medium">
                    Start Date
                  </Label>
                  <Input
                    id="edit-start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date || ""}
                    onChange={handleChange}
                    required
                    className="border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-end_date" className="text-sm font-medium">
                    End Date (Optional)
                  </Label>
                  <Input
                    id="edit-end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date || ""}
                    onChange={handleChange}
                    className="border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-link" className="text-sm font-medium">
                  Project Link (Optional)
                </Label>
                <Input
                  id="edit-link"
                  name="link"
                  value={formData.link || ""}
                  onChange={handleChange}
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
              >
                {loading ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

