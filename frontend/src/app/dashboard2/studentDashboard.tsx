"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStudentDashboard } from '@/services/ApiServices';

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Camera, Check, Loader2, RefreshCw, LogOut, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"


const studentData = await getStudentDashboard(34);

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

export default function StudentDashboard() {
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
    stream?.getTracks().forEach((track) => track.stop())
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

  const handleLogout = useCallback(() => {
    // Implement logout logic here
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }, [toast])

  const handleDownloadReport = useCallback(() => {
    // Implement report download logic here
    toast({
      title: "Report Downloaded",
      description: "Your attendance report has been downloaded.",
    })
  }, [toast])

  return (
    <div className="container mx-auto p-4">
      {/* 1. Student Profile Summary */}
      <Card className="mb-8">
        <CardContent className="flex items-center justify-between pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={studentData.student_img} alt={`${studentData.first_name} ${studentData.last_name}`} />
              <AvatarFallback>
                {studentData.first_name[0]}
                {studentData.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{`${studentData.first_name} ${studentData.middle_name} ${studentData.last_name}`}</h2>
              <p className="text-muted-foreground">{`${studentData.student_class.name} - Section ${studentData.student_class.section}`}</p>
              <p className="text-muted-foreground">{`${studentData.student_class.semester} ${studentData.student_class.year}`}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Check-In Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isVerified ? `Last check-in: ${studentData.last_check_in}` : "Please verify your attendance for today."}
          </p>
          <Button onClick={openCamera} disabled={isChecking || isVerified}>
            {isVerified ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Verified
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 2. Attendance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{studentData.attendance.overall_percentage}%</div>
            <p className="text-muted-foreground">
              Total Classes:{" "}
              {studentData.attendance.total_present +
                studentData.attendance.total_absent +
                studentData.attendance.total_late}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={studentData.attendance.breakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {studentData.attendance.breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Class Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{studentData.class_ranking.rank}</div>
            <p className="text-muted-foreground">Top {studentData.class_ranking.percentile}th percentile</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Recent Attendance Records */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentData.recent_attendance.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 4. Attendance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={studentData.attendance_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="attendance" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Camera Dialog */}
      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Attendance Check-In</DialogTitle>
            <DialogDescription>Please ensure your face is clearly visible in the camera.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {!capturedImage ? (
              <div className="relative aspect-video">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-md" />
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
    </div>
  )
}

