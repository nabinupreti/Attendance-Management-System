import { Link } from "react-router-dom";

import { BookOpen } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col gap-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold text-xl">AMS</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xl">
              Smart attendance management system powered by facial recognition technology.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h4 className="font-semibold">Navigation</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                  Home
                </Link>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About
                </Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </nav>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Access</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
                  Student Login
                </Link>
                <Link to="/login/admin" className="text-sm text-muted-foreground hover:text-primary">
                  Admin Login
                </Link>
                <Link to="/register" className="text-sm text-muted-foreground hover:text-primary">
                  Register
                </Link>
              </nav>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Legal</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </nav>
            </div>
          </div>
        </div>
        {/* <div className="border-t pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Attendance Management System. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  )
}

