import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import Header from "../header";
import Footer from "../footer";
const URL = "http://127.0.0.1:8000/adminuser/login";

export default function AdminLoginForm({ className, ...props }: { className?: string; [key: string]: any }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  
  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(URL, { username, password }, { withCredentials: true });
      if (response.status === 200) {
        toast.success("Login successful!");
        props.setIsLoggedInAdmin(true);
        navigate("/admin-dashboard");
      } else {
        toast.error("Login failed! Please check your credentials.");
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      toast.error(error.response?.data?.detail || "An error occurred during login.");
    }
  };

  return (
    <>
    <div className="w-screen">
      <Header />
    </div>
    <div className={cn("flex justify-center items-center gap-6 min-h-screen", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center" >Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="ForgotPassword"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
      <Footer /> 
    </>
  );
}
