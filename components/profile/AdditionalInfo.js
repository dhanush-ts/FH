"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit, Save, X, Globe, Linkedin, Github, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { fetchData, updateData } from "@/lib/api"

export default function AdditionalInfo() {
  
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [additionalInfo, setAdditionalInfo] = useState(null)
  const [formData, setFormData] = useState({})
  const [skillInput, setSkillInput] = useState("")

  useEffect(() => {
    const getAdditionalInfo = async () => {
      try {
        setLoading(true)
        const data = await fetchData("user/additional-info/");
        setAdditionalInfo(data)
        setFormData(data)
      } catch (error) {
        toast(
           "Error"
          // description: "Failed to load additional information",
          // variant: "destructive",
        )
      } finally {
        setLoading(false)
      }
    }

    getAdditionalInfo()
  }, [toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = () => {
    if (!skillInput.trim()) return

    const newSkills = [...(formData.skills || []), skillInput.trim()]
    setFormData((prev) => ({ ...prev, skills: newSkills }))
    setSkillInput("")
  }

  const handleRemoveSkill = (skill) => {
    const newSkills = (formData.skills || []).filter((s) => s !== skill)
    setFormData((prev) => ({ ...prev, skills: newSkills }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
  
      // Get only changed values
      const changedData = Object.keys(formData).reduce((acc, key) => {
        if (formData[key] !== additionalInfo[key]) {
          acc[key] = formData[key];
        }
        return acc;
      }, {});
  
      // If no changes, don't send a request
      if (Object.keys(changedData).length === 0) {
        toast("No changes detected");
        setIsEditing(false);
        setLoading(false);
        return;
      }
  
      // Send only changed fields in the request
      const updatedData = await updateData("user/additional-info/", changedData);
  
      setAdditionalInfo(updatedData);
      setIsEditing(false);
      toast("Success", { description: "Additional information updated successfully" });
  
    } catch (error) {
      toast("Error", { description: "Failed to update additional information", variant: "destructive" });
  
    } finally {
      setLoading(false);
    }
  };
  

  if (loading && !additionalInfo) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-gray-200"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Additional Information</CardTitle>
          {!isEditing ? (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={additionalInfo?.profile_photo} alt="Profile" />
                  <AvatarFallback>{additionalInfo?.id.toString().charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              {additionalInfo?.bio && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                  <p className="text-sm">{additionalInfo.bio}</p>
                </div>
              )}

              {additionalInfo?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{additionalInfo.phone}</span>
                </div>
              )}

              {additionalInfo?.skills && additionalInfo.skills.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {additionalInfo.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Links</h3>
                <div className="space-y-2">
                  {additionalInfo?.website_url && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={additionalInfo.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}

                  {additionalInfo?.linkedin_url && (
                    <div className="flex items-center space-x-2">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={additionalInfo.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}

                  {additionalInfo?.github_url && (
                    <div className="flex items-center space-x-2">
                      <Github className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={additionalInfo.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        GitHub
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 rounded-full hover:bg-muted p-1"
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
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  name="website_url"
                  placeholder="https://yourwebsite.com"
                  value={formData.website_url || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  placeholder="https://linkedin.com/in/yourusername"
                  value={formData.linkedin_url || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  name="github_url"
                  placeholder="https://github.com/yourusername"
                  value={formData.github_url || ""}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

