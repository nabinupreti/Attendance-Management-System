import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css'; 

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    navigate('/login?role=student');
  };

  const handleTeacherLogin = () => {
    navigate('/login?role=teacher');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="landing-page">
      <header className="header">
        <h1>Attendance Management System</h1>
        <p>Efficiently manage attendance for students and teachers.</p>
      </header>
      <section className="features">
        <h2>Features</h2>
        <ul>
          <li>Automated attendance tracking</li>
          <li>Real-time attendance reports</li>
          <li>Easy integration with existing systems</li>
          <li>Secure and reliable</li>
        </ul>
      </section>
      <section className="actions">
        <button onClick={handleStudentLogin} className="btn btn-primary">Student Login</button>
        <button onClick={handleTeacherLogin} className="btn btn-secondary">Teacher Login</button>
        <button onClick={handleRegister} className="btn btn-tertiary">Register</button>
      </section>
    </div>
  );
};

export default LandingPage;