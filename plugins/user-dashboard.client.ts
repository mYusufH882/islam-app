import { defineNuxtPlugin } from '#app';
import { useUserDashboardStore } from '~/stores/user-dashboard.store';

export default defineNuxtPlugin(async (nuxtApp) => {
  // Skip on server-side
  if (process.server) return;
  
  // Get dashboard store
  const dashboardStore = useUserDashboardStore();
  
  // Initialize dashboard data
  nuxtApp.hook('app:mounted', () => {
    dashboardStore.initDashboard();
  });
});