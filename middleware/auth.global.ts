export default defineNuxtRouteMiddleware(async (to, from) => {
  // Pastikan hanya dijalankan di sisi klien
  if (process.server) return;

  const authStore = useAuthStore();
  
  // Tunggu inisialisasi auth store
  await authStore.init();

  // Rute yang memerlukan penanganan khusus
  const adminRoutes = ['/admin', '/admin/users', '/admin/blog'];
  const isAdminRoute = adminRoutes.some(route => to.path.startsWith(route));

  // Logika navigasi berbasis peran
  if (isAdminRoute) {
      // Jika mencoba mengakses rute admin
      if (!authStore.isAuthenticated) {
          return navigateTo('/auth/login');
      }

      // Pastikan hanya admin yang bisa mengakses
      if (authStore.user?.role !== 'admin') {
          return navigateTo('/auth/login');
      }

      // Jika sudah admin, pastikan tetap di rute admin
      return;
  }

  // Rute utama (/) untuk admin seharusnya redirect ke admin
  if (to.path === '/' && authStore.user?.role === 'admin') {
      console.log('Redirecting admin to admin dashboard');
      return navigateTo('/admin');
  }
});