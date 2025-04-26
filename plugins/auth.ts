import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
    // Initialize auth store on app startup
    const authStore = useAuthStore();
    
    // Wait until Nuxt is ready before initializing the auth store
    nuxtApp.hook('app:created', () => {
      authStore.init();
    });
    
    // Add $auth to the Nuxt context for easier access
    return {
      provide: {
        auth: authStore
      }
    };
});