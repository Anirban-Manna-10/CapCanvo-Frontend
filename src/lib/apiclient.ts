import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export function useApiClient() {
  const { getToken } = useAuth();

  apiClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return apiClient;
}