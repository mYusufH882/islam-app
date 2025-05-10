export default defineNuxtRouteMiddleware((to, from) => {
  // Pastikan kita hanya menjalankan middleware di client-side
  if (process.server) return;
  
  // Import authStore secara dinamis untuk menghindari masalah SSR
  const authStore = useAuthStore();
  
  // Periksa autentikasi setelah hydration selesai
  if (typeof window !== 'undefined' && !authStore.isAuthenticated) {
    return navigateTo(`/auth/login?redirect=${to.fullPath}`);
  }
});