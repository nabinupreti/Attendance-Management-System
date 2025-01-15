import axios from "axios";

export const fetchData = async () => {
  const response = await fetch("http://127.0.0.1:8000/api/"); // Replace with your API endpoint
  const data = await response.json();
  return data;
};

export const getCSRFToken = async () => {
  const response = await axios.get("http://localhost:8000/api/csrf/", {
    withCredentials: true, // Needed to handle cookies
  });
  return response.data.csrfToken;
};
