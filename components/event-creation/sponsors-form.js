// "use client"

// import { useState, useRef } from "react"
// import { useRouter } from "next/navigation"
// import Image from "next/image"
// import { Plus, Trash2, Upload, DollarSign, Award } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { fetchWithAuth } from "@/app/api"
// import { cn } from "@/lib/utils"

// export function SponsorsForm({ initialData = [], eventId }) {
//   const router = useRouter()
//   const [activeTab, setActiveTab] = useState("sponsors")
//   const [sponsors, setSponsors] = useState(initialData || [])
//   const [prizes, setPrizes] = useState([])
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [logoFiles, setLogoFiles] = useState({})
//   const [prizeImages, setPrizeImages] = useState({})

//   // Store original data for comparison
//   const originalSponsorsRef = useRef(JSON.stringify(initialData || []))
//   const originalPrizesRef = useRef(JSON.stringify([]))

//   const handleAddSponsor = () => {
//     setSponsors([...sponsors, { name: "", logo: "", priority: sponsors.length + 1 }])
//   }

//   const handleRemoveSponsor = (index) => {
//     const newSponsors = [...sponsors]
//     newSponsors.splice(index, 1)
//     setSponsors(newSponsors)

//     // Also remove the logo file if it exists
//     const newLogoFiles = { ...logoFiles }
//     delete newLogoFiles[index]
//     setLogoFiles(newLogoFiles)
//   }

//   const handleSponsorChange = (index, field, value) => {
//     const newSponsors = [...sponsors]
//     newSponsors[index] = { ...newSponsors[index], [field]: value }
//     setSponsors(newSponsors)
//   }

//   const handleFileUpload = (index, file) => {
//     const objectUrl = URL.createObjectURL(file)
//     handleSponsorChange(index, "logo", objectUrl)

//     setLogoFiles((prev) => ({
//       ...prev,
//       [index]: file,
//     }))
//   }

//   const handleAddPrize = () => {
//     setPrizes([...prizes, { title: "", description: "", value: "", image: "" }])
//   }

//   const handleRemovePrize = (index) => {
//     const newPrizes = [...prizes]
//     newPrizes.splice(index, 1)
//     setPrizes(newPrizes)

//     // Also remove the image file if it exists
//     const newPrizeImages = { ...prizeImages }
//     delete newPrizeImages[index]
//     setPrizeImages(newPrizeImages)
//   }

//   const handlePrizeChange = (index, field, value) => {
//     const newPrizes = [...prizes]
//     newPrizes[index] = { ...newPrizes[index], [field]: value }
//     setPrizes(newPrizes)
//   }

//   const handlePrizeImageUpload = (index, file) => {
//     // Create a preview URL for the UI
//     const objectUrl = URL.createObjectURL(file)
//     handlePrizeChange(index, "image", objectUrl)

//     // Store the actual file for later upload
//     setPrizeImages((prev) => ({
//       ...prev,
//       [index]: file,
//     }))
//   }

//   const handleSave = async () => {
//     setIsSubmitting(true)

//     try {
//       // Save sponsors
//       for (const [index, sponsor] of sponsors.entries()) {
//         if (!sponsor.name) continue // Skip empty sponsors

//         const method = sponsor.id ? "PATCH" : "POST"
//         const url = sponsor.id ? `/event/host/sponser/${sponsor.id}/` : `/event/host/sponser/${eventId}/`

//         // Create FormData for file upload
//         const formData = new FormData()
//         formData.append("name", sponsor.name)
//         formData.append("priority", sponsor.priority.toString())

//         // Add logo file if it exists
//         if (logoFiles[index]) {
//           formData.append("logo", logoFiles[index])
//         }

//         const r = await fetchWithAuth(url, {
//           method,
//           body: formData,
//         })
//         const res = await r.json();
//         console.log(res);
        
//       }

//       // Save prizes
//       for (const [index, prize] of prizes.entries()) {
//         if (!prize.title) continue // Skip empty prizes

//         const method = prize.id ? "PATCH" : "POST"
//         const url = prize.id ? `/event/host/prize/${prize.id}/` : `/event/host/prize/${eventId}/`

//         // Create FormData for file upload
//         const formData = new FormData()
//         formData.append("title", prize.title)
//         formData.append("description", prize.description || "")
//         formData.append("value", prize.value || "")

//         // Add image file if it exists
//         if (prizeImages[index]) {
//           formData.append("image", prizeImages[index])
//         }

