<template>
  <!-- Main Content - tambahkan class untuk layout dan hapus gap berlebih -->
  <div class="dashboard-container">
    <!-- Pesan bookmark ditampilkan saat diperlukan -->
    <BookmarkNotification
      v-if="showBookmarkMessage"
      :message="bookmarkMessage"
      @close="showBookmarkMessage = false"
    />
    
    <!-- Greeting Card -->
    <GreetingCard 
      :username="getUserName()" 
      :date="currentDate"
    />

    <!-- Quick Access Tiles -->
    <QuickAccessTiles :total-bookmarks="totalBookmarks" />

    <!-- Gunakan solusi manual untuk menggantikan Suspense -->
    <ClientOnly>
      <template #fallback>
        <PrayerTimesSkeleton />
      </template>
      <div v-if="!prayerTimesLoaded" class="prayer-times-skeleton">
        <PrayerTimesSkeleton />
      </div>
      <PrayerTimesCard 
        v-else
        :prayers="todayPrayers" 
        :location="prayerLocationSafe" 
        :loading="loadingPrayer" 
        :error="prayerErrorSafe"
        @refresh="refreshPrayerTimes"
      />
    </ClientOnly>

    <!-- Last Read Card - dengan manual loading -->
    <ClientOnly>
      <template #fallback>
        <LastReadSkeleton />
      </template>
      <div v-if="!lastReadLoaded" class="last-read-skeleton">
        <LastReadSkeleton />
      </div>
      <LastReadCard 
        v-else
        :last-read="lastReadSafe" 
      />
    </ClientOnly>

    <!-- Artikel Terbaru - dengan manual loading -->
    <ClientOnly>
      <template #fallback>
        <div class="space-y-3 mb-6">
          <div v-for="i in 3" :key="i" class="bg-white p-3 rounded-lg shadow flex items-center space-x-3">
            <div class="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 animate-pulse"></div>
            <div class="flex-1">
              <div class="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
            </div>
          </div>
        </div>
      </template>
      <div v-if="!articlesLoaded" class="space-y-3 mb-6">
        <div v-for="i in 3" :key="i" class="bg-white p-3 rounded-lg shadow flex items-center space-x-3">
          <div class="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 animate-pulse"></div>
          <div class="flex-1">
            <div class="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
          </div>
        </div>
      </div>
      <LazyArticlesSection
        v-else
        :articles="latestArticles"
        :loading="loadingArticles"
        :error="articlesErrorSafe"
        :refreshing="refreshingArticles"
        :has-new="hasNewArticles"
        @refresh="refreshArticles"
        @bookmark="handleBookmarkUpdate"
      />
    </ClientOnly>
  </div>
  
  <!-- Login Modal dengan Lazy loading -->
  <ClientOnly>
    <LoginPromptModal :show-delay="2000" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useBookmarkService } from '~/composables/useBookmarkService';
import { useUserDashboard } from '~/composables/useUserDashboard';

// Konsistensi path import - gunakan semua alias ~ untuk mencegah issue relatif
import GreetingCard from '../components/dashboard/GreetingCard.vue';
import QuickAccessTiles from '../components/dashboard/QuickAccessTiles.vue';
import PrayerTimesCard from '../components/dashboard/PrayerTimesCard.vue';
import PrayerTimesSkeleton from '../components/dashboard/PrayerTimesSkeleton.vue';
import LastReadCard from '../components/dashboard/LastReadCard.vue';
import LastReadSkeleton from '../components/dashboard/LastReadSkeleton.vue';
import LazyArticlesSection from '../components/dashboard/LazyArticlesSection.vue';
import BookmarkNotification from '../components/dashboard/BookmarkNotification.vue';

// Auth store dan router
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Formated current date - dihitung sekali saja
const currentDate = new Date().toLocaleDateString('id-ID', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
});

// Loading state untuk komponen
const prayerTimesLoaded = ref(false);
const lastReadLoaded = ref(false);
const articlesLoaded = ref(false);

// Ekstrak state dan methods dari composable yang teroptimasi
const {
  // State - ambil reactive state yang dibutuhkan saja
  todayPrayers, 
  prayerLocation,
  loadingPrayer,
  prayerError,
  lastRead,
  latestArticles,
  loadingArticles,
  articlesError,
  
  // Actions
  initDashboard,
  fetchPrayerTimes,
  refreshLatestArticles
} = useUserDashboard();

const prayerLocationSafe = computed(() => prayerLocation.value === null ? undefined : prayerLocation.value);
const prayerErrorSafe = computed(() => prayerError.value === null ? undefined : prayerError.value);
const lastReadSafe = computed(() => lastRead.value === null ? undefined : lastRead.value);
const articlesErrorSafe = computed(() => articlesError.value === null ? undefined : articlesError.value);

// Bookmark service
const bookmarkService = useBookmarkService();

// State untuk notifikasi bookmark
const bookmarkMessage = ref('');
const showBookmarkMessage = ref(false);

// State untuk artikel
const refreshingArticles = ref(false);
const hasNewArticles = ref(false);
const articleCheckInterval = ref<number | null>(null);

// Flag untuk melacak apakah dashboard sudah dimount sepenuhnya
const dashboardMounted = ref(false);

