import React from 'react';

function StudentDashboard() {
  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>
      
      <section className="attendance">
        <h2>Attendance</h2>
        <p>Attendance Percentage: 95%</p>
        <p>Days Present: 180</p>
        <p>Days Absent: 10</p>
      </section>
      
      <section className="upcoming-classes">
        <h2>Upcoming Classes</h2>
        <ul>
          <li>Math - 10:00 AM</li>
          <li>Science - 11:00 AM</li>
          <li>History - 1:00 PM</li>
        </ul>
      </section>
      
      <section className="notifications">
        <h2>Recent Notifications</h2>
        <ul>
          <li>Assignment due on Friday</li>
          <li>Parent-Teacher meeting next week</li>
          <li>School holiday on Monday</li>
        </ul>
      </section>

      <section className="upcoming-holidays">
        <h2>Upcoming Holidays</h2>
        <ul>
          <li>Christmas - December 25</li>
          <li>New Year's Day - January 1</li>
          <li>Independence Day - July 4</li>
        </ul>
      </section>
    </div>
  );
}

export default StudentDashboard;