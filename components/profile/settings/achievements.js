"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { fetchWithAuth } from "@/app/api"
import { Trophy, Calendar, Link2, Plus, Pencil, Trash2, Save, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AchievementsSettingsForm() {
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [achievementList, setAchievementList] = useState([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date_received: new Date().toISOString().split("T")[0],
    link: "",
  })

  // Fetch achievements data
  useEffect(() => {
    const getAchievementData = async () => {
      try {
        setLoading(true)
        const response = await fetchWithAuth("/user/achievement/")
        const data = await response.json()
        setAchievementList(data)
      } catch (error) {
        toast.error("Failed to load achievements")
      } finally {
        setLoading(false)
      }
    }

    getAchievementData()
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
      date_received: new Date().toISOString().split("T")[0],
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
        date_received: formData.date_received || null,
        link: formData.link || null,
      }

      const response = await fetchWithAuth("/user/achievement/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const newAchievement = await response.json()
      setAchievementList((prev) => [...prev, newAchievement])
      setIsAddingNew(false)
      resetForm()
      toast.success("Achievement added successfully")
    } catch (error) {
      toast.error("Error adding achievement")
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
        date_received: formData.date_received || null,
        link: formData.link || null,
      }

      const response = await fetchWithAuth(`/user/achievement/${editingId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const updatedAchievement = await response.json()
      setAchievementList((prev) => prev.map((item) => (item.id === updatedAchievement.id ? updatedAchievement : item)))
      setEditingId(null)
      resetForm()
      toast.success("Achievement updated successfully")
    } catch (error) {
      toast.error("Error updating achievement")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setActionLoading(true)
      await fetchWithAuth(`/user/achievement/${id}/`, {
        method: "DELETE",
      })
      setAchievementList((prev) => prev.filter((item) => item.id !== id))
      toast.success("Achievement deleted successfully")
      setDeleteDialogOpen(false)
    } catch (error) {
      toast.error("Error deleting achievement")
    } finally {
      setActionLoading(false)
    }
  }

  const confirmDelete = (id) => {
    setDeleteId(id)
    setDeleteDialogOpen(true)
  }

  const startEdit = (achievement) => {
    setFormData({
      title: achievement.title,
      description: achievement.description,
      date_received: achievement.date_received || "",
      link: achievement.link || "",
    })
    setEditingId(achievement.id)
    setIsAddingNew(false)
  }

  const cancelForm = () => {
    resetForm()
    setIsAddingNew(false)
    setEditingId(null)
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No date specified"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
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
            <Trophy className="h-5 w-5 text-amber-500" />
            Achievements Management
          </CardTitle>
          <CardDescription>Add, edit, or remove your achievements and certifications</CardDescription>
        </CardHeader>
        <CardContent>
          {!isAddingNew && !editingId && (
            <Button onClick={() => setIsAddingNew(true)} className="mb-6">
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
          )}

          {/* Add/Edit Form */}
          {(isAddingNew || editingId) && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                {editingId ? "Edit Achievement" : "Add New Achievement"}
              </h3>

              <form onSubmit={editingId ? handleEditSubmit : handleAddSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Achievement Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. First Place in Hackathon"
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
                    placeholder="Describe your achievement, what it means to you, and how you earned it"
                    required
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date_received">
                      Date Received <span className="text-gray-400 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="date_received"
                      name="date_received"
                      type="date"
                      value={formData.date_received || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link">
                      Certificate/Proof Link <span className="text-gray-400 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="link"
                      name="link"
                      value={formData.link || ""}
                      onChange={handleChange}
                      placeholder="e.g. https://example.com/certificate"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={cancelForm} disabled={actionLoading}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
                  >
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

          {/* Achievements List */}
          {achievementList.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <Trophy className="h-12 w-12 mx-auto text-amber-300 dark:text-amber-700 mb-3" />
              <h3 className="text-lg font-medium mb-1">No achievements yet</h3>
              <p className="text-muted-foreground mb-4">
                Showcase your accomplishments by adding achievements to your profile
              </p>
              {!isAddingNew && (
                <Button onClick={() => setIsAddingNew(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {achievementList.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg">{achievement.title}</h4>
                      {achievement.date_received && (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-amber-500" />
                          {formatDate(achievement.date_received)}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{achievement.description}</p>
                      {achievement.link && (
                        <a
                          href={achievement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-amber-600 dark:text-amber-400 hover:underline flex items-center mt-2"
                        >
                          <Link2 className="h-3.5 w-3.5 mr-1" />
                          View Certificate
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(achievement)}
                        disabled={isAddingNew || !!editingId}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDelete(achievement.id)}
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
            <DialogTitle>Delete Achievement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this achievement? This action cannot be undone.
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

