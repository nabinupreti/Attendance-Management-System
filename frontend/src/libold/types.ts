export interface User {
    id: number
    username: string
    name: string
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
  
  