"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { fetchWithAuth } from "@/app/api"
import { GraduationCap, Building, Calendar, Plus, Pencil, Trash2, Save, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function EducationSettingsForm() {
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [entries, setEntries] = useState([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    start_year: "",
    end_year: "",
    grade: "",
  })

  // Fetch education data
  useEffect(() => {
    const getEducationData = async () => {
      try {
        setLoading(true)
        const response = await fetchWithAuth("/user/education/")
        const data = await response.json()
        if (data.length !== 0) {
          setEntries(data.sort((a, b) => -a.start_year + b.start_year))
        } else {
          setEntries(data)
        }
      } catch (error) {
        toast.error("Failed to load education data")
      } finally {
        setLoading(false)
      }
    }

    getEducationData()
  }, [])

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
      // Format data according to the expected API structure
      const apiData = {
        degree: formData.degree,
        institution: formData.institution,
        start_year: Number.parseInt(formData.start_year),
        end_year: formData.end_year ? Number.parseInt(formData.end_year) : null,
        grade: formData.grade,
      }

      const response = await fetchWithAuth("/user/education/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const newEducation = await response.json()
      setEntries((prev) => [...prev, newEducation].sort((a, b) => b.start_year - a.start_year))
      setIsAddingNew(false)
      resetForm()
      toast.success("Education added successfully")
    } catch (error) {
      toast.error("Error adding education")
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
        degree: formData.degree,
        institution: formData.institution,
        start_year: Number.parseInt(formData.start_year),
        end_year: formData.end_year ? Number.parseInt(formData.end_year) : null,
        grade: formData.grade,
      }

      const response = await fetchWithAuth(`/user/education/${editingId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const updatedEducation = await response.json()
      setEntries((prev) =>
        prev
          .map((item) => (item.id === updatedEducation.id ? updatedEducation : item))
          .sort((a, b) => b.start_year - a.start_year),
      )
      setEditingId(null)
      resetForm()
      toast.success("Education updated successfully")
    } catch (error) {
      toast.error("Error updating education")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setActionLoading(true)
      await fetchWithAuth(`/user/education/${id}/`, {
        method: "DELETE",
      })
      setEntries((prev) => prev.filter((item) => item.id !== id))
      toast.success("Education deleted successfully")
      setDeleteDialogOpen(false)
    } catch (error) {
      toast.error("Error deleting education")
    } finally {
      setActionLoading(false)
    }
  }

  const confirmDelete = (id) => {
    setDeleteId(id)
    setDeleteDialogOpen(true)
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
    setIsAddingNew(false)
  }

  const cancelForm = () => {
    resetForm()
    setIsAddingNew(false)
    setEditingId(null)
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
      <Card className="border border-green-200 dark:border-green-700 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Education Management
          </CardTitle>
          <CardDescription>Add, edit, or remove your educational background</CardDescription>
        </CardHeader>
        <CardContent>
          {!isAddingNew && !editingId && (
            <Button onClick={() => setIsAddingNew(true)} className="mb-6">
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          )}

          {/* Add/Edit Form */}
          {(isAddingNew || editingId) && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                {editingId ? "Edit Education" : "Add New Education"}
              </h3>

              <form onSubmit={editingId ? handleEditSubmit : handleAddSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">
                    Institution <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="e.g. Stanford University"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="degree">
                    Degree <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    placeholder="e.g. Bachelor of Science in Computer Science"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_year">
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_year">
                      End Year <span className="text-gray-400 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="end_year"
                      name="end_year"
                      type="number"
                      value={formData.end_year || ""}
                      onChange={handleInputChange}
                      placeholder="Leave blank if current"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">
                    Grade <span className="text-gray-400 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="grade"
                    name="grade"
                    type="number"
                    value={formData.grade || ""}
                    onChange={handleInputChange}
                    placeholder="Grade (1-10)"
                    max={"10"}
                    min={"1"}
                    step="0.1"
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

          {/* Education List */}
          {entries.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <GraduationCap className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-lg font-medium mb-1">No education entries yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your educational background to showcase your qualifications
              </p>
              {!isAddingNew && (
                <Button onClick={() => setIsAddingNew(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg">{entry.degree}</h4>
                      <div className="flex items-center text-muted-foreground">
                        <Building className="h-4 w-4 mr-1" />
                        {entry.institution}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {entry.start_year} - {entry.end_year || "Present"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(entry)}
                        disabled={isAddingNew || !!editingId}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDelete(entry.id)}
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
            <DialogTitle>Delete Education</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this education entry? This action cannot be undone.
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

