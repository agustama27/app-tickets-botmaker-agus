import axios from "axios"
import { API_BASE_URL } from "./config"

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For cookie-based auth
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding auth token if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // If using Bearer token instead of cookies, add it here
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)
