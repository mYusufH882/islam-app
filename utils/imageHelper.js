import { useRuntimeConfig } from 'nuxt/app';

export const getImageUrl = (path) => {
  if (!path) return null;
  
  // If path is already a full URL with http/https, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Get the runtime config
  const config = useRuntimeConfig();
  
  // Use BACKEND_URL environment variable for backend URL
  // First try to get it from Nuxt runtime config
  let backendUrl;
  
  if (process.client) {
    try {
      // Use environment variables with fallbacks
      backendUrl = config.public.apiBaseUrl || 'http://localhost:3001';
      
      // Remove '/api' suffix if it exists
      if (backendUrl && backendUrl.endsWith('/api')) {
        backendUrl = backendUrl.slice(0, -4);
      }
      
      // If no config available, use logic based on environment
      if (!backendUrl) {
        backendUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3001' 
          : window.location.origin.replace(/:\d+$/, ':3001');
      }
    } catch (error) {
      console.error('Error getting backend URL:', error);
      // Fallback
      backendUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3001' 
        : window.location.origin.replace(/:\d+$/, ':3001');
    }
  } else {
    // Server-side - use config or fallback
    backendUrl = config.public.BACKEND_URL || 'http://localhost:3001';
    if (backendUrl.endsWith('/api')) {
      backendUrl = backendUrl.slice(0, -4);
    }
  }
  
  // If path is a complete backend path starting with /uploads/
  // Extract just the part after /uploads/
  if (path.includes('/uploads/')) {
    const pathParts = path.split('/uploads/');
    path = pathParts[1];
  }
  
  // Remove any leading slash
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  
  // Direct access to backend uploads folder
  return `${backendUrl}/uploads/${path}`;
};