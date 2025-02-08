"use client"

import { useState, useRef, useCallback } from "react"
import { Camera, Check, Loader2, RefreshCw } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export function AttendanceCheckIn() {
  const [isChecking, setIsChecking] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  const openCamera = useCallback(async () => {
    setIsCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing the camera", err)
      toast({
        title: "Camera Error",
        description: "Unable to access the camera. Please check your permissions.",
        variant: "destructive",
      })
    }
  }, [toast])

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0)
      const imageDataUrl = canvas.toDataURL("image/jpeg")
      setCapturedImage(imageDataUrl)
    }
  }, [])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
  }, [])

  const closeCamera = useCallback(() => {
    setIsCameraOpen(false)
    setCapturedImage(null)
    const stream = videoRef.current?.srcObject as MediaStream
    stream?.getTracks().forEach(track => track.stop())
  }, [])

  const handleAttendance = useCallback(async () => {
    setIsChecking(true)
    // Simulating sending the photo to the backend and waiting for verification
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsChecking(false)
    setIsVerified(true)
    closeCamera()
    toast({
      title: "Attendance Verified",
      description: "Your attendance has been recorded for today.",
    })
  }, [closeCamera, toast])

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Today's Attendance</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isVerified
            ? "Your attendance has been recorded for today."
            : "Please verify your attendance for today."}
        </p>
        <Button
          onClick={openCamera}
          disabled={isChecking || isVerified}
        >
          {isVerified ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Verified
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Take Attendance
            </>
          )}
        </Button>
      </CardContent>

      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Attendance Check-In</DialogTitle>
            <DialogDescription>
              Please ensure your face is clearly visible in the camera.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {!capturedImage ? (
              <div className="relative aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="relative aspect-video">
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-start">
            {!capturedImage ? (
              <Button onClick={capturePhoto}>
                <Camera className="mr-2 h-4 w-4" />
                Capture
              </Button>
            ) : (
              <>
                <Button onClick={retakePhoto} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retake
                </Button>
                <Button onClick={handleAttendance} disabled={isChecking}>
                  {isChecking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Submit for Verification
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

