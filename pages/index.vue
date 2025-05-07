<template>
  <!-- Main Content -->
  <div>
    <!-- Greeting Card -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <h2 class="text-lg font-semibold">
        Assalamu'alaikum{{ authStore.isAuthenticated ? ', ' + getUserName() : ', Akhi/Ukhti' }}
      </h2>
      <p class="text-gray-600">Selamat datang di Enterpreneur Muslim App</p>
      <div class="mt-2 flex items-center text-sm text-gray-500">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{{ currentDate }}</span>
      </div>
    </div>

    <!-- Quick Access Tiles -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <NuxtLink to="/quran" class="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 mb-2 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span class="font-medium">Al-Quran</span>
        </div>
      </NuxtLink>
      
      <NuxtLink to="/prayer-times" class="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 mb-2 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="font-medium">Jadwal Salat</span>
        </div>
      </NuxtLink>
      
      <NuxtLink to="/blog" class="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 mb-2 bg-purple-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <span class="font-medium">Blog</span>
        </div>
      </NuxtLink>
      
      <NuxtLink to="/bookmark" class="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50 relative">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 mb-2 bg-amber-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <span class="font-medium">Bookmark</span>
        </div>
        
        <!-- Add a badge showing total bookmarks if user has any -->
        <div v-if="authStore.isAuthenticated && totalBookmarks > 0" 
            class="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium">
          {{ totalBookmarks }}
        </div>
      </NuxtLink>
    </div>

    <!-- Waktu Sholat Hari Ini - Improved with better location handling -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold">Jadwal Salat Hari Ini</h3>
        <NuxtLink to="/prayer-times" class="text-sm text-blue-600">Lihat Semua</NuxtLink>
      </div>
      <div v-if="prayerError && locationInstructions" class="mt-2 p-3 bg-yellow-50 text-yellow-800 rounded-md text-xs">
        {{ locationInstructions }}
      </div>
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Header dengan lokasi yang ditingkatkan -->
        <div class="p-3 bg-blue-200 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div class="text-xl font-semibold text-blue-600">
              {{ formattedTime }}
            </div>
            <div class="flex items-center">
              <!-- Status lokasi dengan indikator yang lebih jelas -->
              <div v-if="loadingPrayer" class="flex items-center text-blue-700">
                <svg class="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm">Memuat...</span>
              </div>
              
              <div v-else-if="prayerLocation" class="flex items-center" :class="{'text-yellow-700': prayerLocation.usingDefault, 'text-blue-700': !prayerLocation.usingDefault}">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-sm">{{ prayerLocation.city }}, {{ prayerLocation.country }}</span>
                <span v-if="prayerLocation.usingDefault" class="ml-1 text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">Default</span>
              </div>
              
              <div v-else-if="prayerError" class="flex items-center text-red-600">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span class="text-xs">Error lokasi</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Kondisi loading untuk jadwal salat -->
        <div v-if="loadingPrayer" class="divide-y divide-gray-200">
          <div class="flex justify-between p-3 bg-blue-50 font-medium text-gray-600">
            <span>Waktu Sholat</span>
            <span>Jam</span>
          </div>
          <!-- Skeleton loader untuk waktu sholat -->
          <div v-for="i in 5" :key="i" class="flex justify-between p-3">
            <div class="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        
        <!-- Kondisi error -->
        <div v-else-if="prayerError" class="p-4 text-center">
          <div class="text-red-600 mb-2">{{ prayerError }}</div>
          <button @click="fetchPrayerTimes" class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
            Coba lagi
          </button>
        </div>
        
        <!-- Kondisi data berhasil dimuat -->
        <div v-else-if="todayPrayers && todayPrayers.length > 0" class="divide-y divide-gray-200">
          <div class="flex justify-between p-3 bg-blue-50 font-medium text-gray-600">
            <span>Waktu Sholat</span>
            <span>Jam</span>
          </div>
          <div v-for="prayer in todayPrayers" :key="prayer.name" 
            class="flex justify-between p-3 transition-colors duration-200"
            :class="{ 'bg-blue-50': prayer.isNext }"
          >
            <div class="font-medium flex items-center">
              <span>{{ prayer.name }}</span>
              <span v-if="prayer.isNext" class="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                Selanjutnya
              </span>
            </div>
            <div class="flex items-center">
              <span>{{ prayer.time }}</span>
              <span v-if="prayer.timeRemaining" class="ml-2 text-xs text-blue-600">({{ prayer.timeRemaining }})</span>
            </div>
          </div>
        </div>
        
        <!-- Kondisi belum ada data -->
        <div v-else class="p-4 text-center text-gray-500">
          Jadwal salat tidak tersedia. 
          <button @click="getGeoLocation" class="ml-1 text-blue-600 underline">Muat ulang</button>
        </div>
      </div>
    </div>

    <!-- Terakhir Dibaca -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold">Terakhir Dibaca</h3>
        <NuxtLink to="/quran" class="text-sm text-blue-600">Buka Al-Quran</NuxtLink>
      </div>
      <!-- Skeleton loader untuk Terakhir Dibaca -->
      <div v-if="lastRead" class="bg-white p-4 rounded-lg shadow">
        <div class="mb-2">
          <div class="flex justify-between">
            <h4 class="font-medium">{{ lastRead.surah.name }}</h4>
            <span class="text-sm text-gray-500">
              Ayat {{ lastRead.ayat }}
            </span>
          </div>
          <p class="text-sm text-gray-500">{{ formatLastReadTime(lastRead.timestamp) }}</p>
        </div>
        <div class="mt-3 text-right">
          <p class="text-lg leading-relaxed font-arabic">{{ lastRead.surah.nameArab }}</p>
        </div>
        <NuxtLink 
          :to="`/quran/${lastRead.surah.number}#ayat-${lastRead.ayat}`" 
          class="mt-3 block w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium text-center"
        >
          Lanjutkan Membaca
        </NuxtLink>
      </div>
      <div v-else class="bg-white p-4 rounded-lg shadow text-center">
        <p class="text-gray-500">Belum ada surat yang dibaca</p>
        <NuxtLink to="/quran" class="mt-2 inline-block text-blue-600">
          Mulai Membaca Al-Quran
        </NuxtLink>
      </div>
    </div>

    <!-- Artikel Terbaru -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold">Artikel Terbaru</h3>
        <NuxtLink to="/blog" class="text-sm text-blue-600 flex items-center">
          Semua Artikel
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
      <!-- Skeleton loader for articles -->
      <div v-if="loadingArticles" class="space-y-3">
        <div v-for="i in 3" :key="i" class="bg-white p-3 rounded-lg shadow flex items-center space-x-3">
          <div class="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 animate-pulse"></div>
          <div class="flex-1">
            <div class="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
          </div>
        </div>
      </div>
      <div v-else-if="articlesError" class="p-4 bg-white rounded-lg shadow text-center">
        <p class="text-red-600 mb-2">{{ articlesError }}</p>
        <button @click="fetchLatestArticles" class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
          Coba lagi
        </button>
      </div>
      <div v-else class="space-y-3">
        <div v-for="article in displayedArticles" :key="article.id" class="bg-white p-3 rounded-lg shadow flex items-center space-x-3 relative">
          <div class="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0">
            <div class="w-16 h-16 flex-shrink-0 overflow-hidden bg-gray-200 rounded-md">
              <img 
                v-if="article.image" 
                :src="getImageUrl(article.image)" 
                :alt="article.title"
                class="w-full h-full object-cover" 
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="flex-1">
            <h4 class="font-medium">{{ article.title }}</h4>
            <p class="text-sm text-gray-600 mb-2 line-clamp-2 flex-grow">
              {{ truncateText(article.content, 100) }}
              <span v-if="(article.content || '').length > 100" class="text-gray-400">...</span>
            </p>
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-500">{{ formatArticleDate(article.publishedAt) }}</p>
              <NuxtLink :to="`/blog/${article.id}`" class="text-sm text-blue-600">Baca Selengkapnya</NuxtLink>
            </div>
          </div>
          
          <!-- Add bookmark icon with absolute positioning -->
          <div class="absolute top-2 right-2">
            <BlogBookmarkIcon
              :is-bookmarked="isBlogBookmarked(article.id)"
              :blog-id="article.id"
              :blog-title="article.title"
              :blog-excerpt="article.excerpt || truncateText(article.content, 100)"
              :blog-image="article.image"
              @update:bookmark="handleBookmarkUpdate"
            />
          </div>
        </div>
        <div v-if="latestArticles.length === 0" class="bg-white p-4 rounded-lg shadow text-center">
          <p class="text-gray-500">Belum ada artikel</p>
        </div>
        
        <!-- Conditional "Update Articles" button -->
        <div v-if="hasNewArticles" class="text-center pt-2">
          <button 
            @click="refreshArticles" 
            class="px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors duration-300"
          >
            <span v-if="refreshingArticles">
              <svg class="inline-block w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memperbarui...
            </span>
            <span v-else>Perbarui Artikel</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <ClientOnly>
    <LoginPromptModal :showDelay="2000" />
  </ClientOnly>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useUserDashboard } from '~/composables/useUserDashboard';
