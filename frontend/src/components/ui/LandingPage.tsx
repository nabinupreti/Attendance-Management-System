import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserCircle, Users, ClipboardCheck, Bell, PieChart, Shield, ArrowRight, UserPlus, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold">AMS</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login/student" className="text-sm font-medium hover:underline underline-offset-4">
            Student Login
          </Link>
          <Link href="/login/admin" className="text-sm font-medium hover:underline underline-offset-4">
            Admin Login
          </Link>
          <Link href="/register" className="text-sm font-medium hover:underline underline-offset-4">
            Register
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-12 md:pt-24 lg:pt-32 border-b bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div>
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Smart Attendance Management System
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
                  Transform your attendance tracking with our advanced facial recognition system. Secure, efficient, and
                  reliable.
                </p>
                <div className="space-x-4 mt-8">
                  <Link href="/register">
                    <Button size="lg" className="px-8">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login/admin">
                    <Button variant="outline" size="lg" className="px-8">
                      Admin Portal
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg"
                  alt="Hero Image"
                  width={500}
                  height={400}
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-[700px]">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features & Benefits</h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our comprehensive attendance management solution provides everything you need
                </p>
              </div>
            </div>
            <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8 mt-12">
              <FeatureCard
                icon={<UserCircle />}
                title="Face Recognition"
                description="Advanced facial recognition for secure and accurate attendance tracking"
              />
              <FeatureCard
                icon={<ClipboardCheck />}
                title="Automated Tracking"
                description="Automatic attendance marking and record keeping"
              />
              <FeatureCard
                icon={<Bell />}
                title="Real-time Notifications"
                description="Instant alerts for attendance updates and reports"
              />
              <FeatureCard
                icon={<PieChart />}
                title="Analytics Dashboard"
                description="Comprehensive attendance analytics and reporting"
              />
              <FeatureCard
                icon={<Shield />}
                title="Secure System"
                description="Enhanced security measures to protect student data"
              />
              <FeatureCard
                icon={<Users />}
                title="Multi-user Access"
                description="Different access levels for administrators and students"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of students using our modern attendance system
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <Button size="lg" className="px-8">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register Now
                  </Button>
                </Link>
                <Link href="/login/student">
                  <Button variant="outline" size="lg" className="px-8">
                    Student Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 Attendance Management System. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:gap-6">
              <Link href="/terms" className="text-sm hover:underline underline-offset-4">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm hover:underline underline-offset-4">
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-full p-3 bg-primary/10">
            <div className="h-6 w-6 text-primary">{icon}</div>
          </div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

