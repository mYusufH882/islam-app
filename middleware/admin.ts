export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    // Pastikan hanya admin yang bisa mengakses
    if (!authStore.isAuthenticated || authStore.user?.role !== 'admin') {
        return navigateTo('/');
    }
});