import { useAuthStore } from '~/stores/auth';
import LoginPromptModal from '~/components/LoginPromptModal.vue';
import BlogBookmarkIcon from '~/components/blog/BlogBookmarkIcon.vue';
import { useBookmarkService } from '~/composables/useBookmarkService';

// Auth store
const authStore = useAuthStore();
const route = useRoute();

const getUserName = () => {
  if (!authStore.user) return '';
  
  // Prioritaskan name jika ada, kalau tidak gunakan username
  return authStore.user.name || authStore.user.username || '';
};

watch(() => route.path, (newPath) => {
  // Jika pengguna kembali ke homepage
  if (newPath === '/') {
    // Muat ulang data terakhir dibaca
    useDashboardStore.refreshLastRead();
  }
});

// Menggunakan composable untuk mengakses state dan methods
const {
  // State
  todayPrayers,
  prayerLocation,
  loadingPrayer,
  prayerError,
  lastRead,
  latestArticles,
  loadingArticles,
  articlesError,
  
  // Actions
  fetchPrayerTimes,
  updateNextPrayer,
  fetchLatestArticles,
  refreshLatestArticles,
  initDashboard,
  
  // Helpers
  formatLastReadTime,
  formatArticleDate
} = useUserDashboard();

// Bookmark service
const bookmarkService = useBookmarkService();

