import { LoginForm } from "./components/ui/login-form"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationForm from "./components/ui/registration"
import NoPage from './components/ui/nopage'
import DashboardPage from "./app/dashboard/page"
import LandingPage from "./components/ui/LandingPage";
import "./App.css";


import ForgotPassword from "./pages/ForgotPassword";//yet to make
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./pages/ResetPassword";//yet to make
import { useState } from "react";



export default function Home() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email , setEmail] = useState("");
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <LoginForm 
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setName={setName}
            setEmail={setEmail}
          />
        } />
        <Route path="/register" element={<RegistrationForm 
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setName={setName}
            setEmail={setEmail}
        />} />
        <Route path="/dashboard" element={
          <DashboardPage
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setName={setName}
            setEmail={setEmail}
          />
        } />
        <Route path="/forgotPassword" element={<ForgotPassword 
        isLoggedIn={isLoggedIn} />} />
        <Route path="/resetPassword" element={<ResetPassword isLoggedIn={isLoggedIn} />} />
        <Route path="/profile" element={
          <Profile isLoggedIn={isLoggedIn} name={name} email={email} />
        } />
        <Route path="*" element={
          <NoPage 
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setName={setName}
            setEmail={setEmail}
          />
        } />
      </Routes>
    </BrowserRouter>
  );
}


// npm install react-toastify