// Fungsi untuk mendapatkan jumlah bookmark secara memoized
const totalBookmarks = computed(() => {
  if (!authStore.isAuthenticated) return 0;
  return (bookmarkService.quranBookmarks.value?.length || 0) + 
         (bookmarkService.blogBookmarks.value?.length || 0);
});

// Fungsi untuk mendapatkan nama user
const getUserName = () => {
  if (!authStore.user) return '';
  return authStore.user.name || authStore.user.username || '';
};

// Check apakah ada artikel baru
const checkForNewArticles = async () => {
  // Hanya periksa jika tab terlihat
  if (document.visibilityState !== 'visible') return;
  
  try {
    // Gunakan API dashboard store dengan flag checkOnly=true untuk efisiensi
    const hasChanges = await refreshLatestArticles(true);
    hasNewArticles.value = hasChanges;
  } catch (error) {
    console.error('Error checking for new articles:', error);
  }
};

// Fungsi untuk memperbarui jadwal shalat
const refreshPrayerTimes = async () => {
  try {
    await fetchPrayerTimes(undefined, undefined, true);
  } catch (error) {
    console.error('Error refreshing prayer times:', error);
  }
};

// Fungsi untuk me-refresh artikel
const refreshArticles = async () => {
  refreshingArticles.value = true;
  
  try {
    await refreshLatestArticles(false);
    hasNewArticles.value = false;
  } catch (error) {
    console.error('Error refreshing articles:', error);
  } finally {
    refreshingArticles.value = false;
  }
};

// Interface untuk event bookmark
interface BookmarkEvent {
  action: 'add' | 'remove';
  id: string | number;
  type: string;
}

// Fungsi untuk menangani pembaruan bookmark
const handleBookmarkUpdate = (event: BookmarkEvent) => {
  // Menampilkan pesan berhasil
  bookmarkMessage.value = event.action === 'add' 
    ? 'Artikel berhasil ditambahkan ke bookmark' 
    : 'Artikel berhasil dihapus dari bookmark';
  
  // Tampilkan notifikasi
  showBookmarkMessage.value = true;
};

// Watch untuk loading state - bertahap
watch(todayPrayers, (newVal) => {
  if (newVal && newVal.length > 0 && !loadingPrayer.value) {
    setTimeout(() => {
      prayerTimesLoaded.value = true;
    }, 100);
  }
});

watch(lastRead, () => {
  setTimeout(() => {
    lastReadLoaded.value = true;
  }, 200);
});

watch(latestArticles, (newVal) => {
  if (newVal && newVal.length > 0 && !loadingArticles.value) {
    setTimeout(() => {
      articlesLoaded.value = true;
    }, 300);
  }
});

// Lifecycle hooks
onMounted(async () => {
  // Tunggu selesainya operasi DOM
  await nextTick();
  
  // Inisialisasi dashboard dengan data awal - gunakan timeout untuk
  // memastikan DOM sudah sepenuhnya siap
  setTimeout(async () => {
    try {
      await initDashboard();
      
      // Tambahkan timeout kecil sebelum menyatakan dashboard mounted
      setTimeout(() => {
        dashboardMounted.value = true;
      }, 100);
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    }
  }, 50);
  
  // Hapus padding berlebih jika ada
  if (process.client) {
    const appElement = document.querySelector('#app');
    if (appElement) {
      appElement.classList.add('dashboard-loaded');
    }
  }
  
  // Setup interval untuk memeriksa artikel baru setiap 5 menit
  if (process.client && 'setInterval' in window) {
    articleCheckInterval.value = window.setInterval(checkForNewArticles, 5 * 60 * 1000);
    
    // Juga periksa ketika tab menjadi aktif
    document.addEventListener('visibilitychange', checkForNewArticles);
  }
  
  // Load bookmarks untuk user yang terautentikasi
  if (authStore.isAuthenticated) {
    await bookmarkService.loadBookmarks();
  }
});

// Clean up pada unmount
onBeforeUnmount(() => {
  // Clear interval
  if (articleCheckInterval.value) {
    clearInterval(articleCheckInterval.value);
  }
  
  // Remove event listener
  if (process.client) {
    document.removeEventListener('visibilitychange', checkForNewArticles);
    
    // Hapus class khusus dashboard
    const appElement = document.querySelector('#app');
    if (appElement) {
      appElement.classList.remove('dashboard-loaded');
    }
  }
});

// Watch untuk router dan auth state perubahan
watch(() => route.path, (newPath) => {
  // Jika pengguna kembali ke homepage, reload data
  if (newPath === '/') {
    initDashboard(false); // refresh tanpa force - akan menggunakan cache
  }
});

watch(() => authStore.isAuthenticated, async (isAuthenticated) => {
  if (isAuthenticated) {
    await bookmarkService.loadBookmarks();
  }
});
</script>

<style scoped>
.dashboard-container {
  /* Merapikan layout dashboard */
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Konsisten spacing antar komponen */
  padding: 0.75rem; /* Padding container utama */
  min-height: 0; /* Hapus height berlebih */
  max-width: 100vw; /* Pastikan tidak overflow */
}

/* Untuk menghindari layout shift selama hydration */
.prayer-times-skeleton,
.last-read-skeleton {
  max-height: 120px; /* Batasi tinggi skeleton */
  overflow: hidden;
}

/* Animasi transisi untuk komponen */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>