//         await fetchWithAuth(url, {
//           method,
//           body: formData,
//         })
//       }

//       // Navigate to next section
//       router.push(`/host/create/${eventId}/schedule`)
//     } catch (error) {
//       console.error("Error saving sponsors and prizes:", error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Tabs defaultValue="sponsors" value={activeTab} onValueChange={setActiveTab} className="w-full">
//       <TabsList className="grid w-full grid-cols-2">
//         <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
//         <TabsTrigger value="prizes">Prizes</TabsTrigger>
//       </TabsList>

//       <TabsContent value="sponsors" className="mt-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle>Sponsors</CardTitle>
//             <Button onClick={handleAddSponsor} size="sm">
//               <Plus className="mr-2 h-4 w-4" /> Add Sponsor
//             </Button>
//           </CardHeader>
//           <CardContent>
//             {sponsors.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-8 text-center">
//                 <div className="rounded-full bg-muted p-3">
//                   <DollarSign className="h-6 w-6 text-muted-foreground" />
//                 </div>
//                 <h3 className="mt-4 text-lg font-medium">No sponsors yet</h3>
//                 <p className="mt-2 text-sm text-muted-foreground">
//                   Add sponsors to your event to showcase their support
//                 </p>
//                 <Button onClick={handleAddSponsor} className="mt-4" variant="outline">
//                   <Plus className="mr-2 h-4 w-4" /> Add Sponsor
//                 </Button>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 {sponsors.map((sponsor, index) => (
//                   <div key={index} className="rounded-lg border p-4">
//                     <div className="flex justify-between">
//                       <h3 className="text-lg font-medium">Sponsor {index + 1}</h3>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleRemoveSponsor(index)}
//                         className="h-8 w-8 text-destructive"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>

//                     <div className="mt-4 grid gap-4 md:grid-cols-2">
//                       <div>
//                         <Label htmlFor={`sponsor-name-${index}`}>Name</Label>
//                         <Input
//                           id={`sponsor-name-${index}`}
//                           value={sponsor.name || ""}
//                           onChange={(e) => handleSponsorChange(index, "name", e.target.value)}
//                           placeholder="Sponsor name"
//                           className="mt-1"
//                         />
//                       </div>

//                       <div>
//                         <Label htmlFor={`sponsor-priority-${index}`}>Priority</Label>
//                         <Input
//                           id={`sponsor-priority-${index}`}
//                           type="number"
//                           min="1"
//                           value={sponsor.priority || index + 1}
//                           onChange={(e) => handleSponsorChange(index, "priority", Number.parseInt(e.target.value))}
//                           placeholder="Priority"
//                           className="mt-1"
//                         />
//                       </div>
//                     </div>

//                     <div className="mt-4">
//                       <Label>Logo</Label>
//                       <div className="mt-1">
//                         <div className="flex items-center justify-center w-full">
//                           <label
//                             className={cn(
//                               "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted",
//                               sponsor.logo && "border-0",
//                             )}
//                           >
//                             {sponsor.logo ? (
//                               <div className="relative w-full h-full">
//                                 <Image
//                                   src={sponsor.logo || "/placeholder.svg"}
//                                   alt={`${sponsor.name || "Sponsor"} logo`}
//                                   fill
//                                   className="object-contain p-2 rounded-lg"
//                                 />
//                                 <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
//                                   <p className="text-white text-sm">Click to change</p>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                 <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
//                                 <p className="mb-2 text-sm text-muted-foreground">
//                                   <span className="font-semibold">Click to upload</span> or drag and drop
//                                 </p>
//                                 <p className="text-xs text-muted-foreground">PNG, JPG or SVG</p>
//                               </div>
//                             )}
//                             <input
//                               type="file"
//                               className="hidden"
//                               accept="image/*"
//                               onChange={(e) => {
//                                 const file = e.target.files?.[0]
//                                 if (file) handleFileUpload(index, file)
//                               }}
//                             />
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </TabsContent>

