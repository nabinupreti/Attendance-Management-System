"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStudentDashboard } from '@/services/ApiServices';
import { logout } from "@/services/ApiServices";
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
import axios from 'axios';

// const studentData = await getStudentDashboard(34);

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

interface StudentData {
  student_img: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  student_class: {
    name: string;
    section: string;
    semester: string;
    year: string;
  };
  last_check_in: string;
  attendance: {
    overall_percentage: number;
    total_present: number;
    total_absent: number;
    total_late: number;
    breakdown: { name: string; value: number }[];
  };
  class_ranking: {
    rank: number;
    percentile: number;
  };
  recent_attendance: { date: string; status: string }[];
  attendance_trend: { date: string; attendance: number }[];
}

export default function StudentDashboard(props: any) {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()


  const closeCamera = useCallback(() => {
    setIsCameraOpen(false);
    setCapturedImage(null);

    const videoElement = videoRef.current;
    if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
            track.stop();
            console.log(`Stopped track: ${track.kind}`);
        });
        videoElement.srcObject = null;
        console.log("Video source object set to null");
    }
    console.log("Camera closed");
}, [videoRef, setIsCameraOpen, setCapturedImage]);

const openCamera = useCallback(async () => {
  setIsCameraOpen(true);
  try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
          // Close any previous stream
          closeCamera();
          videoRef.current.srcObject = stream;
      }
  } catch (err) {
      console.error("Error accessing the camera", err);
      toast({
          title: "Camera Error",
          description: "Unable to access the camera. Please check your permissions.",
          variant: "destructive",
      });
      closeCamera();
  }
}, [toast, closeCamera]);


const capturePhoto = useCallback(() => {
    if (videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageDataUrl);
    }
}, []);

const retakePhoto = useCallback(() => {
    setCapturedImage(null);
}, []);

const handleAttendance = useCallback(async () => {
  setIsChecking(true);
  try {
      const imageData = capturedImage.split(',')[1];
      const response = await axios.post('http://localhost:8000/api/face-verification', {
          student_id: props.id,
          image_data: imageData,
      });
      
      setIsVerified(response.data.verified);
      toast({
          title: response.data.verified ? "Attendance Verified" : "Attendance Not Verified",
          description: response.data.verified 
              ? "Your attendance has been recorded for today." 
              : "The verification process failed.",
      });
  } catch (error) {
      toast({
          title: "Attendance Error",
          description: "An error occurred while verifying attendance.",
      });
  } finally {
      closeCamera(); // Close camera no matter what
      setIsChecking(false);
  }
}, [capturedImage, closeCamera, toast, props.id]);


const handleLogout = useCallback(async () => {
    try {
        await logout();
        
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });

        // Redirect to login page
        window.location.href = "/login"; // OR use Next.js router
    } catch (error) {
        console.error("Logout failed", error);
        toast({
            title: "Logout Error",
            description: "An error occurred while logging out.",
            variant: "destructive",
        });
    }
}, [toast]);
  

  const handleDownloadReport = useCallback(() => {
    // Implement report download logic here
    toast({
      title: "Report Downloaded",
      description: "Your attendance report has been downloaded.",
    })
  }, [toast])

  const id = props.id;

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) return; // Conditional logic inside useEffect, not before Hooks

      setLoading(true);
      try {
        console.log("Fetching data for ID:", id);
        const data = await getStudentDashboard(id);
        setStudentData(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]); // Only re-run when `id` changes

  //Conditional UI rendering (outside of Hook logic)
  if (!id) return <p>No ID provided</p>;
  if (loading) return <p>Loading...</p>;
  if (!studentData) return <p>No student data available.</p>;

  console.log("studentData", studentData);

  


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
                Take Attendance
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

