import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./components/LandingPage";
import RegistrationForm from "@/components/registration-form"
import LoginForm from "./components/login-form";
import NoPage from "./components/nopage";
import DashboardPage from "./app/dashboard2/studentDashboard";
import ForgotPassword from "./components/forgotPassword";
import ResetPassword from "./components/resetPassword";
import AdminLoginForm from "./components/admin/admin-login";
import AdminDashboardPage from "./app/dashboard2/studentDashboard";

import "./App.css";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedInAdmin, setIsLoggedInAdmin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(0);

  // Sync authentication state with localStorage
  useEffect(() => {
    const storedIsLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn") || "false");
    const storedName = localStorage.getItem("name") || "";
    const storedEmail = localStorage.getItem("email") || "";
    const storedId = localStorage.getItem("id") || 0;

    setIsLoggedIn(storedIsLoggedIn);
    setName(storedName);
    setEmail(storedEmail);
    setId(storedId);
  }, []);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
  }, [isLoggedIn, name, email]);

  // Wrapper for protecting routes
  const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    return isLoggedIn ? children : <Navigate to="/" replace />;
  };

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage/>} />
          <Route
            path="/login"
            element={
              <LoginForm
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                setName={setName}
                setEmail={setEmail}
                setId={setId}
              />             
            }
          />
          <Route
            path="/login/admin"
            element={
              <AdminLoginForm
                isLoggedInAdmin={isLoggedInAdmin}
                setIsLoggedInAdmin={setIsLoggedInAdmin}
                setName={setName}
                setEmail={setEmail}
              />             
            }
          />
          <Route
            path="/register"
            element={
              <RegistrationForm
                setIsLoggedIn={setIsLoggedIn}
                setName={setName}
                setEmail={setEmail}
              />
            }
          />
          <Route
            path="/forgotPassword"
            element={<ForgotPassword />}
          />
          <Route
            path="/resetPassword"
            element={<ResetPassword />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage isLoggedIn={isLoggedIn} id={id}/>
              </PrivateRoute>
            }
          />
        {/* Admin Protected Route */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute >
              <AdminDashboardPage isLoggedInAdmin={isLoggedInAdmin}/>
            </PrivateRoute>
            }
          />
          {/* Fallback Route */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}