//       <TabsContent value="prizes" className="mt-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle>Prizes</CardTitle>
//             <Button onClick={handleAddPrize} size="sm">
//               <Plus className="mr-2 h-4 w-4" /> Add Prize
//             </Button>
//           </CardHeader>
//           <CardContent>
//             {prizes.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-8 text-center">
//                 <div className="rounded-full bg-muted p-3">
//                   <Award className="h-6 w-6 text-muted-foreground" />
//                 </div>
//                 <h3 className="mt-4 text-lg font-medium">No prizes yet</h3>
//                 <p className="mt-2 text-sm text-muted-foreground">
//                   Add prizes to incentivize participation in your event
//                 </p>
//                 <Button onClick={handleAddPrize} className="mt-4" variant="outline">
//                   <Plus className="mr-2 h-4 w-4" /> Add Prize
//                 </Button>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 {prizes.map((prize, index) => (
//                   <div key={index} className="rounded-lg border p-4">
//                     <div className="flex justify-between">
//                       <h3 className="text-lg font-medium">Prize {index + 1}</h3>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleRemovePrize(index)}
//                         className="h-8 w-8 text-destructive"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>

//                     <div className="mt-4 grid gap-4 md:grid-cols-2">
//                       <div>
//                         <Label htmlFor={`prize-title-${index}`}>Title</Label>
//                         <Input
//                           id={`prize-title-${index}`}
//                           value={prize.title || ""}
//                           onChange={(e) => handlePrizeChange(index, "title", e.target.value)}
//                           placeholder="First Place"
//                           className="mt-1"
//                         />
//                       </div>

//                       <div>
//                         <Label htmlFor={`prize-value-${index}`}>Value</Label>
//                         <Input
//                           id={`prize-value-${index}`}
//                           value={prize.value || ""}
//                           onChange={(e) => handlePrizeChange(index, "value", e.target.value)}
//                           placeholder="₹10,000"
//                           className="mt-1"
//                         />
//                       </div>
//                     </div>

//                     <div className="mt-4">
//                       <Label htmlFor={`prize-description-${index}`}>Description</Label>
//                       <Input
//                         id={`prize-description-${index}`}
//                         value={prize.description || ""}
//                         onChange={(e) => handlePrizeChange(index, "description", e.target.value)}
//                         placeholder="Prize description"
//                         className="mt-1"
//                       />
//                     </div>

//                     <div className="mt-4">
//                       <Label>Prize Image</Label>
//                       <div className="mt-1">
//                         <div className="flex items-center justify-center w-full">
//                           <label
//                             className={cn(
//                               "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted",
//                               prize.image && "border-0",
//                             )}
//                           >
//                             {prize.image ? (
//                               <div className="relative w-full h-full">
//                                 <Image
//                                   src={prize.image || "/placeholder.svg"}
//                                   alt={`${prize.title || "Prize"} image`}
//                                   fill
//                                   className="object-contain p-2 rounded-lg"
//                                 />
//                                 <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
//                                   <p className="text-white text-sm">Click to change</p>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                 <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
//                                 <p className="mb-2 text-sm text-muted-foreground">
//                                   <span className="font-semibold">Click to upload</span> or drag and drop
//                                 </p>
//                                 <p className="text-xs text-muted-foreground">PNG, JPG or SVG</p>
//                               </div>
//                             )}
//                             <input
//                               type="file"
//                               className="hidden"
//                               accept="image/*"
//                               onChange={(e) => {
//                                 const file = e.target.files?.[0]
//                                 if (file) handlePrizeImageUpload(index, file)
//                               }}
//                             />
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </TabsContent>

//       <div className="mt-6 flex justify-between">
//         <Button type="button" variant="outline" onClick={() => router.push(`/host/create/${eventId}/media`)}>
//           Previous
//         </Button>
//         <Button onClick={handleSave} disabled={isSubmitting}>
//           {isSubmitting ? "Saving..." : "Save & Continue"}
//         </Button>
//       </div>
//     </Tabs>
//   )
// }

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Trash2, Upload, DollarSign, Award, MoreVertical, Edit } from "lucide-react"
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

