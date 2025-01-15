import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Logging in with", { username, password });
    // You can add your login API call here
  };

  const handleRegister = () => {
    // Handle register logic here
    console.log("Redirecting to register page");
    // You can add your register page redirection logic here
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};
export default Login;
//POST http://localhost:8000/api/login
/*
{
  "username": "user@example.com",
  "password": "password123"
}

200
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "message": "Login successful"
}

401
{
  "error": "Invalid username or password"
}

400
{
  "error": "Username and password are required"
}


import axios from "axios";

export const getCSRFToken = async () => {
    const response = await axios.get("http://localhost:8000/api/csrf/", {
        withCredentials: true, // Needed to handle cookies
    });
    return response.data.csrfToken;
};



import React, { useState } from "react";
import axios from "axios";
import { getCSRFToken } from "./csrf";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const csrfToken = await getCSRFToken();
            const response = await axios.post(
                "http://localhost:8000/api/login/",
                { username, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfToken,
                    },
                    withCredentials: true, // Needed to send cookies
                }
            );
            console.log("Login Successful", response.data);
        } catch (error) {
            console.error("Login failed", error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginPage;









*/
