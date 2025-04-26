import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
    // Prevent server-side execution
    if (process.server) return;

    const authStore = useAuthStore();
    const route = useRoute();
    const router = useRouter();

    // Comprehensive Authentication Initialization
    const initializeAuth = async () => {
        try {
            // Initialize authentication store
            await authStore.init();

            // Advanced Navigation Logic
            handleAuthenticatedNavigation();
        } catch (error) {
            console.error('Authentication initialization failed:', error);
            authStore.logout();
        }
    };

    // Sophisticated Navigation Handler
    const handleAuthenticatedNavigation = () => {
        // Define route categories
        const publicRoutes = ['/'];
        const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];
        const adminRoutes = ['/admin', '/admin/users', '/admin/blog'];
        const userRoutes = ['/profile', '/bookmark'];

        // Current route and authentication status
        const currentPath = route.path;
        const isAuthenticated = authStore.isAuthenticated;
        const userRole = authStore.user?.role;

        // Navigation Rules
        const navigateBasedOnRole = () => {
            // Authenticated admin on non-admin routes
            if (isAuthenticated && userRole === 'admin') {
                if (currentPath === '/' || authRoutes.includes(currentPath)) {
                    router.replace('/admin');
                    return true;
                }
            }

            // Authenticated user on auth routes
            if (isAuthenticated && authRoutes.includes(currentPath)) {
                router.replace(userRole === 'admin' ? '/admin' : '/');
                return true;
            }

            // Non-authenticated user on protected routes
            const protectedRoutes = [...adminRoutes, ...userRoutes];
            if (!isAuthenticated && protectedRoutes.some(route => currentPath.startsWith(route))) {
                router.replace('/auth/login');
                return true;
            }

            return false;
        };

        // Execute navigation rules
        navigateBasedOnRole();
    };

    // Token Refresh Mechanism
    const setupTokenRefreshInterceptor = () => {
        // You can implement token refresh logic here
        // Example using axios interceptor or fetch wrapper
    };

    // Global Navigation Guard
    nuxtApp.hook('app:mounted', () => {
        // Initialize authentication and handle navigation
        initializeAuth();

        // Setup token refresh mechanism
        setupTokenRefreshInterceptor();
    });

    // Optional: Add router navigation guards
    router.beforeEach(async (to, from, next) => {
        next();
    });
});