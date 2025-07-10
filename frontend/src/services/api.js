import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (name, email, password) => api.post("/auth/register", { name, email, password }),
  getMe: () => api.get("/auth/me"),
}

// Candidates API
export const candidatesAPI = {
  create: (formData) => {
    return api.post("/candidates", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  getAll: (params) => api.get("/candidates", { params }),
  getById: (id) => api.get(`/candidates/${id}`),
  updateStatus: (id, status) => api.put(`/candidates/${id}/status`, { status }),
  delete: (id) => api.delete(`/candidates/${id}`),
  getStats: () => api.get("/candidates/stats"),
}

export default api