// Computed property to get total bookmarks
const totalBookmarks = computed(() => {
  return bookmarkService.quranBookmarks.value.length + bookmarkService.blogBookmarks.value.length;
});

// State untuk modal pemilihan lokasi\
const locationPermissionGranted = ref(false);

// Add these new state variables
const refreshingArticles = ref(false);
const hasNewArticles = ref(false);
const lastArticleTimestamp = ref('');
const displayedArticles = computed(() => {
  // Return only the first 3 articles
  return latestArticles.value.slice(0, 3);
});

const isBlogBookmarked = (blogId) => {
  return bookmarkService.isBlogBookmarked(blogId);
};

const checkForNewArticles = async () => {
  try {
    // Gunakan store yang ada untuk mendapatkan artikel terbaru dari API
    // Tetapi tidak memperbarui UI utama sampai pengguna meminta
    const { apiFetch } = useApi();
    
    const { data } = await apiFetch('/blogs', {
      params: {
        limit: 1,
        status: 'published',
        sort: 'publishedAt:desc'
      }
    });
    
    if (data.value && data.value.success && data.value.data.blogs.length > 0) {
      const newestArticle = data.value.data.blogs[0];
      
      // Jika kita sudah memiliki artikel dan ada artikel baru dengan timestamp lebih baru
      if (latestArticles.value.length > 0 && 
          newestArticle.publishedAt && 
          lastArticleTimestamp.value && 
          new Date(newestArticle.publishedAt) > new Date(lastArticleTimestamp.value)) {
        hasNewArticles.value = true;
      } else {
        hasNewArticles.value = false;
      }
    }
  } catch (error) {
    console.error('Error checking for new articles:', error);
  }
};

