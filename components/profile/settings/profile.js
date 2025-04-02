"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { fetchWithAuth } from "@/app/api"
import { User, Mail, Info, Globe, Linkedin, Github, Phone, Save, X, Plus } from "lucide-react"

export default function ProfileSettingsContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form data states
  const [basicInfo, setBasicInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    profile_photo_url: "",
  })

  const [additionalInfo, setAdditionalInfo] = useState({
    bio: "",
    phone: "",
    gender: "",
    skills: [],
    website_url: "",
    linkedin_url: "",
    github_url: "",
  })

  const [skillInput, setSkillInput] = useState("")

  // Fetch data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        const basicResponse = await fetchWithAuth("/user/basic-profile/")
        const additionalResponse = await fetchWithAuth("/user/additional-info/")

        const basicData = await basicResponse.json()
        const additionalData = await additionalResponse.json()

        setBasicInfo(basicData)
        setAdditionalInfo(additionalData)
      } catch (error) {
        toast.error("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  // Handle form changes
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target
    setBasicInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleAdditionalInfoChange = (e) => {
    const { name, value } = e.target
    setAdditionalInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value) => {
    setAdditionalInfo((prev) => ({ ...prev, gender: value }))
  }

  const handleAddSkill = () => {
    if (!skillInput.trim()) return

    const newSkills = [...(additionalInfo.skills || []), skillInput.trim()]
    setAdditionalInfo((prev) => ({ ...prev, skills: newSkills }))
    setSkillInput("")
  }

  const handleRemoveSkill = (skill) => {
    const newSkills = (additionalInfo.skills || []).filter((s) => s !== skill)
    setAdditionalInfo((prev) => ({ ...prev, skills: newSkills }))
  }

  // Save changes
  const handleSaveBasicInfo = async () => {
    try {
      setSaving(true)
      const response = await fetchWithAuth("/user/basic-profile/", {
        method: "PATCH",
        body: JSON.stringify(basicInfo),
      })

      if (!response.ok) throw new Error("Failed to update basic information")

      toast.success("Basic information updated successfully")
    } catch (error) {
      toast.error("Failed to update basic information")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAdditionalInfo = async () => {
    try {
      setSaving(true)
      const response = await fetchWithAuth("/user/additional-info/", {
        method: "PATCH",
        body: JSON.stringify(additionalInfo),
      })

      if (!response.ok) throw new Error("Failed to update additional information")

      toast.success("Additional information updated successfully")
    } catch (error) {
      toast.error("Failed to update additional information")
    } finally {
      setSaving(false)
    }
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
            <User className="h-5 w-5 text-primary" />
            Basic Profile Information
          </CardTitle>
          <CardDescription>Update your basic profile details that appear on your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile_photo_url">Profile Photo URL</Label>
            <Input
              id="profile_photo_url"
              name="profile_photo_url"
              value={basicInfo.profile_photo_url || ""}
              onChange={handleBasicInfoChange}
              placeholder="https://example.com/your-photo.jpg"
            />
            <p className="text-sm text-muted-foreground">
              Enter a URL to your profile photo. Recommended size: 400x400 pixels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={basicInfo.first_name || ""}
                onChange={handleBasicInfoChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={basicInfo.last_name || ""}
                onChange={handleBasicInfoChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={basicInfo.email || ""}
              onChange={handleBasicInfoChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveBasicInfo} disabled={saving} className="bg-primary hover:bg-primary/90">
            {saving ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Additional Information
          </CardTitle>
          <CardDescription>Add more details about yourself and your professional presence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={additionalInfo.bio || ""}
              onChange={handleAdditionalInfoChange}
              placeholder="Tell us about yourself"
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={additionalInfo.phone || ""}
                onChange={handleAdditionalInfoChange}
                placeholder="Your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={additionalInfo.gender || ""} onValueChange={handleGenderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Transgender">Transgender</SelectItem>
                  <SelectItem value="Intersex">Intersex</SelectItem>
                  <SelectItem value="Non Binary">Non Binary</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md min-h-[40px]">
              {additionalInfo.skills?.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-primary/10 text-primary">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 rounded-full hover:bg-primary/20 p-1 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddSkill()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddSkill}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              Website URL
            </Label>
            <Input
              id="website_url"
              name="website_url"
              value={additionalInfo.website_url || ""}
              onChange={handleAdditionalInfoChange}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin_url" className="flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              LinkedIn URL
            </Label>
            <Input
              id="linkedin_url"
              name="linkedin_url"
              value={additionalInfo.linkedin_url || ""}
              onChange={handleAdditionalInfoChange}
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url" className="flex items-center gap-1">
              <Github className="h-4 w-4" />
              GitHub URL
            </Label>
            <Input
              id="github_url"
              name="github_url"
              value={additionalInfo.github_url || ""}
              onChange={handleAdditionalInfoChange}
              placeholder="https://github.com/yourusername"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveAdditionalInfo} disabled={saving} className="bg-primary hover:bg-primary/90">
            {saving ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

