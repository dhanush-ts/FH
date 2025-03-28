"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Link2,
  Award,
  Trophy,
  Medal,
  Save,
  X,
  ExternalLink,
  Star,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  PlusCircle,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { fetchWithAuth } from "@/lib/api"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Achievements() {
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [achievementList, setAchievementList] = useState([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [expandedDescriptions, setExpandedDescriptions] = useState([])
  const [activeAchievementId, setActiveAchievementId] = useState(null)
  const [visibleAchievements, setVisibleAchievements] = useState([])
  const isMobile = useMediaQuery("(max-width: 768px)")
  const achievementsRef = useRef(null)
  const achievementRefs = useRef({})
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date_received: new Date().toISOString().split("T")[0],
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

  // Set up intersection observer for achievement items
  useEffect(() => {
    if (!achievementsRef.current || achievementList.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleAchievements((prev) => {
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

    // Create refs for each achievement and observe them
    setTimeout(() => {
      achievementList.forEach((achievement) => {
        const element = document.getElementById(`achievement-item-${achievement.id}`)
        if (element) {
          achievementRefs.current[achievement.id] = element
          observer.observe(element)
        }
      })
    }, 100)

    return () => {
      Object.values(achievementRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [achievementList, loading])

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
      console.error("Failed to add achievement:", error)
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
      console.error("Failed to update achievement:", error)
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
  }

  const cancelForm = () => {
    resetForm()
    setIsAddingNew(false)
    setEditingId(null)
  }

  const handleAchievementHover = (id) => {
    setActiveAchievementId(id)
  }

  const toggleDescriptionExpand = (id) => {
    setExpandedDescriptions((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const isDescriptionLong = (description) => {
    return description && description.split(" ").length > 200
  }

  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "No date specified"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  // Get random achievement icon
  const getAchievementIcon = (id) => {
    const icons = [Trophy, Medal, Award, Star]
    const index = id % icons.length
    return icons[index]
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
    hidden: { opacity: 0, y: 20 },
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
  }

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  }

  if (loading && achievementList.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-500">
              Achievements
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <Trophy className="h-6 w-6 text-amber-500" />
          </motion.div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-500 text-lg font-semibold">
            Achievement Showcase
          </span>
        </h2>

        {!isAddingNew && !editingId && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsAddingNew(true)}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 rounded-full px-5 shadow-md text-white"
              disabled={actionLoading}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Achievement
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
            <Card className="border-2 border-amber-200 dark:border-amber-800/30 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10 pb-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <Award className="h-5 w-5 text-amber-500" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold">{editingId ? "Edit Achievement" : "Add New Achievement"}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {editingId ? "Update your achievement details" : "Enter your achievement details"}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <form onSubmit={editingId ? handleEditSubmit : handleAddSubmit}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Achievement Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. First Place in Hackathon"
                      required
                      className="w-full"
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
                      placeholder="Describe your achievement, what it means to you, and how you earned it"
                      required
                      className="min-h-[100px] w-full resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_received" className="text-sm font-medium">
                        Date Received <span className="text-gray-400 text-xs">(Optional)</span>
                      </Label>
                      <Input
                        id="date_received"
                        name="date_received"
                        type="date"
                        value={formData.date_received || ""}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="link" className="text-sm font-medium">
                        Certificate/Proof Link <span className="text-gray-400 text-xs">(Optional)</span>
                      </Label>
                      <Input
                        id="link"
                        name="link"
                        value={formData.link || ""}
                        onChange={handleChange}
                        placeholder="e.g. https://example.com/certificate"
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t flex justify-end gap-2 py-4">
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
                      className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white flex items-center gap-1 rounded-lg"
                    >
                      <Save className="h-4 w-4" />
                      {actionLoading ? "Saving..." : "Save"}
                    </Button>
                  </motion.div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      <AnimatePresence>
        {achievementList.length === 0 && !isAddingNew && !editingId ? (
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
              <Trophy className="h-20 w-20 text-amber-500/30 mb-6" />
            </motion.div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No achievements yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Showcase your accomplishments by adding achievements to your profile. Highlight your awards,
              certifications, and recognition.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsAddingNew(true)}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 rounded-full px-6 shadow-md text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Achievement
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div ref={achievementsRef}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {achievementList.map((achievement, index) => {
                const AchievementIcon = getAchievementIcon(index)
                const isLongDescription = isDescriptionLong(achievement.description)
                const isExpanded = expandedDescriptions.includes(achievement.id)

                return (
                  <motion.div
                    key={achievement.id}
                    variants={itemVariants}
                    id={`achievement-item-${achievement.id}`}
                    data-id={achievement.id}
                    className="group"
                    onMouseEnter={() => handleAchievementHover(achievement.id)}
                    onMouseLeave={() => handleAchievementHover(null)}
                  >
                    <motion.div variants={cardVariants} initial="initial" whileHover="hover" className="h-full">
                      <Card className="h-full overflow-hidden border border-amber-200 dark:border-amber-800/30 hover:border-amber-400 dark:hover:border-amber-600/50 transition-all duration-300 shadow-md hover:shadow-xl">
                        <div className="relative">
                          {/* Achievement icon badge */}
                          <div className="absolute -top-4 -left-4 z-10">
                            <motion.div
                              whileHover={{ rotate: 12, scale: 1.1 }}
                              className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg"
                            >
                              <AchievementIcon className="h-8 w-8 text-white" />
                            </motion.div>
                          </div>

                          <CardHeader className="pt-6 pb-2 pr-14">
                            {/* Three-dot menu */}
                            <div className="absolute top-2 right-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/20"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem onClick={() => startEdit(achievement)} className="cursor-pointer">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => confirmDelete(achievement.id)}
                                    className="cursor-pointer text-red-600 dark:text-red-400"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="flex flex-col ml-10">
                              <h3 className="text-lg font-bold line-clamp-2 min-h-[3.5rem]">{achievement.title}</h3>

                              {achievement.date_received && (
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                                  <Calendar className="h-3.5 w-3.5 mr-1 text-amber-500" />
                                  <span>{formatDate(achievement.date_received)}</span>
                                </div>
                              )}
                            </div>
                          </CardHeader>

                          <CardContent className="pb-2">
                            <div className="relative">
                              {isLongDescription ? (
                                <>
                                  <div
                                    className={cn(
                                      "text-sm text-gray-600 dark:text-gray-300 transition-all duration-300",
                                      isExpanded ? "" : "line-clamp-4",
                                    )}
                                  >
                                    {achievement.description}
                                  </div>

                                  {!isExpanded && (
                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
                                  )}
                                </>
                              ) : (
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  {achievement.description}
                                </div>
                              )}
                            </div>

                            {isLongDescription && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleDescriptionExpand(achievement.id)}
                                className="mt-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 p-0 h-auto"
                              >
                                {isExpanded ? (
                                  <span className="flex items-center">
                                    <ChevronUp className="h-4 w-4 mr-1" />
                                    Show Less
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                    Show More
                                  </span>
                                )}
                              </Button>
                            )}

                            {achievement.link && (
                              <div className="mt-4">
                                <a
                                  href={achievement.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
                                >
                                  <Link2 className="h-3.5 w-3.5 mr-1.5" />
                                  View Certificate
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            )}
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
        
        .achievement-item {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .achievement-item-visible {
          opacity: 1 !important;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}

