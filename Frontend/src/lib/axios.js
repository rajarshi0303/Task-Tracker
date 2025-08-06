import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, response = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(response);
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not retried yet and not the refresh request itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => instance(originalRequest))
          .catch(Promise.reject);
      }

      isRefreshing = true;

      try {
        const res = await instance.get("/api/auth/refresh");
        processQueue(null, res);
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        useAuthStore.getState().logout();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
