"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Upload, X } from "lucide-react"
import { fetchWithAuth } from "@/app/api"


export default function CreateHackathonDialog({ open, onOpenChange }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const fileInputRef = useRef(null)

  // Fix for dialog closing immediately
  useEffect(() => {
    // This ensures the state is properly synced with the prop
    if (open) {
      // Reset form when dialog opens
      setTitle("")
      setShortDescription("")
      setLogoFile(null)
      setLogoPreview(null)
    }
  }, [open])

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      toast("Please enter a title for your hackathon")
      return
    }

    if (!shortDescription.trim()) {
      toast("Please enter a short description")
      return
    }

    if (!logoFile) {
      toast("Please upload a logo for your hackathon")
      return
    }

    setIsLoading(true)

    try {
      const df = new FormData()
      df.append("title", title)
      df.append("short_description", shortDescription)

      if (logoFile) {
        df.append("logo", logoFile)
      }
      
      for (let [key, value] of df.entries()) {
        console.log(`${key}:`, value)
      }
      

      const response = await fetchWithAuth("/event/organizer/base-event/", {
        headers: {},
        method: "POST",
        body: df,
      })


      if (!response.ok) {
        throw new Error("Failed to create hackathon")
      }

      const data = await response.json()

      toast("Hackathon created successfully!")

      // Close the dialog and navigate to the edit page
      onOpenChange(false)
      router.push(`/host/create/${data.id}`)
    } catch (error) {
      console.error("Error creating hackathon:", error)
      toast("Failed to create hackathon. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Hackathon</DialogTitle>
          <DialogDescription>Fill in the details below to create your new hackathon event.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Event Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Coding Challenge 2025"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo" className="text-sm font-medium">
              Event Logo <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative h-20 w-20 rounded-md overflow-hidden border">
                  <Image src={logoPreview || "/placeholder.svg"} alt="Logo preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute top-0 right-0 bg-black/70 p-1 rounded-bl-md"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-20 w-20 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">Upload</span>
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="logo"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  {logoFile ? "Change Logo" : "Select Logo"}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">Recommended: Square image, at least 300x300px</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Short Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief description of your hackathon event"
              className="resize-none"
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground">{shortDescription.length}/150 characters</p>
          </div>

        

          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full font-semibold">
              {isLoading ? "Creating..." : "Create Hackathon"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
