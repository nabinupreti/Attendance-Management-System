"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAttendanceReport, exportAttendanceReport } from "@/lib/api"
import { FileDown } from "lucide-react"

export default function ReportsPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [reportData, setReportData] = useState<any>(null)

  const handleGenerateReport = async () => {
    const report = await getAttendanceReport(selectedClass, startDate, endDate)
    setReportData(report)
  }

  const handleExportReport = async () => {
    await exportAttendanceReport(selectedClass, startDate, endDate)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Attendance Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="1">Mathematics - A</SelectItem>
                <SelectItem value="2">Physics - B</SelectItem>
                <SelectItem value="3">Chemistry - C</SelectItem>
              </SelectContent>
            </Select>
            <DatePicker selected={startDate} onSelect={(date) => date && setStartDate(date)} placeholder="Start Date" />
            <DatePicker selected={endDate} onSelect={(date) => date && setEndDate(date)} placeholder="End Date" />
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleGenerateReport}>Generate Report</Button>
            <Button variant="outline" onClick={handleExportReport}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Total Students</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Attendance Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((row: any) => (
                  <TableRow key={row.class}>
                    <TableCell>{row.class}</TableCell>
                    <TableCell>{row.totalStudents}</TableCell>
                    <TableCell>{row.present}</TableCell>
                    <TableCell>{row.absent}</TableCell>
                    <TableCell>{row.late}</TableCell>
                    <TableCell>{row.attendanceRate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

