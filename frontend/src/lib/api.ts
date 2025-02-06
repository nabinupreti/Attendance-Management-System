import type { Student, Class, Attendance, AttendanceReport } from "./types"

const API_BASE_URL = "http://localhost:8000/adminuser"

async function apiCall(endpoint: string, method = "GET", body?: any) {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    console.log(`Making ${method} request to: ${url}`)

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        // Add authentication header here if required
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      console.error(`API call failed: ${response.status} ${response.statusText}`)
      console.error(`Endpoint: ${endpoint}`)
      const errorBody = await response.text()
      console.error(`Error body: ${errorBody}`)
      throw new Error(`API call failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("API call error:", error)
    throw error
  }
}

export async function getClasses(): Promise<Class[]> {
  return apiCall("/classes/")
}

export async function addClass(newClass: Omit<Class, "class_id">): Promise<Class> {
  return apiCall("/classes/", "POST", newClass)
}

export async function updateClass(updatedClass: Class): Promise<Class> {
  return apiCall(`/classes/${updatedClass.class_id}/`, "PUT", updatedClass)
}

export async function deleteClass(classId: number): Promise<void> {
  await apiCall(`/classes/${classId}/`, "DELETE")
}

export async function getStudents(): Promise<Student[]> {
  return apiCall("/students/")
}

export async function addStudent(newStudent: Omit<Student, "user">): Promise<Student> {
  return apiCall("/students/", "POST", newStudent)
}

export async function updateStudent(updatedStudent: Student): Promise<Student> {
  return apiCall(`/students/${updatedStudent.user.id}/`, "PUT", updatedStudent)
}

export async function deleteStudent(userId: number): Promise<void> {
  await apiCall(`/students/${userId}/`, "DELETE")
}

export async function getClassCount(): Promise<number> {
  const response = await apiCall("/classes/count/")
  return response.total_classes
}

export async function getStudentCount(): Promise<number> {
  const response = await apiCall("/students/count/")
  return response.total_students
}

export async function getRecentAttendance(): Promise<Attendance[]> {
  return apiCall("/attendance/recent/")
}

export async function getAttendanceTrend(): Promise<{ name: string; total: number }[]> {
  return apiCall("/attendance/trend/")
}

export async function getAttendance(): Promise<Attendance[]> {
  return apiCall("/attendance/")
}

export async function updateAttendanceStatus(
  attendanceId: number,
  newStatus: "Present" | "Absent" | "Late",
): Promise<Attendance> {
  return apiCall(`/attendance/${attendanceId}/`, "PUT", { status: newStatus })
}

export async function bulkUpdateAttendance(
  ids: number[],
  status: "Present" | "Absent" | "Late",
): Promise<Attendance[]> {
  return apiCall("/attendance/bulk-update/", "POST", { ids, status })
}

export async function logout(): Promise<void> {
  await apiCall("/logout/", "POST")
  localStorage.removeItem("token")
}

export async function getAttendanceReport(
  classId: string,
  startDate: Date,
  endDate: Date,
): Promise<AttendanceReport[]> {
  return apiCall("/reports/attendance/", "POST", { classId, startDate, endDate })
}

export async function exportAttendanceReport(classId: string, startDate: Date, endDate: Date): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/reports/export/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ classId, startDate, endDate }),
  })

  if (!response.ok) {
    throw new Error("Failed to export report")
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.style.display = "none"
  a.href = url
  a.download = "attendance_report.csv"
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
}

