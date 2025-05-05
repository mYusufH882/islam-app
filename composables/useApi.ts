import { useAuthStore } from "~/stores/auth";
import type { ApiResponse } from "~/utils/api";

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;
  
  // Generic fetch function with typed response
  const apiFetch = <T = any>(endpoint: string, options: any = {}) => {
    const authStore = useAuthStore();
    
    // Add authorization header if user is authenticated
    const headers = {
      ...(options.headers || {}),
    };
    
    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`;
    }
    
    // Jangan tambahkan Content-Type jika kita mengirim FormData
    // Browser akan otomatis menambahkan dengan boundary yang tepat
    if (options.body instanceof FormData) {
      // Hapus Content-Type jika ada, biarkan browser yang mengaturnya
      delete headers['Content-Type'];
    } else if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      // Untuk non-FormData, tambahkan default Content-Type
      headers['Content-Type'] = 'application/json';
    }
    
    // Merge default options with provided options
    const fetchOptions = {
      baseURL,
      ...options,
      headers,
      onResponseError(context: { response: { status: number } }) {
        // Handle common errors here
        if (context.response.status === 401) {
          // Handle unauthorized (expired token)
          authStore.logout();
        }
      }
    };
    
    return useFetch<ApiResponse<T>>(endpoint, fetchOptions);
  };
  
  return {
    apiFetch
  };
};