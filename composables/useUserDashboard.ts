import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import type { ComputedRef } from 'vue';
import { useUserDashboardStore } from '~/stores/user-dashboard.store';
import type { PrayerTime } from '~/stores/user-dashboard.store';

// Interface untuk menyimpan hasil pemanggilan fungsi yang sering digunakan
interface FormatCache {
  [key: string]: string;
}

// Cache untuk memformat timestamps
const lastReadTimeCache: FormatCache = {};
const articleDateCache: FormatCache = {};

export const useUserDashboard = () => {
  const dashboardStore = useUserDashboardStore();
  
  // Extract reactive state from store (hanya yang dibutuhkan di UI)
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
  
  // Simpan current prayer dalam ref yang hanya diupdate setiap menit
  const currentPrayerRef = ref<PrayerTime | null>(null);
  const nextPrayerRef = ref<PrayerTime | null>(null);
  
  // Update current dan next prayer hanya sekali per menit
  let lastUpdateTime = 0;
  
  // Helper functions dengan memoization
  const formatLastReadTime = (timestamp: string): string => {
    if (!timestamp) return '';
    
    // Gunakan cache jika timestamp sudah pernah diformat
    if (lastReadTimeCache[timestamp]) {
      return lastReadTimeCache[timestamp];
    }
    
    const lastReadDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastReadDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let result = '';
    if (diffDays === 0) {
      result = 'Hari ini';
    } else if (diffDays === 1) {
      result = 'Kemarin';
    } else {
      result = `${diffDays} hari yang lalu`;
    }
    
    // Simpan hasil ke cache
    lastReadTimeCache[timestamp] = result;
    return result;
  };
  
  const formatArticleDate = (timestamp: string): string => {
    if (!timestamp) return '';
    
    // Gunakan cache jika timestamp sudah pernah diformat
    if (articleDateCache[timestamp]) {
      return articleDateCache[timestamp];
    }
    
    const articleDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - articleDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let result = '';
    if (diffDays === 0) {
      result = 'Hari ini';
    } else if (diffDays === 1) {
      result = 'Kemarin';
    } else if (diffDays < 7) {
      result = `${diffDays} hari yang lalu`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      result = `${weeks} minggu yang lalu`;
    } else {
      const months = Math.floor(diffDays / 30);
      result = `${months} bulan yang lalu`;
    }
    
    // Simpan hasil ke cache
    articleDateCache[timestamp] = result;
    return result;
  };
  
  // Optimasi untuk getCurrentPrayer - hanya update sekali per menit
  const getCurrentPrayer = () => {
    const now = new Date();
    const currentTimeValue = now.getHours() * 60 + now.getMinutes();
    
    // Hanya update jika sudah berlalu lebih dari 1 menit
    if (now.getTime() - lastUpdateTime >= 60000 || currentPrayerRef.value === null) {
      lastUpdateTime = now.getTime();
      
      let currentPrayerIndex = -1;
      const prayers = todayPrayers.value || [];
      
      // Find the latest prayer time that has passed
      prayers.forEach((prayer, index) => {
        if (!prayer.time) return;
        
        const [hour, minute] = prayer.time.split(':').map(Number);
        const prayerTimeInMinutes = hour * 60 + minute;
        
        if (prayerTimeInMinutes <= currentTimeValue) {
          currentPrayerIndex = index;
        }
      });
      
      currentPrayerRef.value = currentPrayerIndex !== -1 ? prayers[currentPrayerIndex] : null;
      nextPrayerRef.value = prayers.find(prayer => prayer.isNext) || null;
    }
    
    return currentPrayerRef.value;
  };
  
  // Optimasi untuk getNextPrayer - menggunakan ref yang diupdate bersama getCurrentPrayer
  const getNextPrayer = () => {
    // Pastikan referensi terupdate
    getCurrentPrayer();
    return nextPrayerRef.value;
  };
  
  // Kembalikan semua yang diperlukan dalam bentuk teroptimasi
  return {
    // State - pass-through dari store
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
    
    // Actions - bind langsung ke store untuk menghindari re-creation fungsi
    fetchPrayerTimes: dashboardStore.fetchPrayerTimes,
    updateNextPrayer: dashboardStore.updateNextPrayer,
    loadLastRead: dashboardStore.loadLastRead,
    loadBookmarks: dashboardStore.loadBookmarks,
    fetchUserBookmarks: dashboardStore.fetchUserBookmarks,
    fetchLatestArticles: dashboardStore.fetchLatestArticles,
    refreshLatestArticles: dashboardStore.refreshLatestArticles,
    initDashboard: dashboardStore.initDashboard,
    
    // Helpers - fungsi dioptimasi dengan caching
    formatLastReadTime,
    formatArticleDate,
    getCurrentPrayer,
    getNextPrayer
  };
};