// Current Date & Time
const currentDate = new Date().toLocaleDateString('id-ID', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
});

// Current time that updates every second
const currentTime = ref(new Date());
const formattedTime = computed(() => {
  return currentTime.value.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Timer for updating time
let timeInterval;

// Store koordinat lokasi
const latitude = ref(null);
const longitude = ref(null);

// Function to refresh/update articles without page reload
const refreshArticles = async () => {
  refreshingArticles.value = true;
  hasNewArticles.value = false;
  
  try {
    // Gunakan fungsi dari userDashboard store yang sudah ada
    await refreshLatestArticles();
    
    // Update timestamp artikel terbaru
    if (latestArticles.value.length > 0 && latestArticles.value[0].publishedAt) {
      lastArticleTimestamp.value = latestArticles.value[0].publishedAt;
    }
  } catch (error) {
    console.error('Error refreshing articles:', error);
  } finally {
    refreshingArticles.value = false;
  }
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  
  // Strip HTML tags if present
  const strippedText = text.replace(/<[^>]*>/g, '');
  
  // If the text is already shorter than maxLength, return it as is
  if (strippedText.length <= maxLength) {
    return strippedText;
  }
  
  // Find the last space before maxLength to avoid cutting words
  const lastSpace = strippedText.substring(0, maxLength).lastIndexOf(' ');
  
  // If no space found, just cut at maxLength
  return strippedText.substring(0, lastSpace > 0 ? lastSpace : maxLength);
};

// Fungsi untuk mendapatkan lokasi pengguna
function getGeoLocation() {
  if (!navigator.geolocation) {
    handleLocationError('Browser Anda tidak mendukung geolokasi');
    useDefaultLocation();
    return;
  }
  
  loadingPrayer.value = true;
  prayerError.value = null;
  
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };
  
  navigator.geolocation.getCurrentPosition(
    // Success callback
    async (position) => {
      try {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        
        // Simpan ke localStorage
        saveLocationToLocalStorage(latitude.value, longitude.value);
        
        // Fetch prayer times dengan koordinat baru
        await fetchPrayerTimes(latitude.value, longitude.value, true);
      } catch (error) {
        console.error('Error processing geolocation:', error);
        handleLocationError('Gagal memproses lokasi');
      }
    },
    // Error callback
    (error) => {
      console.error('Geolocation error:', error);
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          handleLocationError('Izin lokasi ditolak. Silakan aktifkan lokasi di browser Anda.');
          break;
        case error.POSITION_UNAVAILABLE:
          handleLocationError('Informasi lokasi tidak tersedia.');
          break;
        case error.TIMEOUT:
          handleLocationError('Permintaan lokasi timed out. Silakan coba lagi.');
          break;
        default:
          handleLocationError('Terjadi kesalahan saat mendapatkan lokasi.');
      }
      
      // Coba gunakan lokasi dari localStorage
      useStoredLocation();
    },
    options
  );
}

function handleLocationError(message) {
  prayerError.value = message;
  loadingPrayer.value = false;
}

