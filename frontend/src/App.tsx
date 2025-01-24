import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LoginForm } from "./components/ui/login-form";
import RegistrationForm from "./components/ui/registration";
import NoPage from "./components/ui/nopage";
import DashboardPage from "./app/dashboard/page";
import ForgotPassword from "./components/ui/forgotPassword";
import ResetPassword from "./components/ui/resetPassword";

import "./App.css";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Sync authentication state with localStorage
  useEffect(() => {
    const storedIsLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false;
    const storedName = localStorage.getItem("name") || "";
    const storedEmail = localStorage.getItem("email") || "";

    setIsLoggedIn(storedIsLoggedIn);
    setName(storedName);
    setEmail(storedEmail);
  }, []);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
  }, [isLoggedIn, name, email]);

  // Wrapper for protecting routes
  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/" replace />;
  };

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <LoginForm
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
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
                <DashboardPage isLoggedIn={isLoggedIn} name={name} email={email} />
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