"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Trash2, Upload, DollarSign, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchWithAuth } from "@/app/api"
import { cn } from "@/lib/utils"

export function SponsorsForm({ initialData = [], eventId }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("sponsors")
  const [sponsors, setSponsors] = useState(initialData || [])
  const [prizes, setPrizes] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFiles, setLogoFiles] = useState({})

  // Use refs to prevent infinite loops
  const initialDataRef = useRef(false)
  const progressUpdateRef = useRef(0)

  // Store original data for change detection
  useEffect(() => {
    if (!initialDataRef.current && initialData?.length > 0) {
      setSponsors(initialData)
      initialDataRef.current = true
      setSectionData("sponsors", { sponsors: initialData, prizes })
    }
  }, [initialData, prizes, setSectionData])

  // Calculate progress based on data
  useEffect(() => {
    // Only update progress if it has changed
    const newProgress = calculateProgress()
    if (newProgress !== progressUpdateRef.current) {
      updateSectionProgress("sponsors", newProgress)
      progressUpdateRef.current = newProgress
    }
  }, [sponsors.length, prizes.length]) // Only depend on the lengths, not the full arrays

  const calculateProgress = () => {
    // Simple progress calculation based on having at least one sponsor
    if (sponsors.length > 0) {
      return 100
    }
    return 0
  }

  const handleAddSponsor = () => {
    setSponsors([...sponsors, { name: "", logo: "", priority: sponsors.length + 1 }])
  }

  const handleRemoveSponsor = (index) => {
    const newSponsors = [...sponsors]
    newSponsors.splice(index, 1)
    setSponsors(newSponsors)

    // Also remove the logo file if it exists
    const newLogoFiles = { ...logoFiles }
    delete newLogoFiles[index]
    setLogoFiles(newLogoFiles)
  }

  const handleSponsorChange = (index, field, value) => {
    const newSponsors = [...sponsors]
    newSponsors[index] = { ...newSponsors[index], [field]: value }
    setSponsors(newSponsors)
  }

  const handleFileUpload = (index, file) => {
    // Create a preview URL for the UI
    const objectUrl = URL.createObjectURL(file)
    handleSponsorChange(index, "logo", objectUrl)

    // Store the actual file for later upload
    setLogoFiles((prev) => ({
      ...prev,
      [index]: file,
    }))
  }

  const handleAddPrize = () => {
    setPrizes([...prizes, { title: "", description: "", value: "" }])
  }

  const handleRemovePrize = (index) => {
    const newPrizes = [...prizes]
    newPrizes.splice(index, 1)
    setPrizes(newPrizes)
  }

  const handlePrizeChange = (index, field, value) => {
    const newPrizes = [...prizes]
    newPrizes[index] = { ...newPrizes[index], [field]: value }
    setPrizes(newPrizes)
  }

  const handleSave = async () => {
    setIsSubmitting(true)

    try {
      // Save sponsors
      for (const [index, sponsor] of sponsors.entries()) {
        if (!sponsor.name) continue // Skip empty sponsors

        const method = sponsor.id ? "PATCH" : "POST"
        const url = sponsor.id ? `/event/organizer/sponser/${sponsor.id}/` : `/event/organizer/sponser/${eventId}/`

        // Create FormData for file upload
        const formData = new FormData()
        formData.append("name", sponsor.name)
        formData.append("priority", sponsor.priority.toString())

        // Add logo file if it exists
        if (logoFiles[index]) {
          formData.append("logo", logoFiles[index])
        }

        await fetchWithAuth(url, {
          method,
          body: formData,
        })
      }

      // Update context with new data
      setSectionData("sponsors", { sponsors, prizes })

      // Navigate to next section
      router.push(`/host/create/${eventId}/schedule`)
    } catch (error) {
      console.error("Error saving sponsors:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Tabs defaultValue="sponsors" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
        <TabsTrigger value="prizes">Prizes</TabsTrigger>
      </TabsList>

      <TabsContent value="sponsors" className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sponsors</CardTitle>
            <Button onClick={handleAddSponsor} size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Sponsor
            </Button>
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
              <div className="space-y-6">
                {sponsors.map((sponsor, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium">Sponsor {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSponsor(index)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor={`sponsor-name-${index}`}>Name</Label>
                        <Input
                          id={`sponsor-name-${index}`}
                          value={sponsor.name || ""}
                          onChange={(e) => handleSponsorChange(index, "name", e.target.value)}
                          placeholder="Sponsor name"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`sponsor-priority-${index}`}>Priority</Label>
                        <Input
                          id={`sponsor-priority-${index}`}
                          type="number"
                          min="1"
                          value={sponsor.priority || index + 1}
                          onChange={(e) => handleSponsorChange(index, "priority", Number.parseInt(e.target.value))}
                          placeholder="Priority"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label>Logo</Label>
                      <div className="mt-1">
                        <div className="flex items-center justify-center w-full">
                          <label
                            className={cn(
                              "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted",
                              sponsor.logo && "border-0",
                            )}
                          >
                            {sponsor.logo ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={sponsor.logo || "/placeholder.svg"}
                                  alt={`${sponsor.name || "Sponsor"} logo`}
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
                                if (file) handleFileUpload(index, file)
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
              <div className="space-y-6">
                {prizes.map((prize, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium">Prize {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePrize(index)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor={`prize-title-${index}`}>Title</Label>
                        <Input
                          id={`prize-title-${index}`}
                          value={prize.title || ""}
                          onChange={(e) => handlePrizeChange(index, "title", e.target.value)}
                          placeholder="First Place"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`prize-value-${index}`}>Value</Label>
                        <Input
                          id={`prize-value-${index}`}
                          value={prize.value || ""}
                          onChange={(e) => handlePrizeChange(index, "value", e.target.value)}
                          placeholder="₹10,000"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor={`prize-description-${index}`}>Description</Label>
                      <Input
                        id={`prize-description-${index}`}
                        value={prize.description || ""}
                        onChange={(e) => handlePrizeChange(index, "description", e.target.value)}
                        placeholder="Prize description"
                        className="mt-1"
                      />
                    </div>
                  </div>
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
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </Tabs>
  )
}
