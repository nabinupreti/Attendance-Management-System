export interface User {
    id: number
    username: string
    name: string
    role?: string // Add this line to include the role
  }
  
  export interface Class {
    class_id: number
    name: string
    section: string
    semester: string
    year: number
    admin: string
  }
  
  export interface Student {
    user: User
    first_name: string
    middle_name: string
    last_name: string
    student_class: Class
    student_img: string
  }
  
  export interface Attendance {
    id: number
    student: Student
    status: "Present" | "Absent" | "Late"
    date: string
  }
  
  export interface AttendanceReport {
    class: string
    totalStudents: number
    present: number
    absent: number
    late: number
    attendanceRate: number
  }
  
  export interface Admin {
    user: User
    role: string
    first_name: string
    last_name: string
  }