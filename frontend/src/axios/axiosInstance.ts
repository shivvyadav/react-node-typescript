import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

api.interceptors.request.use(
  (config) => {
    // You can add authorization tokens or other headers here
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add auth token to headers,no need for cookies
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status: number = error.response.status;
      if (status === 401) {
        // Handle unauthorized access, e.g., redirect to login
        console.error("Unauthorized access ");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      } else if (status === 403) {
        // Handle forbidden access
        console.error("Forbidden access - you don't have permission to access this resource.");
      } else if (status >= 500) {
        // Handle server errors
        console.error("Server error - please try again later.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
