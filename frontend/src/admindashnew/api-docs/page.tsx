export default function ApiDocsPage() {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">API Documentation</h1>
        <p className="mb-4">
          All endpoints are prefixed with <code className="bg-gray-200 p-1 rounded">http://localhost:8000/adminuser</code>
        </p>
  
        <h2 className="text-2xl font-semibold mt-6 mb-2">Classes</h2>
        <ApiEndpoint
          method="GET"
          endpoint="/classes/"
          description="Get all classes"
          response={`[
    {
      "class_id": 1,
      "name": "Mathematics",
      "section": "A",
      "semester": "Fall",
      "year": 2023,
      "admin": "John Doe"
    },
    ...
  ]`}
        />
        <ApiEndpoint
          method="POST"
          endpoint="/classes/"
          description="Add a new class"
          request={`{
    "name": "Physics",
    "section": "B",
    "semester": "Spring",
    "year": 2023,
    "admin": "Jane Smith"
  }`}
          response={`{
    "class_id": 2,
    "name": "Physics",
    "section": "B",
    "semester": "Spring",
    "year": 2023,
    "admin": "Jane Smith"
  }`}
        />
        <ApiEndpoint
          method="PUT"
          endpoint="/classes/{class_id}/"
          description="Update a class"
          request={`{
    "name": "Advanced Physics",
    "section": "B",
    "semester": "Spring",
    "year": 2023,
    "admin": "Jane Smith"
  }`}
          response={`{
    "class_id": 2,
    "name": "Advanced Physics",
    "section": "B",
    "semester": "Spring",
    "year": 2023,
    "admin": "Jane Smith"
  }`}
        />
        <ApiEndpoint
          method="DELETE"
          endpoint="/classes/{class_id}/"
          description="Delete a class"
          response="204 No Content"
        />
  
        <h2 className="text-2xl font-semibold mt-6 mb-2">Students</h2>
        <ApiEndpoint
          method="GET"
          endpoint="/students/"
          description="Get all students"
          response={`[
    {
      "user": {
        "id": 1,
        "username": "alice_brown",
        "name": "Alice Brown"
      },
      "first_name": "Alice",
      "middle_name": "",
      "last_name": "Brown",
      "student_class": {
        "class_id": 1,
        "name": "Mathematics",
        "section": "A",
        "semester": "Fall",
        "year": 2023,
        "admin": "John Doe"
      },
      "student_img": "/path/to/image.jpg"
    },
    ...
  ]`}
        />
        <ApiEndpoint
          method="POST"
          endpoint="/students/"
          description="Add a new student"
          request={`{
    "first_name": "Bob",
    "middle_name": "",
    "last_name": "Smith",
    "student_class": 1,
    "student_img": "/path/to/image.jpg"
  }`}
          response={`{
    "user": {
      "id": 2,
      "username": "bob_smith",
      "name": "Bob Smith"
    },
    "first_name": "Bob",
    "middle_name": "",
    "last_name": "Smith",
    "student_class": {
      "class_id": 1,
      "name": "Mathematics",
      "section": "A",
      "semester": "Fall",
      "year": 2023,
      "admin": "John Doe"
    },
    "student_img": "/path/to/image.jpg"
  }`}
        />
  
        <h2 className="text-2xl font-semibold mt-6 mb-2">Attendance</h2>
        <ApiEndpoint
          method="GET"
          endpoint="/attendance/"
          description="Get all attendance records"
          response={`[
    {
      "id": 1,
      "student": {
        "user": {
          "id": 1,
          "username": "alice_brown",
          "name": "Alice Brown"
        },
        "first_name": "Alice",
        "last_name": "Brown",
        "student_class": {
          "class_id": 1,
          "name": "Mathematics",
          "section": "A"
        }
      },
      "status": "Present",
      "date": "2023-05-01T09:00:00Z"
    },
    ...
  ]`}
        />
        <ApiEndpoint
          method="PUT"
          endpoint="/attendance/{attendance_id}/"
          description="Update attendance status"
          request={`{
    "status": "Late"
  }`}
          response={`{
    "id": 1,
    "student": {
      "user": {
        "id": 1,
        "username": "alice_brown",
        "name": "Alice Brown"
      },
      "first_name": "Alice",
      "last_name": "Brown",
      "student_class": {
        "class_id": 1,
        "name": "Mathematics",
        "section": "A"
      }
    },
    "status": "Late",
    "date": "2023-05-01T09:00:00Z"
  }`}
        />
  
        <h2 className="text-2xl font-semibold mt-6 mb-2">Reports</h2>
        <ApiEndpoint
          method="POST"
          endpoint="/reports/attendance/"
          description="Generate attendance report"
          request={`{
    "classId": "1",
    "startDate": "2023-05-01",
    "endDate": "2023-05-31"
  }`}
          response={`[
    {
      "class": "Mathematics - A",
      "totalStudents": 30,
      "present": 25,
      "absent": 3,
      "late": 2,
      "attendanceRate": 90
    },
    ...
  ]`}
        />
        <ApiEndpoint
          method="POST"
          endpoint="/reports/export/"
          description="Export attendance report"
          request={`{
    "classId": "1",
    "startDate": "2023-05-01",
    "endDate": "2023-05-31"
  }`}
          response="CSV file download"
        />
      </div>
    )
  }
  
  function ApiEndpoint({
    method,
    endpoint,
    description,
    request,
    response,
  }: {
    method: string
    endpoint: string
    description: string
    request?: string
    response: string
  }) {
    return (
      <div className="mb-6 border p-4 rounded">
        <h3 className="text-xl font-semibold mb-2">
          <span
            className={`inline-block px-2 py-1 rounded text-white ${method === "GET" ? "bg-blue-500" : method === "POST" ? "bg-green-500" : method === "PUT" ? "bg-yellow-500" : "bg-red-500"}`}
          >
            {method}
          </span>
          <span className="ml-2">{endpoint}</span>
        </h3>
        <p className="mb-2">{description}</p>
        {request && (
          <>
            <h4 className="font-semibold mt-2">Request:</h4>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
              <code>{request}</code>
            </pre>
          </>
        )}
        <h4 className="font-semibold mt-2">Response:</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
          <code>{response}</code>
        </pre>
      </div>
    )
  }