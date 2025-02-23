import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold text-xl">AMS</span>
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Student Login
            </Button>
          </Link>
          <Link to="/login/admin">
            <Button variant="default" size="sm">
              Admin Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

