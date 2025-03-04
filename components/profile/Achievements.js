"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, MoreVertical, Calendar, Link2, Award } from "lucide-react"
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


export default function Achievements() {
  
  const [loading, setLoading] = useState(true)
  const [achievementList, setAchievementList] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  useEffect(() => {
    const getAchievementData = async () => {
      try {
        setLoading(true)
        const data = await fetchData("user/achievement/")
        setAchievementList(data)
      } catch (error) {
        toast(
           "Error"
          // description: "Failed to load achievement data",
          // variant: "destructive",
        )
      } finally {
        setLoading(false)
      }
    }

    getAchievementData()
  }, [toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const newAchievement = await createData("user/achievement/", formData)
      setAchievementList((prev) => [...prev, newAchievement])
      setIsAddDialogOpen(false)
      setFormData({
        title: "",
        description: "",
      })
      toast(
         "Success"
        // description: "Achievement added successfully",
      )
    } catch (error) {
      toast(
         "Error"
        // description: "Failed to add achievement",
        // variant: "destructive",
      )
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!currentAchievement) return

    try {
      setLoading(true)
      const updatedAchievement = await updateData(`user/achievement/${currentAchievement.id}/`,
        formData,
      )
      setAchievementList((prev) => prev.map((item) => (item.id === updatedAchievement.id ? updatedAchievement : item)))
      setIsEditDialogOpen(false)
      setCurrentAchievement(null)
      toast(
         "Success"
        // description: "Achievement updated successfully",
      )
    } catch (error) {
      toast(
         "Error"
        // description: "Failed to update achievement",
        // variant: "destructive",
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      await deleteData(`user/achievement/${id}/`)
      setAchievementList((prev) => prev.filter((item) => item.id !== id))
      toast(
         "Success",
        // description: "Achievement deleted successfully",
      )
    } catch (error) {
      toast(
         "Error"
        // description: "Failed to delete achievement",
        // variant: "destructive",
      )
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (achievement) => {
    setCurrentAchievement(achievement)
    setFormData({
      title: achievement.title,
      description: achievement.description,
      date_received: achievement.date_received || undefined,
      link: achievement.link || undefined,
    })
    setIsEditDialogOpen(true)
  }

  if (loading && achievementList.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Achievements</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Achievements</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Achievement</DialogTitle>
              <DialogDescription>Add details about your achievement</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Achievement Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Hackathon Winner"
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
                    placeholder="Describe your achievement"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_received">Date Received (Optional)</Label>
                  <Input
                    id="date_received"
                    name="date_received"
                    type="date"
                    value={formData.date_received || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">Certificate/Proof Link (Optional)</Label>
                  <Input
                    id="link"
                    name="link"
                    placeholder="https://example.com/certificate"
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
        {achievementList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg"
          >
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No achievements added yet. Click the "Add Achievement" button to showcase your accomplishments.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {achievementList.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-xl">{achievement.title}</CardTitle>
                      {achievement.date_received && (
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {achievement.date_received}
                        </CardDescription>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(achievement)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(achievement.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{achievement.description}</p>
                    {achievement.link && (
                      <div className="mt-4">
                        <a
                          href={achievement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:underline"
                        >
                          <Link2 className="h-4 w-4 mr-1" />
                          View Certificate
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
            <DialogTitle>Edit Achievement</DialogTitle>
            <DialogDescription>Update your achievement details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Achievement Title</Label>
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
              <div className="space-y-2">
                <Label htmlFor="edit-date_received">Date Received (Optional)</Label>
                <Input
                  id="edit-date_received"
                  name="date_received"
                  type="date"
                  value={formData.date_received || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-link">Certificate/Proof Link (Optional)</Label>
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

