<template>
  <!-- Main Content -->
  <div>
      <!-- Greeting Card -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold">Assalamu'alaikum</h2>
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
          
          <NuxtLink to="/bookmark" class="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
              <div class="flex flex-col items-center">
                  <div class="w-12 h-12 mb-2 bg-amber-100 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                  </div>
                  <span class="font-medium">Bookmark</span>
              </div>
          </NuxtLink>
      </div>

      <!-- Waktu Sholat Hari Ini - Section with improved loading UI -->
      <div class="mb-6">
          <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-semibold">Jadwal Salat Hari Ini</h3>
              <NuxtLink to="/prayer-times" class="text-sm text-blue-600">Lihat Semua</NuxtLink>
          </div>
          <div class="bg-white rounded-lg shadow overflow-hidden">
              <!-- Header jadwal salat dengan waktu dan lokasi -->
              <div class="p-3 bg-blue-200 border-b border-gray-200">
                  <div class="flex justify-between items-center">
                      <div class="text-xl font-semibold text-blue-600">
                          {{ formattedTime }}
                      </div>
                      <div class="flex items-center text-blue-600 font-medium">
                          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span v-if="prayerLocation && !loadingPrayer">{{ prayerLocation.city }}, {{ prayerLocation.country }}</span>
                          <span v-else-if="loadingPrayer" class="animate-pulse">Memuat lokasi...</span>
                          <span v-else>Jakarta, Indonesia</span>
                      </div>
                  </div>
              </div>
              
              <!-- Kondisi loading dengan skeleton loader -->
              <div v-if="loadingPrayer" class="divide-y divide-gray-200">
                  <!-- Header kolom waktu sholat dan jam -->
                  <div class="flex justify-between p-3 bg-blue-100 font-medium text-gray-600">
                      <span>Waktu Sholat</span>
                      <span>Jam</span>
                  </div>
                  <!-- Skeleton untuk waktu sholat -->
                  <div v-for="i in 5" :key="i" class="flex justify-between p-3">
                      <div class="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
                      <div class="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
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
              <div v-else class="divide-y divide-gray-200">
                  <!-- Header kolom waktu sholat dan jam -->
                  <div class="flex justify-between p-3 bg-blue-100 font-medium text-gray-600">
                      <span>Waktu Sholat</span>
                      <span>Jam</span>
                  </div>
                  <div v-for="prayer in todayPrayers" :key="prayer.name" 
                      class="flex justify-between p-3 transition-colors duration-200"
                      :class="{ 'bg-blue-50': prayer.isNext }">
                      <div class="font-medium flex items-center">
                          <span>{{ prayer.name }}</span>
                          <span v-if="prayer.isNext" class="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                              Selanjutnya
                          </span>
                      </div>
                      <div class="flex items-center">
                          <span>{{ prayer.time }}</span>
                          <span v-if="prayer.timeRemaining" class="ml-2 text-sm text-blue-600">({{ prayer.timeRemaining }})</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <!-- Terakhir Dibaca - dengan UI loading yang diperbaiki -->
      <div class="mb-6">
          <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-semibold">Terakhir Dibaca</h3>
              <NuxtLink to="/quran" class="text-sm text-blue-600">Buka Al-Quran</NuxtLink>
          </div>
          <!-- Skeleton loader untuk Terakhir Dibaca -->
          <div v-if="loadingQuran" class="bg-white p-4 rounded-lg shadow">
              <div class="mb-2">
                  <div class="flex justify-between">
                      <div class="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
                      <div class="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                  <div class="h-4 bg-gray-200 rounded animate-pulse w-20 mt-1"></div>
              </div>
              <div class="mt-3 text-right">
                  <div class="h-7 bg-gray-200 rounded animate-pulse w-32 ml-auto"></div>
              </div>
              <div class="mt-3 h-10 bg-gray-200 rounded animate-pulse w-full"></div>
          </div>
          <div v-else-if="lastRead" class="bg-white p-4 rounded-lg shadow">
              <div class="mb-2">
                  <div class="flex justify-between">
                      <h4 class="font-medium">{{ lastRead.surah.name }}</h4>
                      <span class="text-sm text-gray-500">Ayat {{ lastRead.ayat }}</span>
                  </div>
                  <p class="text-sm text-gray-500">{{ formatLastReadTime(lastRead.timestamp) }}</p>
              </div>
              <div class="mt-3 text-right">
                  <p class="text-lg leading-relaxed font-arabic">{{ lastRead.surah.nameArab }}</p>
              </div>
              <NuxtLink :to="`/quran/${lastRead.surah.number}#ayat-${lastRead.ayat}`" class="mt-3 block w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium text-center">
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

      <!-- Artikel Terbaru - dengan UI loading yang diperbaiki -->
      <div class="mb-6">
          <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-semibold">Artikel Terbaru</h3>
              <NuxtLink to="/blog" class="text-sm text-blue-600">Semua Artikel</NuxtLink>
          </div>
          <!-- Skeleton loader untuk artikel -->
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
              <div v-for="article in latestArticles" :key="article.id" class="bg-white p-3 rounded-lg shadow flex items-center space-x-3">
                  <div class="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0">
                      <img v-if="article.thumbnail" :src="article.thumbnail" alt="Thumbnail" class="w-full h-full object-cover rounded-md" />
                      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                      </div>
                  </div>
                  <div>
                      <h4 class="font-medium">{{ article.title }}</h4>
                      <p class="text-sm text-gray-500 mt-1">{{ formatArticleDate(article.publishedAt) }}</p>
                  </div>
              </div>
              <div v-if="latestArticles.length === 0" class="bg-white p-4 rounded-lg shadow text-center">
                  <p class="text-gray-500">Belum ada artikel</p>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserDashboard } from '~/composables/useUserDashboard';

// Menggunakan composable untuk mengakses state dan methods
const {
  // State
  todayPrayers,
  prayerLocation,
  loadingPrayer,
  prayerError,
  lastRead,
  loadingQuran,
  quranError,
  latestArticles,
  loadingArticles,
  articlesError,
  dashboardInitialized,
  
  // Actions
  fetchPrayerTimes,
  updateNextPrayer,
  fetchLatestArticles,
  initDashboard,
  
  // Helpers
  formatLastReadTime,
  formatArticleDate,
  getCurrentPrayer,
  getNextPrayer
} = useUserDashboard();

// Current Date 
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

// Initialize on component mount
onMounted(() => {
  // Inisialisasi dashboard dari store jika belum diinisialisasi
  initDashboard();
  
  // Set interval untuk update waktu saat ini setiap detik
  const timeIntervalId = setInterval(() => {
      currentTime.value = new Date();
  }, 1000);
  
  // Clean up interval pada unmount
  onUnmounted(() => {
      clearInterval(timeIntervalId);
  });
});
</script>