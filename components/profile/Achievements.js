"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, MoreVertical, Calendar, Link2, Award, Trophy } from "lucide-react"
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

export default function Achievements() {
  const [loading, setLoading] = useState(true)
  const [achievementList, setAchievementList] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date_received: "",
    link: "",
  })

  useEffect(() => {
    const getAchievementData = async () => {
      try {
        setLoading(true)
        const response = await fetchWithAuth("/user/achievement/")
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        const data = await response.json()
        setAchievementList(data)
      } catch (error) {
        console.error("Failed to fetch achievements:", error)
        toast.error("Failed to load achievements")
      } finally {
        setLoading(false)
      }
    }

    getAchievementData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
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
      setIsAddDialogOpen(false)
      setFormData({
        title: "",
        description: "",
        date_received: "",
        link: "",
      })
      toast.success("Achievement added successfully")
    } catch (error) {
      console.error("Failed to add achievement:", error)
      toast.error("Error adding achievement")
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!currentAchievement) return

    try {
      setLoading(true)
      // Format data according to the expected API structure
      const apiData = {
        title: formData.title,
        description: formData.description,
        date_received: formData.date_received || null,
        link: formData.link || null,
      }

      const response = await fetchWithAuth(`/user/achievement/${currentAchievement.id}/`, {
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
      setIsEditDialogOpen(false)
      setCurrentAchievement(null)
      toast.success("Achievement updated successfully")
    } catch (error) {
      console.error("Failed to update achievement:", error)
      toast.error("Error updating achievement")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      // Fix the URL path by adding a leading slash
      const response = await fetchWithAuth(`/user/achievement/${id}/`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      setAchievementList((prev) => prev.filter((item) => item.id !== id))
      toast.success("Achievement deleted successfully")
    } catch (error) {
      console.error("Failed to delete achievement:", error)
      toast.error("Error deleting achievement")
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (achievement) => {
    setCurrentAchievement(achievement)
    setFormData({
      title: achievement.title || "",
      description: achievement.description || "",
      date_received: achievement.date_received || "",
      link: achievement.link || "",
    })
    setIsEditDialogOpen(true)
  }

  if (loading && achievementList.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-primary" />
            Achievements
          </h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-primary" />
          Achievements
        </h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Achievement</DialogTitle>
              <DialogDescription>Add details about your achievement</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Achievement Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Hackathon Winner"
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
                    placeholder="Describe your achievement"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="min-h-[100px] border-gray-300 focus:ring-primary focus:border-primary resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_received" className="text-sm font-medium">
                    Date Received (Optional)
                  </Label>
                  <Input
                    id="date_received"
                    name="date_received"
                    type="date"
                    value={formData.date_received || ""}
                    onChange={handleChange}
                    className="border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link" className="text-sm font-medium">
                    Certificate/Proof Link (Optional)
                  </Label>
                  <Input
                    id="link"
                    name="link"
                    placeholder="https://example.com/certificate"
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
        {achievementList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-white dark:bg-gray-800 shadow-sm"
          >
            <Award className="h-16 w-16 text-primary/30 mb-4" />
            <p className="text-muted-foreground text-center max-w-md">
              No achievements added yet. Click the "Add Achievement" button to showcase your accomplishments.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {achievementList.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group"
              >
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 group-hover:translate-y-[-2px]">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center">
                        <Award className="h-4 w-4 mr-2 text-yellow-500" />
                        {achievement.title}
                      </CardTitle>
                      {achievement.date_received && (
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-primary" />
                          {achievement.date_received}
                        </CardDescription>
                      )}
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
                  <CardContent className="p-6">
                    <p className="text-sm">{achievement.description}</p>
                    {achievement.link && (
                      <motion.div className="mt-4" whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                        <a
                          href={achievement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:underline"
                        >
                          <Link2 className="h-4 w-4 mr-1" />
                          View Certificate
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
            <DialogTitle>Edit Achievement</DialogTitle>
            <DialogDescription>Update your achievement details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-sm font-medium">
                  Achievement Title
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
              <div className="space-y-2">
                <Label htmlFor="edit-date_received" className="text-sm font-medium">
                  Date Received (Optional)
                </Label>
                <Input
                  id="edit-date_received"
                  name="date_received"
                  type="date"
                  value={formData.date_received || ""}
                  onChange={handleChange}
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-link" className="text-sm font-medium">
                  Certificate/Proof Link (Optional)
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

