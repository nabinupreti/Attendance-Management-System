
import type { Student, Class, User, Attendance} from "./types"

let classes: Class[] = [
  { class_id: 1, name: "Mathematics", section: "A", semester: "Fall", year: 2023, admin: "John Doe" },
  { class_id: 2, name: "Physics", section: "B", semester: "Fall", year: 2023, admin: "Jane Smith" },
  { class_id: 3, name: "Chemistry", section: "C", semester: "Fall", year: 2023, admin: "Bob Johnson" },
]


let students: Student[] = [
  {
    user: { id: 1, username: "alice_brown", name: "Alice Brown" },
    first_name: "Alice",
    middle_name: "",
    last_name: "Brown",
    student_class: classes[0],
    student_img: "/placeholder.svg?height=100&width=100",
  },
  {
    user: { id: 2, username: "bob_smith", name: "Bob Smith" },
    first_name: "Bob",
    middle_name: "",
    last_name: "Smith",
    student_class: classes[1],
    student_img: "/placeholder.svg?height=100&width=100",
  },
  {
    user: { id: 3, username: "charlie_davis", name: "Charlie Davis" },
    first_name: "Charlie",
    middle_name: "",
    last_name: "Davis",
    student_class: classes[2],
    student_img: "/placeholder.svg?height=100&width=100",
  },
  {
    user: { id: 4, username: "diana_evans", name: "Diana Evans" },
    first_name: "Diana",
    middle_name: "",
    last_name: "Evans",
    student_class: classes[0],
    student_img: "/placeholder.svg?height=100&width=100",
  },
  {
    user: { id: 5, username: "ethan_foster", name: "Ethan Foster" },
    first_name: "Ethan",
    middle_name: "",
    last_name: "Foster",
    student_class: classes[1],
    student_img: "/placeholder.svg?height=100&width=100",
  },
]

let nextClassId = 4
let nextUserId = 6

function generateAttendanceRecords(days: number): Attendance[] {
  const records: Attendance[] = []
  let id = 1

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    for (const student of students) {
      records.push({
        id: id++,
        student: student,
        status: Math.random() < 0.1 ? "Absent" : Math.random() < 0.2 ? "Late" : "Present",
        date: date.toISOString(),
      })
    }
  }

  return records
}

const attendanceRecords: Attendance[] = generateAttendanceRecords(30) // Generate 30 days of attendance records

const nextAttendanceId = attendanceRecords.length + 1

export function getClasses(): Class[] {
  return classes
}

export function addClass(newClass: Omit<Class, "class_id">): Class {
  const classWithId = { ...newClass, class_id: nextClassId++ }
  classes.push(classWithId)
  return classWithId
}

export function updateClass(updatedClass: Class): Class {
  classes = classes.map((c) => (c.class_id === updatedClass.class_id ? updatedClass : c))
  return updatedClass
}

export function deleteClass(classId: number): void {
  classes = classes.filter((c) => c.class_id !== classId)
}

export function getStudents(): Student[] {
  return students
}

export function addStudent(newStudent: Omit<Student, "user">): Student {
  const user: User = {
    id: nextUserId++,
    username: `${newStudent.first_name.toLowerCase()}_${newStudent.last_name.toLowerCase()}`,
    name: `${newStudent.first_name} ${newStudent.last_name}`,
  }
  const studentWithUser = { ...newStudent, user }
  students.push(studentWithUser)
  return studentWithUser
}

export function updateStudent(updatedStudent: Student): Student {
  students = students.map((s) => (s.user.id === updatedStudent.user.id ? updatedStudent : s))
  return updatedStudent
}

export function deleteStudent(userId: number): void {
  students = students.filter((s) => s.user.id !== userId)
}

export function getClassCount(): number {
  return classes.length
}

export function getStudentCount(): number {
  return students.length
}

export function getRecentAttendance(): Attendance[] {
  return attendanceRecords.slice(0, 5)
}

export function getAttendanceTrend() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]
  return days.map((day) => {
    const total = Math.floor(Math.random() * 15) + 85 // Random number between 85 and 100
    return { name: day, total }
  })
}

export function getAttendance(): Attendance[] {
  return attendanceRecords
}

export function updateAttendanceStatus(attendanceId: number, newStatus: "Present" | "Absent" | "Late"): Attendance {
  const updatedAttendance = attendanceRecords.find((record) => record.id === attendanceId)
  if (updatedAttendance) {
    updatedAttendance.status = newStatus
  }
  return updatedAttendance!
}

export function bulkUpdateAttendance(ids: number[], status: "Present" | "Absent" | "Late"): Attendance[] {
  const updatedRecords = attendanceRecords.filter((record) => ids.includes(record.id))
  updatedRecords.forEach((record) => (record.status = status))
  return updatedRecords
}

export async function logout(): Promise<void> {
  // In a real application, this would make a request to the backend to invalidate the session
  console.log("User logged out")
  // Clear any client-side storage (e.g., localStorage) here
  localStorage.removeItem("token")
}

