"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, MoreVertical, Calendar, School, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { fetchData, createData, updateData, deleteData } from "@/lib/api"

export default function Education() {
  
  const [loading, setLoading] = useState(true)
  const [educationList, setEducationList] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentEducation, setCurrentEducation] = useState(null)
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    start_year: new Date().getFullYear(),
  })

  useEffect(() => {
    const getEducationData = async () => {
      try {
        setLoading(true)
        const data = await fetchData("user/education/")
        setEducationList(data)
      } catch (error) {
        toast(
       "Error",
          // description: "Failed to load education data",
          // variant: "destructive",
        )
      } finally {
        setLoading(false)
      }
    }

    getEducationData()
  }, [toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name.includes("year") ? Number.parseInt(value) || "" : value }))
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const newEducation = await createData("user/education/", formData)
      setEducationList((prev) => [...prev, newEducation])
      setIsAddDialogOpen(false)
      setFormData({
        degree: "",
        institution: "",
        start_year: new Date().getFullYear(),
      })
      toast(
        "Success",
        // description: "Education added successfully",
      )
    } catch (error) {
      toast(
      "Error",
        // description: "Failed to add education",
        // variant: "destructive",
      )
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!currentEducation) return

    try {
      setLoading(true)
      const updatedEducation = await updateData(`user/education/${currentEducation.id}/`, formData)
      setEducationList((prev) => prev.map((item) => (item.id === updatedEducation.id ? updatedEducation : item)))
      setIsEditDialogOpen(false)
      setCurrentEducation(null)
      toast(
       "Success"
        // description: "Education updated successfully",
      )
    } catch (error) {
      toast(
      "Error",
        // description: "Failed to update education",
        // variant: "destructive",
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      await deleteData(`user/education/${id}/`)
      setEducationList((prev) => prev.filter((item) => item.id !== id))
      toast(
    "Success",
        // description: "Education deleted successfully",
      )
    } catch (error) {
      toast(
       "Error"
        // description: "Failed to delete education",
        // variant: "destructive",
      )
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (education) => {
    setCurrentEducation(education)
    setFormData({
      degree: education.degree,
      institution: education.institution,
      start_year: education.start_year,
      end_year: education.end_year || undefined,
      grade: education.grade || undefined,
    })
    setIsEditDialogOpen(true)
  }

  if (loading && educationList.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Education</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Education</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Education</DialogTitle>
              <DialogDescription>Add your educational background details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree/Qualification</Label>
                  <Input
                    id="degree"
                    name="degree"
                    placeholder="B.E. Computer Science"
                    value={formData.degree}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    name="institution"
                    placeholder="University/School Name"
                    value={formData.institution}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_year">Start Year</Label>
                    <Input
                      id="start_year"
                      name="start_year"
                      type="number"
                      placeholder="2020"
                      value={formData.start_year || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_year">End Year (Optional)</Label>
                    <Input
                      id="end_year"
                      name="end_year"
                      type="number"
                      placeholder="2024"
                      value={formData.end_year || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/CGPA (Optional)</Label>
                  <Input
                    id="grade"
                    name="grade"
                    placeholder="8.5"
                    value={formData.grade || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <AnimatePresence>
        {educationList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg"
          >
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No education details added yet. Click the "Add Education" button to add your educational background.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {educationList.map((education) => (
              <motion.div
                key={education.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-xl">{education.degree}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <School className="h-4 w-4 mr-1" />
                        {education.institution}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(education)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(education.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {education.start_year} - {education.end_year || "Present"}
                      </span>
                    </div>
                    {education.grade && (
                      <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Grade: {education.grade}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Education</DialogTitle>
            <DialogDescription>Update your educational background details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-degree">Degree/Qualification</Label>
                <Input id="edit-degree" name="degree" value={formData.degree || ""} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-institution">Institution</Label>
                <Input
                  id="edit-institution"
                  name="institution"
                  value={formData.institution || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start_year">Start Year</Label>
                  <Input
                    id="edit-start_year"
                    name="start_year"
                    type="number"
                    value={formData.start_year || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-end_year">End Year (Optional)</Label>
                  <Input
                    id="edit-end_year"
                    name="end_year"
                    type="number"
                    value={formData.end_year || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-grade">Grade/CGPA (Optional)</Label>
                <Input id="edit-grade" name="grade" value={formData.grade || ""} onChange={handleChange} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

