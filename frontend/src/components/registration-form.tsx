"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, AlertCircle, Loader2 } from "lucide-react"
import { registerStudent, type RegistrationData } from "@/services/register-api"

export default function RegistrationForm() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [error, setError] = useState<string>("")
  const [faceImage, setFaceImage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setError("")
    } catch (err) {
      setError("Unable to access camera. Please ensure you have granted camera permissions.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = canvas.toDataURL("image/jpeg")
        setFaceImage(imageData)
        stopCamera()
        setShowCamera(false)
        setSuccessMessage("Photo captured successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    if (!faceImage) {
      setError("Please capture your face photo before submitting.")
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData(e.target as HTMLFormElement)

      const registrationData: RegistrationData = {
        firstname: formData.get("firstname") as string,
        middlename: formData.get("middlename") as string,
        lastname: formData.get("lastname") as string,
        class: formData.get("class") as string,
        section: formData.get("section") as string,
        semester: formData.get("semester") as string,
        year: Number(formData.get("year") as string),
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        faceImage: faceImage,
      }

      const response = await registerStudent(registrationData)

      if (response.success) {
        setSuccessMessage("Registration completed successfully!")
        // Reset form
        ;(e.target as HTMLFormElement).reset()
        setFaceImage(null)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Student Registration</CardTitle>
          <CardDescription>
            Please fill in your details and capture your face photo to create a new student account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input id="firstname" name="firstname" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middlename">Middle Name</Label>
                  <Input id="middlename" name="middlename" placeholder="David" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input id="lastname" name="lastname" placeholder="Smith" required />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select name="class" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BIM">BIM</SelectItem>
                      <SelectItem value="BHM">BHM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Select name="section" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select name="semester" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="First">First</SelectItem>
                      <SelectItem value="Second">Second</SelectItem>
                      <SelectItem value="Third">Third</SelectItem>
                      <SelectItem value="Fourth">Fourth</SelectItem>
                      <SelectItem value="Fifth">Fifth</SelectItem>
                      <SelectItem value="Sixth">Sixth</SelectItem>
                      <SelectItem value="Seventh">Seventh</SelectItem>
                      <SelectItem value="Eighth">Eighth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select name="year" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" placeholder="johnsmith123" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required minLength={8} />
                  <p className="text-sm text-muted-foreground">Password must be at least 8 characters long</p>
                </div>
              </div>
            </div>

            {/* Face Enrollment Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Face Enrollment</h3>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {showCamera ? (
                <div className="space-y-4">
                  <div className="relative w-full max-w-sm mx-auto aspect-video rounded-lg overflow-hidden bg-muted">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        stopCamera()
                        setShowCamera(false)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="button" onClick={capturePhoto}>
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {faceImage ? (
                    <div className="space-y-4">
                      <div className="relative w-full max-w-sm mx-auto aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={faceImage || "/placeholder.svg"}
                          alt="Captured face"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setFaceImage(null)
                          setShowCamera(true)
                          startCamera()
                        }}
                      >
                        Retake Photo
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowCamera(true)
                        startCamera()
                      }}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Start Camera
                    </Button>
                  )}
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

