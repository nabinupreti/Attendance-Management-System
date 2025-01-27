import axios from "axios"

// Types for the registration data
export interface RegistrationData {
  firstname: string
  middlename?: string
  lastname: string
  class: string
  section: string
  semester: string
  year: number
  username: string
  password: string
  faceImage: string
}

// Types for the API response
export interface ApiResponse {
  success: boolean
  message: string
  data?: any
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Registration service
export const registerStudent = async (data: RegistrationData): Promise<ApiResponse> => {
  try {
    const response = await api.post("/register", data)
    return {
      success: true,
      message: "Registration successful",
      data: response.data,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed. Please try again.",
      }
    }
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

