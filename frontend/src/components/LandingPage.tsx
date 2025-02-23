import { Link } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
import { UserCircle, Users, ClipboardCheck, Bell, PieChart, Shield, ArrowRight, UserPlus } from 'lucide-react'
import FeatureCard from "./ui/feature-card"

export default function LandingPage() {
  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Smart Attendance Management System
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Streamline attendance tracking with facial recognition technology. Secure, efficient, and easy to use.
              </p>
            </div>
            <div className="space-x-4">
              <Link to="/login/admin">
                <Button className="px-8">
                  Admin Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="px-8">
                  Student Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Features & Benefits
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                Our system provides comprehensive attendance management solutions for educational institutions
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <FeatureCard 
                icon={<UserCircle className="h-10 w-10" />}
                title="Facial Recognition"
                description="Secure and accurate attendance marking using advanced facial recognition technology"
              />
              <FeatureCard 
                icon={<ClipboardCheck className="h-10 w-10" />}
                title="Automated Tracking"
                description="Automatically track and record attendance for all registered students"
              />
              <FeatureCard 
                icon={<Bell className="h-10 w-10" />}
                title="Instant Notifications"
                description="Real-time notifications for attendance updates and reports"
              />
              <FeatureCard 
                icon={<PieChart className="h-10 w-10" />}
                title="Detailed Analytics"
                description="Comprehensive reports and analytics for attendance patterns"
              />
              <FeatureCard 
                icon={<Shield className="h-10 w-10" />}
                title="Secure System"
                description="Enhanced security measures to protect student data and privacy"
              />
              <FeatureCard 
                icon={<Users className="h-10 w-10" />}
                title="Multi-user Support"
                description="Different access levels for administrators, teachers, and students"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                New Student?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                Register now to get started with our advanced attendance management system
              </p>
            </div>
            <Link to="/register">
              <Button size="lg" className="mt-4">
                <UserPlus className="mr-2 h-4 w-4" />
                Register New Student
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
    </>
  )
}



