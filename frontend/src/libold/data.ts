const classes = [
  { id: 1, name: "Mathematics", section: "A", semester: "Fall", year: 2023, admin: "John Doe" },
  { id: 2, name: "Physics", section: "B", semester: "Fall", year: 2023, admin: "Jane Smith" },
  { id: 3, name: "Chemistry", section: "C", semester: "Fall", year: 2023, admin: "Bob Johnson" },
]

const students = [
  { id: 1, name: "Alice Brown", email: "alice@example.com", class: "Mathematics" },
  { id: 2, name: "Charlie Davis", email: "charlie@example.com", class: "Physics" },
  { id: 3, name: "Eva Fisher", email: "eva@example.com", class: "Chemistry" },
  { id: 4, name: "George Harris", email: "george@example.com", class: "Mathematics" },
  { id: 5, name: "Ivy Johnson", email: "ivy@example.com", class: "Physics" },
]

const attendance = [
  { id: 1, studentId: 1, status: "present", date: "2023-05-01" },
  { id: 2, studentId: 2, status: "absent", date: "2023-05-01" },
  { id: 3, studentId: 3, status: "present", date: "2023-05-01" },
  { id: 4, studentId: 4, status: "late", date: "2023-05-01" },
  { id: 5, studentId: 5, status: "present", date: "2023-05-01" },
]

export function getClassCount() {
  return classes.length
}

export function getStudentCount() {
  return students.length
}

export function getRecentAttendance() {
  return attendance.map((entry) => {
    const student = students.find((s) => s.id === entry.studentId)
    return {
      id: entry.id.toString(),
      name: student?.name || "",
      email: student?.email || "",
      status: entry.status,
      date: entry.date,
    }
  })
}

export function getAttendanceTrend() {
  return [
    { name: "Mon", total: 95 },
    { name: "Tue", total: 90 },
    { name: "Wed", total: 92 },
    { name: "Thu", total: 88 },
    { name: "Fri", total: 85 },
  ]
}

