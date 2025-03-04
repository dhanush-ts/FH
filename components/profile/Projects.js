"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, MoreVertical, Calendar, Link2, Code } from "lucide-react"
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
import { fetchData, createData, updateData, deleteData } from "@/lib/api"

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
        const data = await fetchData("user/project/")
        setProjectList(data)
      } catch (error) {
        toast(
         "Error"
          // description: "Failed to load project data",
          // variant: "destructive",
        )
      } finally {
        setLoading(false)
      }
    }

    getProjectData()
  }, [toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const newProject = await createData("user/project/", formData)
      setProjectList((prev) => [...prev, newProject])
      setIsAddDialogOpen(false)
      setFormData({
        title: "",
        description: "",
        start_date: new Date().toISOString().split("T")[0],
      })
      toast(
        "Success",
        // description: "Project added successfully",
      )
    } catch (error) {
      toast(
        "Error",
        // description: "Failed to add project",
        // variant: "destructive",
      )
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!currentProject) return

    try {
      setLoading(true)
      const updatedProject = await updateData(`user/project/${currentProject.id}/`, formData)
      setProjectList((prev) => prev.map((item) => (item.id === updatedProject.id ? updatedProject : item)))
      setIsEditDialogOpen(false)
      setCurrentProject(null)
      toast(
         "Success",
        // description: "Project updated successfully",
      )
    } catch (error) {
      toast(
       "Error"
        // description: "Failed to update project",
        // variant: "destructive",
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      await deleteData(`user/project/${id}/`)
      setProjectList((prev) => prev.filter((item) => item.id !== id))
      toast(
       "Success"
        // description: "Project deleted successfully",
      )
    } catch (error) {
      toast(
       "Error"
        // description: "Failed to delete project",
        // variant: "destructive",
      )
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
          <h2 className="text-2xl font-bold">Projects</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Project</DialogTitle>
              <DialogDescription>Add details about your project</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Inventory Management System"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your project"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date (Optional)</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">Project Link (Optional)</Label>
                  <Input
                    id="link"
                    name="link"
                    placeholder="https://github.com/yourusername/project"
                    value={formData.link || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
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
            className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg"
          >
            <Code className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No projects added yet. Click the "Add Project" button to showcase your work.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {projectList.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {project.start_date} - {project.end_date || "Present"}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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
                  <CardContent>
                    <p className="text-sm">{project.description}</p>
                    {project.link && (
                      <div className="mt-4">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:underline"
                        >
                          <Link2 className="h-4 w-4 mr-1" />
                          View Project
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update your project details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Project Title</Label>
                <Input id="edit-title" name="title" value={formData.title || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  required
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start_date">Start Date</Label>
                  <Input
                    id="edit-start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-end_date">End Date (Optional)</Label>
                  <Input
                    id="edit-end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-link">Project Link (Optional)</Label>
                <Input id="edit-link" name="link" value={formData.link || ""} onChange={handleChange} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

