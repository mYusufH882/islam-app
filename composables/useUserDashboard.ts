import { storeToRefs } from 'pinia';
import { useUserDashboardStore } from '~/stores/user-dashboard.store';

export const useUserDashboard = () => {
  const dashboardStore = useUserDashboardStore();
  
  // Extract reactive state from store
  const { 
    todayPrayers, 
    prayerLocation,
    loadingPrayer,
    prayerError,
    lastRead,
    bookmarks,
    loadingQuran,
    quranError,
    latestArticles,
    loadingArticles,
    articlesError,
    dashboardInitialized
  } = storeToRefs(dashboardStore);
  
  // Extract actions
  const { 
    fetchPrayerTimes,
    updateNextPrayer,
    loadLastRead,
    loadBookmarks,
    fetchUserBookmarks,
    fetchLatestArticles,
    initDashboard
  } = dashboardStore;
  
  // Helper functions
  const formatLastReadTime = (timestamp: string): string => {
    if (!timestamp) return '';
    
    const lastReadDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastReadDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hari ini';
    } else if (diffDays === 1) {
      return 'Kemarin';
    } else {
      return `${diffDays} hari yang lalu`;
    }
  };
  
  const formatArticleDate = (timestamp: string): string => {
    if (!timestamp) return '';
    
    const articleDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - articleDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hari ini';
    } else if (diffDays === 1) {
      return 'Kemarin';
    } else if (diffDays < 7) {
      return `${diffDays} hari yang lalu`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} minggu yang lalu`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} bulan yang lalu`;
    }
  };
  
  // Get current prayer
  const getCurrentPrayer = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
    let currentPrayerIndex = -1;
  
    // Find the latest prayer time that has passed
    todayPrayers.value.forEach((prayer, index) => {
      const [hour, minute] = prayer.time.split(':').map(Number);
      const prayerTimeInMinutes = hour * 60 + minute;
      
      if (prayerTimeInMinutes <= currentTimeInMinutes) {
        currentPrayerIndex = index;
      }
    });
  
    return currentPrayerIndex !== -1 ? todayPrayers.value[currentPrayerIndex] : null;
  };
  
  // Get next prayer
  const getNextPrayer = () => {
    return todayPrayers.value.find(prayer => prayer.isNext) || null;
  };
  
  return {
    // State
    todayPrayers,
    prayerLocation,
    loadingPrayer,
    prayerError,
    lastRead,
    bookmarks,
    loadingQuran,
    quranError,
    latestArticles,
    loadingArticles,
    articlesError,
    dashboardInitialized,
    
    // Actions
    fetchPrayerTimes,
    updateNextPrayer,
    loadLastRead,
    loadBookmarks,
    fetchUserBookmarks,
    fetchLatestArticles,
    refreshLatestArticles: dashboardStore.refreshLatestArticles,
    initDashboard,
    
    // Helpers
    formatLastReadTime,
    formatArticleDate,
    getCurrentPrayer,
    getNextPrayer
  };
};