import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();
    
    if (!authStore.isAuthenticated || authStore.user?.role !== 'admin') {
        // Redirect to login or home based on authentication status
        return navigateTo(authStore.isAuthenticated ? '/' : '/auth/login');
    }
});