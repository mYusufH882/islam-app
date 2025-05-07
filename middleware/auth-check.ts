import { useLoginModal } from '~/composables/useLoginModal';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip pada server-side
  if (process.server) return;
  
  const authStore = useAuthStore();
  const { openLoginModal } = useLoginModal();
  
  // Cek apakah pengguna sudah login
  if (!authStore.isAuthenticated) {
    // Daftar halaman yang memerlukan login
    const protectedPages = ['/bookmark'];
    
    // Jika mencoba mengakses halaman yang memerlukan autentikasi
    if (protectedPages.some(page => to.path.startsWith(page))) {
      // Menyimpan path untuk redirect dan membuka modal login
      openLoginModal(to.fullPath);
      
      // Redirect ke halaman utama
      return navigateTo('/');
    }
  }
});