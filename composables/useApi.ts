// Di useApi.ts
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
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    } else if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Log untuk debugging
    if (process.dev) {
      console.log(`API Request to ${endpoint}:`, {
        method: options.method || 'GET',
        body: options.body
      });
    }
    
    // Merge default options with provided options
    const fetchOptions = {
      baseURL,
      ...options,
      headers,
      // Pastikan kita mendapatkan data error lengkap
      onResponseError(context: { response: { status: number, _data: any } }) {
        console.log('Error context full:', context);
        console.log('Error response data:', context.response._data);
        console.log('Error status:', context.response.status);
        
        if (process.dev) {
          console.error(`API Error Response for ${endpoint}:`, {
            status: context.response.status,
            data: context.response._data
          });
        }
        
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