"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { fetchWithAuth } from "@/app/api"
import { Briefcase, Calendar, Link2, Plus, Pencil, Trash2, Save, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ProjectsSettingsForm() {
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [projectList, setProjectList] = useState([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    link: "",
  })

  // Fetch projects data
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

  // Form handlers
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
      setDeleteDialogOpen(false)
    } catch (error) {
      toast.error("Error deleting project")
    } finally {
      setActionLoading(false)
    }
  }

  const confirmDelete = (id) => {
    setDeleteId(id)
    setDeleteDialogOpen(true)
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
    setIsAddingNew(false)
  }

  const cancelForm = () => {
    resetForm()
    setIsAddingNew(false)
    setEditingId(null)
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Present"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Projects Management
          </CardTitle>
          <CardDescription>Add, edit, or remove your projects</CardDescription>
        </CardHeader>
        <CardContent>
          {!isAddingNew && !editingId && (
            <Button onClick={() => setIsAddingNew(true)} className="mb-6">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          )}

          {/* Add/Edit Form */}
          {(isAddingNew || editingId) && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                {editingId ? "Edit Project" : "Add New Project"}
              </h3>

              <form onSubmit={editingId ? handleEditSubmit : handleAddSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Project Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Inventory Management System"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your project, technologies used, and your role"
                    required
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">
                      Start Date <span className="text-red-500">*</span>
                    </Label>
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
                    <Label htmlFor="end_date">
                      End Date <span className="text-gray-400 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date || ""}
                      onChange={handleChange}
                      placeholder="Leave blank if current"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">
                    Project Link <span className="text-gray-400 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="link"
                    name="link"
                    value={formData.link || ""}
                    onChange={handleChange}
                    placeholder="e.g. https://github.com/yourusername/project"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={cancelForm} disabled={actionLoading}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>

                  <Button type="submit" disabled={actionLoading} className="bg-primary hover:bg-primary/90">
                    {actionLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Projects List */}
          {projectList.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <Briefcase className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-lg font-medium mb-1">No projects yet</h3>
              <p className="text-muted-foreground mb-4">Showcase your work by adding projects to your portfolio</p>
              {!isAddingNew && (
                <Button onClick={() => setIsAddingNew(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {projectList.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg">{project.title}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(project.start_date)} - {formatDate(project.end_date)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center mt-2"
                        >
                          <Link2 className="h-3.5 w-3.5 mr-1" />
                          {project.link}
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(project)}
                        disabled={isAddingNew || !!editingId}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDelete(project.id)}
                        disabled={isAddingNew || !!editingId}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={() => handleDelete(deleteId)} disabled={actionLoading}>
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

