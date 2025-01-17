import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import Register from "./components/Register";
import TakeAttendance from "./components/TakeAttendance";
import LandingPage from "./components/LandingPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <StudentDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/take-attendance"
            element={
              isAuthenticated ? <TakeAttendance /> : <Navigate to="/login" />
            }
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

/*
login --->
A-dashboard
------>model attendance
----------->Reconfigure model(option) feri photo

login (no)   ---->register


ADMIN PAGE  (CHUTTAI) COMPONENT
      ADMIN LE VERIFY GARNE
      ADMIN LE ADD STUDENT (FORM)
      ADMIN LE CLASS MANAGE (FORM)
      ADMIN LE REPORT HERNA PAUNU PARYO

ADMIN CHUTTAI LOGIN -------FRONT PAGE    
                    AMS UI 
                    TA STUDENT HOS KI TEACHER HOS
                    STUDENT HO BHANE STUDENT LOGIN NATRA TEACHER LOGIN
*/
