"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Trash2,
  Upload,
  DollarSign,
  MoreVertical,
  Edit,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Medal,
  Gift,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { fetchWithAuth } from "@/app/api"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Helper function to check which fields have changed
const getChangedFields = (original, current) => {
  const changes = {}
  for (const key in current) {
    if (current[key] !== original[key]) {
      changes[key] = current[key]
    }
  }
  return changes
}

// Prize icons based on position
const prizeIcons = {
  1: Trophy,
  2: Medal,
  3: Medal,
  default: Gift,
}

export function SponsorsForm({ initialSponsors = [], initialPrizes = [], eventId }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("sponsors")
  const [sponsors, setSponsors] = useState(initialSponsors || [])
  const [prizes, setPrizes] = useState(initialPrizes || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFiles, setLogoFiles] = useState({})
  const [prizeImages, setPrizeImages] = useState({})
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)

  // Dialog states
  const [editingSponsor, setEditingSponsor] = useState(null)
  const [editingPrize, setEditingPrize] = useState(null)
  const [sponsorDialogOpen, setSponsorDialogOpen] = useState(false)
  const [prizeDialogOpen, setPrizeDialogOpen] = useState(false)

  // Store original data for comparison when editing
  const [originalSponsor, setOriginalSponsor] = useState(null)
  const [originalPrize, setOriginalPrize] = useState(null)

  // Handle adding a new sponsor
  const handleAddSponsor = () => {
    const newSponsor = { name: "", logo: "", priority: sponsors.length + 1 }
    setEditingSponsor(newSponsor)
    setOriginalSponsor(JSON.parse(JSON.stringify(newSponsor)))
    setSponsorDialogOpen(true)
  }

  // Handle editing an existing sponsor
  const handleEditSponsor = (sponsor) => {
    setEditingSponsor(JSON.parse(JSON.stringify(sponsor)))
    setOriginalSponsor(JSON.parse(JSON.stringify(sponsor)))
    setSponsorDialogOpen(true)
  }

  // Handle removing a sponsor
  const handleRemoveSponsor = async (sponsor) => {
    if (!sponsor.id) {
      // If it's a new sponsor that hasn't been saved yet
      setSponsors(sponsors.filter((s) => s !== sponsor))
      return
    }

    try {
      const url = `/event/host/sponser/change/${sponsor.id}/`
      await fetchWithAuth(url, { method: "DELETE" })
      setSponsors(sponsors.filter((s) => s.id !== sponsor.id))
    } catch (error) {
      console.error("Error deleting sponsor:", error)
    }
  }

  // Handle sponsor field changes in the edit dialog
  const handleSponsorChange = (field, value) => {
    setEditingSponsor((prev) => ({ ...prev, [field]: value }))
  }

  // Handle sponsor logo upload in the edit dialog
  const handleSponsorLogoUpload = (file) => {
    const objectUrl = URL.createObjectURL(file)
    setEditingSponsor((prev) => ({ ...prev, logo: objectUrl }))
    setLogoFiles((prev) => ({
      ...prev,
      [editingSponsor?.id || "new"]: file,
    }))
  }

  // Save sponsor from the edit dialog
  const handleSaveSponsor = async () => {
    if (!editingSponsor.name) {
      alert("Sponsor name is required")
      return
    }

    // Check if data has changed
    const hasChanged = JSON.stringify(editingSponsor) !== JSON.stringify(originalSponsor)

    if (!hasChanged) {
      setSponsorDialogOpen(false)
      return
    }

    setIsSubmitting(true)

    try {
      const isNew = !editingSponsor.id
      const method = isNew ? "POST" : "PATCH"
      const url = isNew ? `/event/host/sponser/${eventId}/` : `/event/host/sponser/change/${editingSponsor.id}/`

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("name", editingSponsor.name)
      formData.append("priority", editingSponsor.priority.toString())

      // Add logo file if it exists
      const logoFile = logoFiles[editingSponsor.id || "new"]
      if (logoFile) {
        formData.append("logo", logoFile)
      }

      const r = await fetchWithAuth(
        url,
        {
          method,
          body: formData,
        },
        true,
      )

      const response = await r.json()
      console.log(response)

      if (isNew) {
        // Add the new sponsor with the ID from the response
        setSponsors([...sponsors, response])
      } else {
        // Update the existing sponsor
        setSponsors(sponsors.map((s) => (s.id === editingSponsor.id ? response : s)))
      }

      setSponsorDialogOpen(false)
    } catch (error) {
      console.error("Error saving sponsor:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle adding a new prize
  const handleAddPrize = () => {
    const newPrize = { title: "", description: "", value: "", image: "" }
    setEditingPrize(newPrize)
    setOriginalPrize(JSON.parse(JSON.stringify(newPrize)))
    setPrizeDialogOpen(true)
  }

  // Handle editing an existing prize
  const handleEditPrize = (prize) => {
    setEditingPrize(JSON.parse(JSON.stringify(prize)))
    setOriginalPrize(JSON.parse(JSON.stringify(prize)))
    setPrizeDialogOpen(true)
  }

  // Handle removing a prize
  const handleRemovePrize = async (prize) => {
    if (!prize.id) {
      // If it's a new prize that hasn't been saved yet
      setPrizes(prizes.filter((p) => p !== prize))
      return
    }

    try {
      const url = `/event/host/prize/change/${prize.id}/`
      await fetchWithAuth(url, { method: "DELETE" })
      setPrizes(prizes.filter((p) => p.id !== prize.id))
    } catch (error) {
      console.error("Error deleting prize:", error)
    }
  }

  // Handle prize field changes in the edit dialog
  const handlePrizeChange = (field, value) => {
    setEditingPrize((prev) => ({ ...prev, [field]: value }))
  }

  // Handle prize image upload in the edit dialog
  const handlePrizeImageUpload = (file) => {
    const objectUrl = URL.createObjectURL(file)
    setEditingPrize((prev) => ({ ...prev, image: objectUrl }))
    setPrizeImages((prev) => ({
      ...prev,
      [editingPrize?.id || "new"]: file,
    }))
  }

  // Save prize from the edit dialog
  const handleSavePrize = async () => {
    if (!editingPrize.title) {
      alert("Prize title is required")
      return
    }

    // Check if data has changed
    const hasChanged = JSON.stringify(editingPrize) !== JSON.stringify(originalPrize)

    if (!hasChanged) {
      setPrizeDialogOpen(false)
      return
    }

    setIsSubmitting(true)

    try {
      const isNew = !editingPrize.id
      const method = isNew ? "POST" : "PATCH"
      const url = isNew ? `/event/host/prize/${eventId}/` : `/event/host/prize/change/${editingPrize.id}/`

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("title", editingPrize.title)
      formData.append("description", editingPrize.description || "")
      formData.append("value", editingPrize.value || "")

      // Add image file if it exists
      const imageFile = prizeImages[editingPrize.id || "new"]
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const r = await fetchWithAuth(
        url,
        {
          method,
          body: formData,
        },
        true,
      )

      const response = await r.json()
      console.log(response)

      if (isNew) {
        // Add the new prize with the ID from the response
        setPrizes([...prizes, response])
      } else {
        // Update the existing prize
        setPrizes(prizes.map((p) => (p.id === editingPrize.id ? response : p)))
      }

      setPrizeDialogOpen(false)
    } catch (error) {
      console.error("Error saving prize:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle navigation to next section
  const handleContinue = () => {
    router.push(`/host/create/${eventId}/schedule`)
  }

  // Get prize icon based on index
  const getPrizeIcon = (index) => {
    const PrizeIcon = prizeIcons[index + 1] || prizeIcons.default
    return <PrizeIcon className="h-5 w-5" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-20"
    >
      <div className="mb-8">
        <motion.h1
          className="text-3xl font-bold text-green-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Sponsors & Prizes
        </motion.h1>
        <motion.p
          className="mt-2 text-green-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Add sponsors and define prizes for your event participants
        </motion.p>
      </div>

      <Tabs defaultValue="sponsors" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-green-50 p-1 rounded-lg">
          <TabsTrigger
            value="sponsors"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all duration-300"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Sponsors
          </TabsTrigger>
          <TabsTrigger
            value="prizes"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all duration-300"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Prizes
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {activeTab === "sponsors" && (
            <motion.div
              key="sponsors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="sponsors" className="mt-6">
                <Card className="border-green-100 shadow-lg overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-green-100">
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Sponsors
                    </CardTitle>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleAddSponsor}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Sponsor
                      </Button>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {sponsors.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                      >
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                          className="rounded-full bg-green-100 p-5 mb-4"
                        >
                          <DollarSign className="h-10 w-10 text-green-600" />
                        </motion.div>
                        <h3 className="mt-4 text-xl font-medium text-green-800">No sponsors yet</h3>
                        <p className="mt-2 text-green-600 max-w-md">
                          Add sponsors to showcase their support and increase the credibility of your event
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
                          <Button
                            onClick={handleAddSponsor}
                            className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add Your First Sponsor
                          </Button>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <AnimatePresence>
                          {sponsors.map((sponsor, index) => (
                            <motion.div
                              key={sponsor.id || sponsor.name}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                              className="relative group flex flex-col items-center p-4 border border-green-100 rounded-lg bg-white hover:border-green-300 transition-all duration-300"
                            >
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-700">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="border-green-100">
                                    <DropdownMenuItem
                                      onClick={() => handleEditSponsor(sponsor)}
                                      className="text-green-700 focus:text-green-800 focus:bg-green-50"
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleRemoveSponsor(sponsor)}
                                      className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-24 h-24 mb-3 flex items-center justify-center bg-green-50 rounded-lg overflow-hidden"
                              >
                                {sponsor.logo ? (
                                  <Image
                                    src={sponsor.logo || "/placeholder.svg"}
                                    alt={sponsor.name}
                                    width={96}
                                    height={96}
                                    className="object-contain"
                                  />
                                ) : (
                                  <DollarSign className="h-10 w-10 text-green-400" />
                                )}
                              </motion.div>
                              <span className="text-center font-medium truncate w-full text-green-800">
                                {sponsor.name}
                              </span>
                              <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                                Priority: {sponsor.priority}
                              </Badge>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {/* Add sponsor button */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddSponsor}
                          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-green-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors"
                        >
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                            className="w-24 h-24 mb-3 flex items-center justify-center bg-green-100 rounded-lg"
                          >
                            <Plus className="h-10 w-10 text-green-600" />
                          </motion.div>
                          <span className="text-center font-medium text-green-700">Add Sponsor</span>
                        </motion.div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          )}

          {activeTab === "prizes" && (
            <motion.div
              key="prizes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="prizes" className="mt-6">
                <Card className="border-green-100 shadow-lg overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-green-100">
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Prizes
                    </CardTitle>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleAddPrize}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Prize
                      </Button>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {prizes.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                      >
                        <motion.div
                          animate={{ y: [0, -10, 0], rotateY: [0, 360] }}
                          transition={{
                            y: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                            rotateY: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                          }}
                          className="rounded-full bg-green-100 p-5 mb-4"
                        >
                          <Trophy className="h-10 w-10 text-green-600" />
                        </motion.div>
                        <h3 className="mt-4 text-xl font-medium text-green-800">No prizes yet</h3>
                        <p className="mt-2 text-green-600 max-w-md">
                          Add prizes to incentivize participation and make your event more attractive
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
                          <Button
                            onClick={handleAddPrize}
                            className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add Your First Prize
                          </Button>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        <AnimatePresence>
                          {prizes.map((prize, index) => (
                            <motion.div
                              key={prize.id || prize.title}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="relative"
                            >
                              <Card className="relative group overflow-hidden border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-md">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 bg-white/80 hover:bg-white text-green-700"
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="border-green-100">
                                      <DropdownMenuItem
                                        onClick={() => handleEditPrize(prize)}
                                        className="text-green-700 focus:text-green-800 focus:bg-green-50"
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleRemovePrize(prize)}
                                        className="text-red-600 focus:text-red-700 focus:bg-red-50"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                <div className="flex flex-col md:flex-row">
                                  {prize.image && (
                                    <div className="relative w-full md:w-48 h-40 flex-shrink-0">
                                      <Image
                                        src={prize.image || "/placeholder.svg"}
                                        alt={prize.title}
                                        fill
                                        className="object-cover"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent md:bg-gradient-to-t" />
                                    </div>
                                  )}

                                  <CardContent
                                    className={cn("p-4 flex-1", !prize.image && "pt-6", prize.image && "md:p-6")}
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center gap-2">
                                        <div className="bg-green-100 p-1.5 rounded-full text-green-700">
                                          {getPrizeIcon(index)}
                                        </div>
                                        <h3 className="font-bold text-lg text-green-800">{prize.title}</h3>
                                      </div>
                                      {prize.value && (
                                        <motion.div
                                          whileHover={{ scale: 1.05 }}
                                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium flex items-center gap-1"
                                        >
                                          <Sparkles className="h-3.5 w-3.5" />
                                          {prize.value}
                                        </motion.div>
                                      )}
                                    </div>

                                    {prize.description && <p className="text-green-700 mt-2">{prize.description}</p>}
                                  </CardContent>
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {/* Add prize button */}
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={handleAddPrize}
                          className="flex items-center justify-center p-4 border-2 border-dashed border-green-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors"
                        >
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                            className="flex items-center gap-2 text-green-700"
                          >
                            <Plus className="h-5 w-5" />
                            <span className="font-medium">Add Another Prize</span>
                          </motion.div>
                        </motion.div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-6 flex justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/host/create/${eventId}/media`)}
              className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 transition-all duration-300 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:animate-pulse" />
              Previous
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleContinue}
              className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 group"
            >
              Continue to Schedule
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </Tabs>

      {/* Sponsor Edit Dialog */}
      <Dialog open={sponsorDialogOpen} onOpenChange={setSponsorDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-green-100 p-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader className="p-6 bg-gradient-to-r from-green-50 to-green-100">
              <DialogTitle className="text-green-800 flex items-center gap-2">
                {editingSponsor?.id ? (
                  <>
                    <Edit className="h-5 w-5" />
                    Edit Sponsor
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    Add Sponsor
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {editingSponsor && (
              <div className="grid gap-4 p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="sponsor-name" className="text-green-800">
                    Name
                  </Label>
                  <Input
                    id="sponsor-name"
                    value={editingSponsor.name || ""}
                    onChange={(e) => handleSponsorChange("name", e.target.value)}
                    placeholder="Sponsor name"
                    className="border-green-200 focus-visible:ring-green-500 transition-all duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="sponsor-priority" className="text-green-800">
                    Priority
                  </Label>
                  <Input
                    id="sponsor-priority"
                    type="number"
                    min="1"
                    value={editingSponsor.priority || 1}
                    onChange={(e) => handleSponsorChange("priority", Number.parseInt(e.target.value))}
                    placeholder="Priority"
                    className="border-green-200 focus-visible:ring-green-500 transition-all duration-300"
                  />
                  <p className="text-xs text-green-600">Higher priority sponsors will be displayed first</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="grid gap-2"
                >
                  <Label className="text-green-800">Logo</Label>
                  <div className="flex items-center justify-center w-full">
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors",
                        editingSponsor.logo && "border-0",
                      )}
                    >
                      {editingSponsor.logo ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={editingSponsor.logo || "/placeholder.svg"}
                            alt={`${editingSponsor.name || "Sponsor"} logo`}
                            fill
                            className="object-contain p-2 rounded-lg"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                            <p className="text-white text-sm font-medium">Click to change</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                          >
                            <Upload className="w-10 h-10 mb-2 text-green-600" />
                          </motion.div>
                          <p className="mb-2 text-sm text-green-700">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-green-600">PNG, JPG or SVG</p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleSponsorLogoUpload(file)
                        }}
                      />
                    </motion.label>
                  </div>
                </motion.div>
              </div>
            )}

            <DialogFooter className="p-4 bg-green-50 border-t border-green-100">
              <Button
                variant="outline"
                onClick={() => setSponsorDialogOpen(false)}
                className="border-green-300 text-green-700 hover:bg-green-100 hover:text-green-800 transition-all duration-300"
              >
                Cancel
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSaveSponsor}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save"
                  )}
                </Button>
              </motion.div>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Prize Edit Dialog */}
      <Dialog open={prizeDialogOpen} onOpenChange={setPrizeDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-green-100 p-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader className="p-6 bg-gradient-to-r from-green-50 to-green-100">
              <DialogTitle className="text-green-800 flex items-center gap-2">
                {editingPrize?.id ? (
                  <>
                    <Edit className="h-5 w-5" />
                    Edit Prize
                  </>
                ) : (
                  <>
                    <Trophy className="h-5 w-5" />
                    Add Prize
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {editingPrize && (
              <div className="grid gap-4 p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="prize-title" className="text-green-800">
                    Title
                  </Label>
                  <Input
                    id="prize-title"
                    value={editingPrize.title || ""}
                    onChange={(e) => handlePrizeChange("title", e.target.value)}
                    placeholder="First Place"
                    className="border-green-200 focus-visible:ring-green-500 transition-all duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="prize-value" className="text-green-800">
                    Value
                  </Label>
                  <Input
                    id="prize-value"
                    value={editingPrize.value || ""}
                    onChange={(e) => handlePrizeChange("value", e.target.value)}
                    placeholder="₹10,000"
                    className="border-green-200 focus-visible:ring-green-500 transition-all duration-300"
                  />
                  <p className="text-xs text-green-600">Monetary value or other reward details</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="prize-description" className="text-green-800">
                    Description
                  </Label>
                  <Textarea
                    id="prize-description"
                    value={editingPrize.description || ""}
                    onChange={(e) => handlePrizeChange("description", e.target.value)}
                    placeholder="Prize description"
                    rows={3}
                    className="border-green-200 focus-visible:ring-green-500 transition-all duration-300"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="grid gap-2"
                >
                  <Label className="text-green-800">Prize Image</Label>
                  <div className="flex items-center justify-center w-full">
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors",
                        editingPrize.image && "border-0",
                      )}
                    >
                      {editingPrize.image ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={editingPrize.image || "/placeholder.svg"}
                            alt={`${editingPrize.title || "Prize"} image`}
                            fill
                            className="object-contain p-2 rounded-lg"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                            <p className="text-white text-sm font-medium">Click to change</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                          >
                            <Upload className="w-10 h-10 mb-2 text-green-600" />
                          </motion.div>
                          <p className="mb-2 text-sm text-green-700">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-green-600">PNG, JPG or SVG</p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handlePrizeImageUpload(file)
                        }}
                      />
                    </motion.label>
                  </div>
                </motion.div>
              </div>
            )}

            <DialogFooter className="p-4 bg-green-50 border-t border-green-100">
              <Button
                variant="outline"
                onClick={() => setPrizeDialogOpen(false)}
                className="border-green-300 text-green-700 hover:bg-green-100 hover:text-green-800 transition-all duration-300"
              >
                Cancel
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSavePrize}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save"
                  )}
                </Button>
              </motion.div>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
