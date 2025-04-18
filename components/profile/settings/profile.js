"use client"

import { useState, useEffect, useRef } from "react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import OtpInput from "@/components/ui/input-otp"

export default function ProfileSettingsContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [otpValue, setOtpValue] = useState("")
  const [showOtpInput, setShowOtpInput] = useState(false)

  // Form data states
  const [basicInfo, setBasicInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    profile_photo_url: "",
  })

  const inputRef = useRef(null)
  const [popoverOpen, setPopoverOpen] = useState(false)

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
  const [availableSkills, setAvailableSkills] = useState([])
  const [filteredSkills, setFilteredSkills] = useState([])

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

  const handleSkillSectionClick = async () => {
    if (availableSkills.length === 0) {
      try {
        const response = await fetchWithAuth("/user/additional-data/")
        const data = await response.json()
        setAvailableSkills(data.skills || [])
        setFilteredSkills(data.skills || [])
      } catch (error) {
        toast.error("Failed to load skills")
      }
    }
  }

  const handleAddSkill = () => {
    if (!skillInput.trim()) return

    const trimmed = skillInput.trim()
    const currentSkills = new Set(additionalInfo.skills || [])

    if (currentSkills.size >= 6) {
      toast.warning("You can select up to 6 skills")
      return
    }

    currentSkills.add(trimmed)
    setAdditionalInfo((prev) => ({ ...prev, skills: [...currentSkills] }))
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

  useEffect(() => {
    if (availableSkills.length > 0) {
      const filtered = availableSkills.filter((skill) => skill.toLowerCase().includes(skillInput.toLowerCase()))
      setFilteredSkills(filtered)
    }
  }, [skillInput, availableSkills])

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
            {basicInfo.auth_method === "Google" ? (
              <div className="flex items-center">
                <Input
                  id="email"
                  type="email"
                  value={basicInfo.email || ""}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
                <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  Google Account
                </Badge>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={basicInfo.email || ""}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEmailDialogOpen(true)}
                  className="whitespace-nowrap"
                >
                  Change Email
                </Button>
              </div>
            )}
          </div>

          {basicInfo.auth_method !== "Google" && (
            <div className="space-y-2">
              <Label className="flex items-center gap-1">Password</Label>
              <div>
                <Button type="button" variant="outline" onClick={() => setPasswordDialogOpen(true)}>
                  Change Password
                </Button>
              </div>
            </div>
          )}
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

      <Card className="border border-green-200 dark:border-green-700 shadow-md">
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
            <p className="text-sm text-muted-foreground mb-2">
              Choose the best 6 skills that represent you professionally.
            </p>

            <div className="flex gap-2">
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <div className="relative w-full">
                    <Input
                      ref={inputRef}
                      placeholder="Add a skill"
                      value={skillInput}
                      onFocus={() => {
                        handleSkillSectionClick()
                        setPopoverOpen(true)
                      }}
                      onBlur={() => setTimeout(() => setPopoverOpen(false), 150)} // delay to allow item click
                      onChange={(e) => {
                        setSkillInput(e.target.value)
                        setPopoverOpen(true)
                      }}
                    />
                  </div>
                </PopoverTrigger>

                <PopoverContent className="w-[200px] p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                  <div className="max-h-[200px] overflow-y-auto">
                    {filteredSkills.length > 0 ? (
                      filteredSkills.map((skill) => (
                        <button
                          key={skill}
                          className="w-full text-left px-3 py-2 hover:bg-primary/10 transition-colors"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            if (additionalInfo.skills?.length >= 6) {
                              toast.warning("You can select up to 6 skills")
                              return
                            }

                            const updatedSkills = Array.from(new Set([...additionalInfo.skills, skill]))
                            setAdditionalInfo((prev) => ({ ...prev, skills: updatedSkills }))
                            setSkillInput("")
                            setPopoverOpen(false)
                          }}
                        >
                          {skill}
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-muted-foreground text-center">No matching skills found.</div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                type="button"
                variant="outline"
                onClick={handleAddSkill}
                disabled={additionalInfo.skills?.length >= 6}
              >
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

      {/* Email Change Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{showOtpInput ? "Verify Email" : "Change Email Address"}</DialogTitle>
            <DialogDescription>
              {showOtpInput
                ? "Enter the 6-digit code sent to your new email address."
                : "Enter your new email address below."}
            </DialogDescription>
          </DialogHeader>

          {!showOtpInput ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-email">New Email Address</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter your new email address"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center space-y-4">
                <p className="text-sm text-center text-muted-foreground">
                  We've sent a verification code to {newEmail}
                </p>
                <OtpInput length={6} value={otpValue} onChange={setOtpValue} />
              </div>
            </div>
          )}

          <DialogFooter>
            {!showOtpInput ? (
              <Button
                onClick={async () => {
                  try {
                    setSaving(true)
                    const response = await fetchWithAuth("/auth/email/", {
                      method: "POST",
                      body: JSON.stringify({ new_email: newEmail }),
                    })

                    if (!response.ok) throw new Error("Failed to send verification code")

                    setShowOtpInput(true)
                    toast.success("Verification code sent to your new email")
                  } catch (error) {
                    toast.error("Failed to send verification code")
                  } finally {
                    setSaving(false)
                  }
                }}
                disabled={saving || !newEmail}
              >
                {saving ? "Sending..." : "Continue"}
              </Button>
            ) : (
              <Button
                onClick={async () => {
                  try {
                    setSaving(true)
                    const response = await fetchWithAuth("/auth/email/", {
                      method: "PATCH",
                      body: JSON.stringify({ otp: otpValue }),
                    })

                    if (!response.ok) throw new Error("Failed to verify email")

                    const data = await response.json()
                    setBasicInfo((prev) => ({ ...prev, email: newEmail }))
                    setEmailDialogOpen(false)
                    setShowOtpInput(false)
                    setNewEmail("")
                    setOtpValue("")
                    toast.success("Email changed successfully")
                  } catch (error) {
                    toast.error("Failed to verify email")
                  } finally {
                    setSaving(false)
                  }
                }}
                disabled={saving || otpValue.length !== 6}
              >
                {saving ? "Verifying..." : "Verify Email"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and a new password below.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={async () => {
                try {
                  setSaving(true)
                  const response = await fetchWithAuth("/auth/change-password/", {
                    method: "PATCH",
                    body: JSON.stringify({
                      current_password: currentPassword,
                      new_password: newPassword,
                    }),
                  })

                  if (!response.ok) throw new Error("Failed to change password")

                  setPasswordDialogOpen(false)
                  setCurrentPassword("")
                  setNewPassword("")
                  toast.success("Password changed successfully")
                } catch (error) {
                  toast.error("Failed to change password")
                } finally {
                  setSaving(false)
                }
              }}
              disabled={saving || !currentPassword || !newPassword}
            >
              {saving ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