export function SponsorsForm({ initialSponsors = [], initialPrizes = [], eventId }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("sponsors")
  const [sponsors, setSponsors] = useState(initialSponsors || [])
  const [prizes, setPrizes] = useState(initialPrizes || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFiles, setLogoFiles] = useState({})
  const [prizeImages, setPrizeImages] = useState({})

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

      const r = await fetchWithAuth(url, {
        method,
        body: formData,
      },true)

      const response = await r.json()

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

      const r = await fetchWithAuth(url, {
        method,
        body: formData,
      },true)

      const response = await r.json()

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

  return (
    <>
      <Tabs defaultValue="sponsors" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
          <TabsTrigger value="prizes">Prizes</TabsTrigger>
        </TabsList>

        <TabsContent value="sponsors" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sponsors</CardTitle>
            </CardHeader>
            <CardContent>
              {sponsors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <DollarSign className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No sponsors yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add sponsors to your event to showcase their support
                  </p>
                  <Button onClick={handleAddSponsor} className="mt-4" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Add Sponsor
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {sponsors.map((sponsor) => (
                    <div
                      key={sponsor.id || sponsor.name}
                      className="relative group flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditSponsor(sponsor)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRemoveSponsor(sponsor)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="w-24 h-24 mb-3 flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden">
                        {sponsor.logo ? (
                          <Image
                            src={sponsor.logo || "/placeholder.svg"}
                            alt={sponsor.name}
                            width={96}
                            height={96}
                            className="object-contain"
                          />
                        ) : (
                          <DollarSign className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <span className="text-center font-medium truncate w-full">{sponsor.name}</span>
                    </div>
                  ))}

                  {/* Add sponsor button */}
                  <div
                    onClick={handleAddSponsor}
                    className="flex flex-col items-center justify-center p-4 border rounded-lg border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-24 h-24 mb-3 flex items-center justify-center bg-muted/30 rounded-lg">
                      <Plus className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <span className="text-center font-medium">Add Sponsor</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prizes" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Prizes</CardTitle>
              <Button onClick={handleAddPrize} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Prize
              </Button>
            </CardHeader>
            <CardContent>
              {prizes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Award className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No prizes yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add prizes to incentivize participation in your event
                  </p>
                  <Button onClick={handleAddPrize} className="mt-4" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Add Prize
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prizes.map((prize) => (
                    <Card key={prize.id || prize.title} className="relative group overflow-hidden">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditPrize(prize)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRemovePrize(prize)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {prize.image && (
                        <div className="relative w-full h-40">
                          <Image
                            src={prize.image || "/placeholder.svg"}
                            alt={prize.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <CardContent className={cn("p-4", !prize.image && "pt-6")}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg">{prize.title}</h3>
                          {prize.value && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {prize.value}
                            </span>
                          )}
                        </div>

                        {prize.description && (
                          <p className="text-muted-foreground text-sm line-clamp-3">{prize.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <div className="mt-6 flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push(`/host/create/${eventId}/media`)}>
            Previous
          </Button>
          <Button onClick={handleContinue}>Continue to Schedule</Button>
        </div>
      </Tabs>

      {/* Sponsor Edit Dialog */}
      <Dialog open={sponsorDialogOpen} onOpenChange={setSponsorDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingSponsor?.id ? "Edit Sponsor" : "Add Sponsor"}</DialogTitle>
          </DialogHeader>

          {editingSponsor && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="sponsor-name">Name</Label>
                <Input
                  id="sponsor-name"
                  value={editingSponsor.name || ""}
                  onChange={(e) => handleSponsorChange("name", e.target.value)}
                  placeholder="Sponsor name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sponsor-priority">Priority</Label>
                <Input
                  id="sponsor-priority"
                  type="number"
                  min="1"
                  value={editingSponsor.priority || 1}
                  onChange={(e) => handleSponsorChange("priority", Number.parseInt(e.target.value))}
                  placeholder="Priority"
                />
              </div>

              <div className="grid gap-2">
                <Label>Logo</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted",
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
                          <p className="text-white text-sm">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or SVG</p>
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
                  </label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSponsorDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSponsor} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prize Edit Dialog */}
      <Dialog open={prizeDialogOpen} onOpenChange={setPrizeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingPrize?.id ? "Edit Prize" : "Add Prize"}</DialogTitle>
          </DialogHeader>

          {editingPrize && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="prize-title">Title</Label>
                <Input
                  id="prize-title"
                  value={editingPrize.title || ""}
                  onChange={(e) => handlePrizeChange("title", e.target.value)}
                  placeholder="First Place"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="prize-value">Value</Label>
                <Input
                  id="prize-value"
                  value={editingPrize.value || ""}
                  onChange={(e) => handlePrizeChange("value", e.target.value)}
                  placeholder="₹10,000"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="prize-description">Description</Label>
                <Textarea
                  id="prize-description"
                  value={editingPrize.description || ""}
                  onChange={(e) => handlePrizeChange("description", e.target.value)}
                  placeholder="Prize description"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label>Prize Image</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted",
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
                          <p className="text-white text-sm">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or SVG</p>
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
                  </label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPrizeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePrize} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
