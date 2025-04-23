import axios from "axios";
import { getSession } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof document !== "undefined") {
      const session = await getSession();

      const token = session?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401 && typeof window !== "undefined") {
        if (!window.location.pathname.includes("/sign-in")) {
          window.location.href = "/sign-in";
        }
      }
    } else if (error.request) {
      console.log("Request error:", error.request);
    } else {
      console.log("Error:", error.message);
    }

    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

export default axiosInstance;
