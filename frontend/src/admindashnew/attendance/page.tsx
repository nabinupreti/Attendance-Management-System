"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAttendance, updateAttendanceStatus, getClasses, bulkUpdateAttendance } from "@/lib/api"
import type { Attendance, Class } from "@/lib/types"
import { BarChart, Calendar, Users } from "lucide-react"

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const attendance = await getAttendance()
        const classList = await getClasses()
        setAttendanceData(attendance)
        setClasses(classList)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const filteredAttendance = attendanceData.filter((record) => {
    const isClassMatch = selectedClass === "all" || record.student.student_class.class_id.toString() === selectedClass
    const isDateMatch = record.date.startsWith(selectedDate.toISOString().split("T")[0])
    const isSearchMatch =
      record.student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.student.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    return isClassMatch && isDateMatch && isSearchMatch
  })

  const handleStatusChange = async (attendanceId: number, newStatus: string) => {
    try {
      const updatedAttendance = await updateAttendanceStatus(attendanceId, newStatus as "Present" | "Absent" | "Late")
      setAttendanceData((prevData) =>
        prevData.map((record) => (record.id === updatedAttendance.id ? updatedAttendance : record))
      )
    } catch (error) {
      console.error("Error updating attendance status:", error)
    }
  }

  const handleBulkUpdate = async (status: "Present" | "Absent" | "Late") => {
    try {
      const updatedRecords = await bulkUpdateAttendance(
        filteredAttendance.map((record) => record.id),
        status
      )
      setAttendanceData((prevData) =>
        prevData.map((record) => updatedRecords.find((r) => r.id === record.id) || record)
      )
    } catch (error) {
      console.error("Error updating attendance in bulk:", error)
    }
  }

  const attendanceStats = filteredAttendance.reduce(
    (acc, record) => {
      acc[record.status]++
      return acc
    },
    { Present: 0, Absent: 0, Late: 0 }
  )

  const attendanceRate =
    filteredAttendance.length > 0
      ? (((attendanceStats.Present + attendanceStats.Late) / filteredAttendance.length) * 100).toFixed(2)
      : "0.00"

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Attendance Management</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAttendance.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.Present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.Absent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate}%</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex space-x-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.class_id} value={cls.class_id.toString()}>
                {cls.name} - {cls.section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePicker selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />
        <Input placeholder="Search student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAttendance.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{`${record.student.first_name} ${record.student.last_name}`}</TableCell>
              <TableCell>{`${record.student.student_class.name} - ${record.student.student_class.section}`}</TableCell>
              <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
              <TableCell>{record.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
