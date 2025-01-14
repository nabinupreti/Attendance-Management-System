import "./App.css";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import StudentDashboard from "./components/StudentDashboard";
import Register from "./components/Register";
import TakeAttendance from "./components/TakeAttendance";
import EnrollFaceData from "./components/EnrollFaceData";

function App() {
  return (
    <div>
      <Navigation />
      <Login />
      <StudentDashboard />
      <Register />
      <TakeAttendance />
      <EnrollFaceData />
    </div>
  );
}

export default App;
