"use client"

import { useState } from "react"
import { Calendar, Clock, Award, AlertTriangle, FileText, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data
const studentData = {
  first_name: "John",
  middle_name: "Michael",
  last_name: "Doe",
  student_img: "/placeholder.svg",
  student_class: { name: "Computer Science", section: "A" },
  semester: "Fall",
  year: 2025,
  attendance_rate: 80,
  attendance_breakdown: [
    { name: "Present", value: 80, color: "#10B981" },
    { name: "Absent", value: 15, color: "#EF4444" },
    { name: "Late", value: 5, color: "#F59E0B" },
  ],
  monthly_attendance: [
    { day: "01", attendance: 100 },
    { day: "05", attendance: 80 },
    { day: "10", attendance: 90 },
    { day: "15", attendance: 85 },
    { day: "20", attendance: 95 },
    { day: "25", attendance: 75 },
    { day: "30", attendance: 88 },
  ],
  class_average_attendance: 85,
}

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={studentData.student_img} alt={`${studentData.first_name} ${studentData.last_name}`} />
              <AvatarFallback>
                {studentData.first_name[0]}
                {studentData.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{`${studentData.first_name} ${studentData.middle_name} ${studentData.last_name}`}</CardTitle>
              <CardDescription>{`${studentData.student_class.name} - Section ${studentData.student_class.section}`}</CardDescription>
              <CardDescription>{`${studentData.semester} ${studentData.year}`}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentData.attendance_rate}%</div>
                <Progress value={studentData.attendance_rate} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Class Average</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentData.class_average_attendance}%</div>
                <Progress value={studentData.class_average_attendance} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Badges</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">+2 from last semester</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Attendance below 75%</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Monthly Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    attendance: {
                      label: "Attendance",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={studentData.monthly_attendance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="attendance" stroke="var(--color-attendance)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Attendance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={studentData.attendance_breakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {studentData.attendance_breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Log</CardTitle>
              <CardDescription>Your daily attendance record</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add a table component here for attendance log */}
              <p>Attendance log table goes here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Calendar</CardTitle>
              <CardDescription>Monthly view of your attendance</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add a calendar heatmap component here */}
              <p>Attendance calendar heatmap goes here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>Manage your leave applications</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add leave request form and status here */}
              <p>Leave request form and status goes here</p>
            </CardContent>
            <CardFooter>
              <Button>New Leave Request</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Important dates and announcements</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add list of upcoming events here */}
            <p>List of upcoming events goes here</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance Leaderboard</CardTitle>
            <CardDescription>Top performers in attendance</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add leaderboard component here */}
            <p>Attendance leaderboard goes here</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between">
            <Button variant="outline" className="w-[calc(50%-0.5rem)]">
              <FileText className="mr-2 h-4 w-4" /> Export Report
            </Button>
            <Button variant="outline" className="w-[calc(50%-0.5rem)]">
              <Bell className="mr-2 h-4 w-4" /> Notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

