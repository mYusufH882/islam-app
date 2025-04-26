import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
    // Skip middleware if we're headed to authentication pages
    if (to.path.startsWith('/auth/')) {
      return;
    }
  
    const authStore = useAuthStore();
    
    // If trying to access admin routes
    if (to.path.startsWith('/admin')) {
      // Check if the user is authenticated and is an admin
      if (!authStore.isAuthenticated) {
        // Not authenticated, redirect to login
        return navigateTo('/auth/login');
      }
      
      // Check if user has admin role
      if (authStore.user?.role !== 'admin') {
        // User is authenticated but not an admin, redirect to home
        return navigateTo('/');
      }
    }
    
    // If trying to access protected user routes (you can add more paths as needed)
    if (['/profile', '/bookmark'].some(path => to.path.startsWith(path))) {
      // Check if the user is authenticated
      if (!authStore.isAuthenticated) {
        // Not authenticated, redirect to login
        return navigateTo('/auth/login');
      }
    }
});