export async function getAttendanceReport(
  classId: string,
  startDate: Date,
  endDate: Date,
): Promise<AttendanceReport[]> {
  // This is a mock implementation. In a real application, this would make an API call to the backend.
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

  const mockReport: AttendanceReport[] = [
    {
      class: "Mathematics - A",
      totalStudents: 30,
      present: 25,
      absent: 3,
      late: 2,
      attendanceRate: 90,
    },
    {
      class: "Physics - B",
      totalStudents: 25,
      present: 22,
      absent: 2,
      late: 1,
      attendanceRate: 92,
    },
    {
      class: "Chemistry - C",
      totalStudents: 28,
      present: 24,
      absent: 3,
      late: 1,
      attendanceRate: 89.29,
    },
  ]

  if (classId !== "all") {
    return mockReport.filter((report) =>
      report.class.startsWith(classId === "1" ? "Mathematics" : classId === "2" ? "Physics" : "Chemistry"),
    )
  }

  return mockReport
}

export async function exportAttendanceReport(classId: string, startDate: Date, endDate: Date): Promise<void> {
  // This is a mock implementation. In a real application, this would generate and download a report file.
  console.log(`Exporting report for class ${classId} from ${startDate.toISOString()} to ${endDate.toISOString()}`)
  alert("Report exported successfully!")
}





// import type { Student, Class, Attendance,  User } from "./types"

// // Define the backend base URL
// const BASE_URL = "http://localhost:8000/adminuser"

// // Function to fetch classes from the backend
// export async function getClasses(): Promise<Class[]> {
//   try {
//     const response = await fetch(`${BASE_URL}/classes`)
//     if (!response.ok) throw new Error("Failed to fetch classes")
//     return await response.json()
//   } catch (error) {
//     console.error("Error fetching classes:", error)
//     return [] // Return an empty array in case of error
//   }
// }

// // Function to add a class
// export async function addClass(newClass: Omit<Class, "class_id">): Promise<Class> {
//   try {
//     const response = await fetch(`${BASE_URL}/classes`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newClass),
//     })
//     if (!response.ok) throw new Error("Failed to add class")
//     return await response.json()
//   } catch (error) {
//     console.error("Error adding class:", error)
//     throw error
//   }
// }

// // Function to fetch students from the backend
// export async function getStudents(): Promise<Student[]> {
//   try {
//     const response = await fetch(`${BASE_URL}/students`)
//     if (!response.ok) throw new Error("Failed to fetch students")
//     return await response.json()
//   } catch (error) {
//     console.error("Error fetching students:", error)
//     return [] // Return an empty array in case of error
//   }
// }

// // Function to add a student
// export async function addStudent(newStudent: Omit<Student, "user">): Promise<Student> {
//   try {
//     const user: User = {
//       id: new Date().getTime(), // Or generate an ID based on your logic
//       username: `${newStudent.first_name.toLowerCase()}_${newStudent.last_name.toLowerCase()}`,
//       name: `${newStudent.first_name} ${newStudent.last_name}`,
//     }
//     const studentWithUser = { ...newStudent, user }

//     const response = await fetch(`${BASE_URL}/students`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(studentWithUser),
//     })
//     if (!response.ok) throw new Error("Failed to add student")
//     return await response.json()
//   } catch (error) {
//     console.error("Error adding student:", error)
//     throw error
//   }
// }

// // Function to fetch attendance records from the backend
// export async function getAttendance(): Promise<Attendance[]> {
//   try {
//     const response = await fetch(`${BASE_URL}/attendance`)
//     if (!response.ok) throw new Error("Failed to fetch attendance records")
//     return await response.json()
//   } catch (error) {
//     console.error("Error fetching attendance records:", error)
//     return [] // Return an empty array in case of error
//   }
// }

// // Function to update attendance status
// export async function updateAttendanceStatus(attendanceId: number, newStatus: "Present" | "Absent" | "Late"): Promise<Attendance> {
//   try {
//     const response = await fetch(`${BASE_URL}/attendance/${attendanceId}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status: newStatus }),
//     })
//     if (!response.ok) throw new Error("Failed to update attendance status")
//     return await response.json()
//   } catch (error) {
//     console.error("Error updating attendance status:", error)
//     throw error
//   }
// }

// // Function to get attendance report for a specific class
// export async function getAttendanceReport(classId: string, startDate: Date, endDate: Date): Promise<AttendanceReport[]> {
//   try {
//     const response = await fetch(`${BASE_URL}/attendance/report?classId=${classId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
//     if (!response.ok) throw new Error("Failed to fetch attendance report")
//     return await response.json()
//   } catch (error) {
//     console.error("Error fetching attendance report:", error)
//     return [] // Return an empty array in case of error
//   }
// }

// // Function to export the attendance report (just logs in this example)
// export async function exportAttendanceReport(classId: string, startDate: Date, endDate: Date): Promise<void> {
//   console.log(`Exporting report for class ${classId} from ${startDate.toISOString()} to ${endDate.toISOString()}`)
//   alert("Report exported successfully!")
// }
