import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Tự động gắn token vào mỗi request nếu đã đăng nhập
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
