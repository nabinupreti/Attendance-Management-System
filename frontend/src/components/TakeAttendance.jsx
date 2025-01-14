import React from 'react';

function TakeAttendance() {
  return (
    <div className="take-attendance">
      <h1>Take Attendance</h1>
      <div className="webcam-frame">
        {/* Webcam feed will be displayed here */}
        <p>Webcam feed will be displayed here</p>
      </div>
      <button className="take-attendance-button">Take Attendance</button>
    </div>
  );
}

export default TakeAttendance;