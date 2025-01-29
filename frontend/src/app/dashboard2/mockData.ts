export const studentData = {
    id: "1234",
    first_name: "John",
    middle_name: "Michael",
    last_name: "Doe",
    student_img: "/placeholder.svg",
    student_class: {
      name: "Computer Science",
      section: "A",
      semester: "Fall",
      year: 2025,
    },
    attendance: {
      overall_percentage: 85,
      total_present: 42,
      total_absent: 5,
      total_late: 3,
      breakdown: [
        { name: "Present", value: 42 },
        { name: "Absent", value: 5 },
        { name: "Late", value: 3 },
      ],
    },
    recent_attendance: [
      { date: "2025-01-25", status: "Present" },
      { date: "2025-01-24", status: "Absent" },
      { date: "2025-01-23", status: "Present" },
      { date: "2025-01-22", status: "Late" },
      { date: "2025-01-21", status: "Present" },
    ],
    attendance_trend: [
      { date: "2025-01-19", attendance: 1 },
      { date: "2025-01-20", attendance: 1 },
      { date: "2025-01-21", attendance: 1 },
      { date: "2025-01-22", attendance: 0.5 },
      { date: "2025-01-23", attendance: 1 },
      { date: "2025-01-24", attendance: 0 },
      { date: "2025-01-25", attendance: 1 },
    ],
    class_ranking: {
      rank: "Top 15%",
      percentile: 85,
    },
    last_check_in: "2025-01-25 08:45 AM",
  }
  
  