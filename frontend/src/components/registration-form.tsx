"use client"

import { useState } from "react"
import axios from "axios"
import { Camera, User, GraduationCap, KeyRound, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "../hooks/use-toast"
import { FaceCapture } from "@/components/face-capture"
import {
  type RegistrationFormData,
  yearOptions,
  semesterOptions,
  sectionOptions,
  classOptions,
} from "../types/registration"

export default function RegistrationForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    className: "",
    section: "",
    semester: "",
    year: "",
    faceImage: null,
    username: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhotoCapture = (imageData: string) => {
    setCapturedImage(imageData)
    setFormData((prev) => ({ ...prev, faceImage: imageData }))
    setShowCamera(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Convert base64 image to blob
      const imageResponse = await fetch(formData.faceImage!)
      const imageBlob = await imageResponse.blob()

      // Create FormData object
      const submitData = new FormData()

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "faceImage") {
          submitData.append("faceImage", imageBlob, "face.jpg")
        } else if (value) {
          submitData.append(key, value)
        }
      })

      // Send data to backend
      const response = await axios.post("https://localhost:8000/api/register", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      })

      // Reset form
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        className: "",
        section: "",
        semester: "",
        year: "",
        faceImage: null,
        username: "",
        password: "",
      })
      setCapturedImage(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "There was an error during registration. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Enter your personal details for registration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" name="middleName" value={formData.middleName} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Academic Information
          </CardTitle>
          <CardDescription>Select your class and academic details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="className">Class</Label>
              <Select value={formData.className} onValueChange={(value) => handleSelectChange("className", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select value={formData.section} onValueChange={(value) => handleSelectChange("section", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sectionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={formData.semester} onValueChange={(value) => handleSelectChange("semester", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={formData.year} onValueChange={(value) => handleSelectChange("year", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Face Enrollment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5" />
            Face Enrollment
          </CardTitle>
          <CardDescription>Position your face in the center and ensure good lighting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-muted">
              {!showCamera && !capturedImage && (
                <div className="aspect-video w-full flex items-center justify-center">
                  <Button type="button" onClick={() => setShowCamera(true)} size="lg" className="gap-2">
                    <Camera className="h-5 w-5" />
                    Open Camera
                  </Button>
                </div>
              )}

              {showCamera && !capturedImage && (
                <FaceCapture onCapture={handlePhotoCapture} onCancel={() => setShowCamera(false)} />
              )}

              {capturedImage && (
                <div className="relative">
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Captured face"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-4 flex justify-center">
                    <Button
                      type="button"
                      onClick={() => {
                        setCapturedImage(null)
                        setFormData((prev) => ({ ...prev, faceImage: null }))
                        setShowCamera(true)
                      }}
                      variant="secondary"
                      className="bg-background shadow-lg"
                    >
                      Retake Photo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>Create your login credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-6">
          <Button type="submit" className="w-full" size="lg" disabled={isLoading || !formData.faceImage}>
            {isLoading ? "Registering..." : "Complete Registration"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

