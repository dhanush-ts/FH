"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Edit, Save, X, Globe, Linkedin, Github, Phone, Info, Link2, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { fetchWithAuth } from "@/lib/api"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"

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
        const response = await fetchWithAuth("/user/additional-info/")
        const data = await response.json()
        setAdditionalInfo(data)
        setFormData(data)
      } catch (error) {
        toast("Error")
      } finally {
        setLoading(false)
      }
    }

    getAdditionalInfo()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }))
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
    e.preventDefault()

    try {
      setLoading(true)

      // Get only changed values
      const changedData = Object.keys(formData).reduce((acc, key) => {
        if (formData[key] !== additionalInfo[key]) {
          acc[key] = formData[key]
        }
        return acc
      }, {})

      // If no changes, don't send a request
      if (Object.keys(changedData).length === 0) {
        toast("No changes detected")
        setIsEditing(false)
        setLoading(false)
        return
      }

      // Send only changed fields in the request
      const response = await fetchWithAuth("/user/additional-info/", {
        method: "PATCH",
        body: JSON.stringify(changedData)
      })
      const updatedData = await response.json()
      setAdditionalInfo(updatedData)
      setIsEditing(false)
      toast("Success", { description: "Additional information updated successfully" })
    } catch (error) {
      toast("Error", { description: "Failed to update additional information", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  }

  if (loading && !additionalInfo) {
    return (
      <Card className="w-full overflow-hidden border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6">
          <CardTitle className="flex items-center text-xl font-bold">
            <Info className="h-5 w-5 mr-2 text-primary" />
            Additional Information
          </CardTitle>
          {!isEditing ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditing(true)}
              className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditing(false)}
              className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {!isEditing ? (
            <div className="space-y-3">
              {additionalInfo?.bio && (
                <motion.div 
                  className="space-y-2 p-4 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                  <p className="text-sm italic">{additionalInfo.bio}</p>
                </motion.div>
              )}
              <div className="flex justify-between mr-2">
                {additionalInfo?.phone && (
                  <motion.div 
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{additionalInfo.phone}</span>
                  </motion.div>
                )}
                {additionalInfo?.phone && (
                <motion.div 
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <User className="h-4 w-4 text-primary" />
                  <span>{additionalInfo.gender}</span>
                </motion.div>
              )}
              </div>
              
              {additionalInfo?.skills && additionalInfo.skills.length > 0 && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-sm font-medium text-muted-foreground">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {additionalInfo.skills.map((skill, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -2, scale: 1.05 }}
                        >
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                            {skill}
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
              
              <motion.div 
                className="space-y-3 mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-sm font-medium text-muted-foreground">Links</h3>
                <div className="space-y-2">
                  {additionalInfo?.website_url && (
                    <motion.div 
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      <Globe className="h-4 w-4 text-primary" />
                      <a
                        href={additionalInfo.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Website
                      </a>
                    </motion.div>
                  )}
                  
                  {additionalInfo?.linkedin_url && (
                    <motion.div 
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      <Linkedin className="h-4 w-4 text-primary" />
                      <a
                        href={additionalInfo.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        LinkedIn
                      </a>
                    </motion.div>
                  )}
                  
                  {additionalInfo?.github_url && (
                    <motion.div 
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      <Github className="h-4 w-4 text-primary" />
                      <a
                        href={additionalInfo.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        GitHub
                      </a>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  className="min-h-[100px] border-gray-300 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">
                  Gender
                </Label>
                <Select value={formData.gender || ""} onValueChange={handleGenderChange}>
                  <SelectTrigger className="border-gray-300 focus:ring-primary focus:border-primary">
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
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md min-h-[40px]">
                  <AnimatePresence>
                    {formData.skills?.map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      >
                        <Badge variant="secondary" className="flex items-center gap-1 bg-primary/10 text-primary">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 rounded-full hover:bg-primary/20 p-1 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
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
                    className="border-gray-300 focus:ring-primary focus:border-primary"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddSkill}
                    className="border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website_url" className="text-sm font-medium flex items-center">
                  <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
                  Website URL
                </Label>
                <Input
                  id="website_url"
                  name="website_url"
                  placeholder="https://yourwebsite.com"
                  value={formData.website_url || ""}
                  onChange={handleChange}
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin_url" className="text-sm font-medium flex items-center">
                  <Linkedin className="h-4 w-4 mr-1 text-muted-foreground" />
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  placeholder="https://linkedin.com/in/yourusername"
                  value={formData.linkedin_url || ""}
                  onChange={handleChange}
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="github_url" className="text-sm font-medium flex items-center">
                  <Github className="h-4 w-4 mr-1 text-muted-foreground" />
                  GitHub URL
                </Label>
                <Input
                  id="github_url"
                  name="github_url"
                  placeholder="https://github.com/yourusername"
                  value={formData.github_url || ""}
                  onChange={handleChange}
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </motion.form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
