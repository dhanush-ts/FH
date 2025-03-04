"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit, Save, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { fetchData, updateData } from "@/lib/api"

export default function BasicInfo() {
  
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    const getProfileData = async () => {
      try {
        setLoading(true)
        const data = await fetchData("user/basic-profile/")
        setProfileData(data)
        setFormData(data)
      } catch (error) {
        toast(
          "Error",
          // description: "Failed to load profile data",
          // variant: "destructive",
        )
      } finally {
        setLoading(false)
      }
    }

    getProfileData()
  }, [toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const updatedData = await updateData("user/basic-profile/", formData)
      setProfileData(updatedData)
      setIsEditing(false)
      toast(
        "Success"
        // description: "Profile updated successfully",
      )
    } catch (error) {
      toast(
        "Error",
        // description: "Failed to update profile",
        // variant: "destructive",
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading && !profileData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Basic Information</CardTitle>
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">First Name</p>
                  <p>{profileData?.first_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                  <p>{profileData?.last_name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{profileData?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p>{profileData?.gender}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input id="first_name" name="first_name" value={formData.first_name || ""} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input id="last_name" name="last_name" value={formData.last_name || ""} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender || ""} onValueChange={handleGenderChange}>
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

