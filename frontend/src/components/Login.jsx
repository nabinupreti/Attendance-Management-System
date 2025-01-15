import React, { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        username,
        password,
      });

      if (response.status === 200) {
        setMessage(`Welcome, ${response.data.user}`);
      } else {
        setMessage("Invalid credentials");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setMessage(error.response.data.error || "Authentication failed");
      } else if (error.request) {
        // Request was made but no response received
        setMessage("No response from server");
      } else {
        // Something else caused the error
        setMessage("Error: " + error.message);
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;