function saveLocationToLocalStorage(lat, lng) {
  if (process.client) {
    try {
      const locationData = {
        latitude: lat,
        longitude: lng,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('prayer_location', JSON.stringify(locationData));
    } catch (error) {
      console.error('Error saving location to localStorage:', error);
    }
  }
}

function useStoredLocation() {
  try {
    if (!process.client) return;
    
    const storedLocation = localStorage.getItem('prayer_location');
    
    if (storedLocation) {
      const locationData = JSON.parse(storedLocation);
      
      // Cek apakah data lokasi masih valid (kurang dari 1 hari)
      const storedTime = new Date(locationData.timestamp).getTime();
      const currentTime = new Date().getTime();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      
      if (currentTime - storedTime < oneDayInMs) {
        // Gunakan lokasi tersimpan
        latitude.value = locationData.latitude;
        longitude.value = locationData.longitude;
        
        // Fetch prayer times dengan lokasi tersimpan
        fetchPrayerTimes(latitude.value, longitude.value);
        return;
      }
    }
    
    // Jika tidak ada lokasi tersimpan atau sudah kadaluarsa,
    // gunakan lokasi default
    useDefaultLocation();
  } catch (error) {
    console.error('Error using stored location:', error);
    useDefaultLocation();
  }
}

function useDefaultLocation() {
  // Gunakan lokasi default Bandung
  latitude.value = -6.9175;
  longitude.value = 107.6191;
  
  if (prayerLocation.value === null) {
    prayerLocation.value = {
      city: 'Bandung',
      country: 'Indonesia',
      latitude: latitude.value,
      longitude: longitude.value,
      usingDefault: true
    };
  }
  
  // Fetch prayer times dengan lokasi default
  fetchPrayerTimes(latitude.value, longitude.value);
}

// Tambahkan fungsi untuk menampilkan instruksi cara mengaktifkan lokasi
function showLocationEnableInstructions() {
  // Tambahkan logika untuk menampilkan instruksi sesuai dengan browser yang terdeteksi
  const isChrome = navigator.userAgent.includes('Chrome');
  const isFirefox = navigator.userAgent.includes('Firefox');
  const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
  
  let instructions = 'Untuk mengaktifkan izin lokasi: ';
  
  if (isChrome) {
    instructions += 'Klik ikon kunci/info di address bar → Izin Situs → Lokasi → Izinkan';
  } else if (isFirefox) {
    instructions += 'Klik ikon kunci di address bar → Izin → Akses Lokasi Anda → Izinkan';
  } else if (isSafari) {
    instructions += 'Buka Preferensi Safari → Privasi → Layanan Lokasi → Aktifkan';
  } else {
    instructions += 'Periksa pengaturan privasi browser Anda dan izinkan akses lokasi untuk situs ini';
  }
  
  // Menyimpan instruksi agar bisa ditampilkan di UI
  locationInstructions.value = instructions;
  
  console.log(instructions);
}

// Tambahkan state untuk menyimpan instruksi cara mengaktifkan lokasi
const locationInstructions = ref('');

// Update waktu saat ini setiap detik
onMounted(async () => {
  // Inisialisasi dashboard dari store
  initDashboard();

  if (navigator.permissions && navigator.permissions.query) {
    navigator.permissions.query({ name: 'geolocation' })
      .then((permissionStatus) => {
        // Update status izin
        locationPermissionGranted.value = permissionStatus.state === 'granted';
        
        // Tambahkan listener untuk perubahan status izin
        permissionStatus.onchange = () => {
          locationPermissionGranted.value = permissionStatus.state === 'granted';
        };
      })
      .catch((error) => {
        console.error('Error checking geolocation permission:', error);
        // Default to false if we can't check
        locationPermissionGranted.value = false;
      });
  }
  
  // Set up timer untuk update waktu saat ini
  timeInterval = setInterval(() => {
    currentTime.value = new Date();
    // Update next prayer setiap menit
    if (currentTime.value.getSeconds() === 0) {
      updateNextPrayer();
    }
  }, 1000);

  if (process.client && location.protocol !== 'https:' && location.hostname !== 'localhost') {
    console.warn('Geolocation memerlukan HTTPS. Aplikasi saat ini berjalan di ' + location.protocol);
    // Mungkin tambahkan peringatan untuk pengguna di sini
  }

  if (authStore.isAuthenticated) {
    await bookmarkService.loadBookmarks();
  }

  if (latestArticles.value.length > 0 && latestArticles.value[0].publishedAt) {
    lastArticleTimestamp.value = latestArticles.value[0].publishedAt;
  }

  if (process.client && 'setInterval' in window) {
    const checkInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        checkForNewArticles();
      }
    }, 300000); // 5 menit
    
    // Juga periksa ketika tab menjadi aktif lagi
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkForNewArticles();
      }
    });
    
    // Clean up interval when component is unmounted
    onUnmounted(() => {
      clearInterval(checkInterval);
    });
  }
});

onUnmounted(() => {
  // Clear timer saat komponen di-unmount
  clearInterval(timeInterval);

  
});
</script>