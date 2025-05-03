// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
    // Skip middleware on server-side or for auth related pages
    if (process.server || to.path.startsWith('/auth/')) return;
  
    const authStore = useAuthStore();
    
    // Wait for auth store initialization
    await authStore.init();
  
    // Define routes that require special handling
    const adminRoutes = ['/admin', '/admin/users', '/admin/blog'];
    const isAdminRoute = adminRoutes.some(route => to.path.startsWith(route));
  
    // Navigation logic based on roles
    if (isAdminRoute) {
      // If trying to access admin routes
      if (!authStore.isAuthenticated) {
        return navigateTo('/auth/login');
      }
  
      // Ensure only admins can access
      if (authStore.user?.role !== 'admin') {
        return navigateTo('/auth/login');
      }
  
      // If already admin, ensure staying on admin route
      return;
    }
  
    // Main route (/) for admin should redirect to admin dashboard
    if (to.path === '/' && authStore.user?.role === 'admin') {
      return navigateTo('/admin');
    }
});