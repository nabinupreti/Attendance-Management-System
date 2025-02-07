// import "./globals.css"
import type { Metadata } from "next"
// import { Inter } from "next/font/google"
import { Sidebar } from "@/components/sidebar"
import type React from "react" // Import React

// const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Attendance Management System",
  description: "Manage student attendance efficiently",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    <div className="flex h-screen w-screen">
        <div className="w-64 flex-shrink-0">
        <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-100">{children}</main>
    </div>
     
  )
}

