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

        <!-- Waktu Sholat Hari Ini -->
        <div class="mb-6">
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-semibold">Jadwal Salat Hari Ini</h3>
                <NuxtLink to="/prayer-times" class="text-sm text-blue-600">Lihat Semua</NuxtLink>
            </div>
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <!-- Tambahkan header jadwal salat dengan waktu dan lokasi -->
                <div v-if="!loadingPrayerTimes && !prayerTimesError" class="p-3 bg-blue-200 border-b border-gray-200">
                    <div class="flex justify-between items-center">
                        <div class="text-xl font-semibold text-blue-600">
                            {{ formattedTime }}
                        </div>
                        <div class="flex items-center text-blue-600 font-medium">
                            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{{ location }}</span>
                        </div>
                    </div>
                </div>
                
                <div v-if="loadingPrayerTimes" class="p-4 text-center">
                    <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p class="text-gray-600">Memuat jadwal salat...</p>
                </div>
                <div v-else-if="prayerTimesError" class="p-4 text-center">
                    <p class="text-red-600">{{ prayerTimesError }}</p>
                    <button @click="fetchPrayerTimes" class="mt-2 text-blue-600">Coba lagi</button>
                </div>
                <div v-else class="divide-y divide-gray-200">
                    <!-- Header kolom waktu sholat dan jam -->
                    <div class="flex justify-between p-3 bg-blue-100 font-medium text-gray-600">
                        <span>Waktu Sholat</span>
                        <span>Jam</span>
                    </div>
                    <div v-for="prayer in todayPrayers" :key="prayer.name" 
                        class="flex justify-between p-3"
                        :class="{ 'bg-blue-50': prayer.isNext }">
                        <span class="font-medium">{{ prayer.name }}</span>
                        <span>{{ prayer.time }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Terakhir Dibaca -->
        <div class="mb-6">
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-semibold">Terakhir Dibaca</h3>
                <NuxtLink to="/quran" class="text-sm text-blue-600">Buka Al-Quran</NuxtLink>
            </div>
            <div v-if="lastRead" class="bg-white p-4 rounded-lg shadow">
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

        <!-- Artikel Terbaru -->
        <div class="mb-6">
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-semibold">Artikel Terbaru</h3>
                <NuxtLink to="/blog" class="text-sm text-blue-600">Semua Artikel</NuxtLink>
            </div>
            <div v-if="loadingArticles" class="p-4 bg-white rounded-lg shadow text-center">
                <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500 mx-auto mb-2"></div>
                <p class="text-gray-600">Memuat artikel...</p>
            </div>
            <div v-else-if="articlesError" class="p-4 bg-white rounded-lg shadow text-center">
                <p class="text-red-600">{{ articlesError }}</p>
                <button @click="fetchLatestArticles" class="mt-2 text-blue-600">Coba lagi</button>
            </div>
            <div v-else class="space-y-3">
                <div v-for="article in latestArticles" :key="article.id" class="bg-white p-3 rounded-lg shadow flex items-center space-x-3">
                    <div class="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0">
                        <img v-if="article.thumbnail" :src="article.thumbnail" alt="Thumbnail" class="w-full h-full object-cover rounded-md" />
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
import axios from 'axios';

// Current Date and Time
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

// Last Read Quran
const lastRead = ref(null);

// Prayer Times
const todayPrayers = ref([
    { name: 'Subuh', time: '00:00', isNext: false },
    { name: 'Dzuhur', time: '00:00', isNext: false },
    { name: 'Ashar', time: '00:00', isNext: false },
    { name: 'Maghrib', time: '00:00', isNext: false },
    { name: 'Isya', time: '00:00', isNext: false }
]);
const loadingPrayerTimes = ref(true);
const prayerTimesError = ref(null);

// Latest Articles
const latestArticles = ref([]);
const loadingArticles = ref(true);
const articlesError = ref(null);

// Location state for prayer times
const location = ref('Jakarta, Indonesia');
const latitude = ref(-6.2088);
const longitude = ref(106.8456);

// Format Helpers
const formatLastReadTime = (timestamp) => {
    if (!timestamp) return '';
    
    const lastReadDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - lastReadDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Hari ini';
    } else if (diffDays === 1) {
        return 'Kemarin';
    } else {
        return `${diffDays} hari yang lalu`;
    }
};

const formatArticleDate = (timestamp) => {
    if (!timestamp) return '';
    
    const articleDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - articleDate);
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

// Format date as YYYY-MM-DD for Prayer Times API
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Update next prayer and calculate remaining time
function updateNextPrayer() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    let nextPrayerIndex = -1;
    let minDifference = Infinity;
    
    todayPrayers.value.forEach((prayer, index) => {
        const [hour, minute] = prayer.time.split(':').map(Number);
        const prayerTimeInMinutes = hour * 60 + minute;
        const difference = prayerTimeInMinutes - currentTimeInMinutes;
        
        // Reset isNext flag
        prayer.isNext = false;
        
        if (difference > 0 && difference < minDifference) {
            minDifference = difference;
            nextPrayerIndex = index;
        }
    });
    
    // If we found a next prayer time
    if (nextPrayerIndex !== -1) {
        todayPrayers.value[nextPrayerIndex].isNext = true;
    }
}

// Fetch Today's Prayer Times
async function fetchPrayerTimes() {
    loadingPrayerTimes.value = true;
    prayerTimesError.value = null;
    
    try {
        // Get user's geolocation if available
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    latitude.value = position.coords.latitude;
                    longitude.value = position.coords.longitude;
                    
                    try {
                        // Get location name from coordinates
                        const geoResponse = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client`, {
                            params: {
                                latitude: latitude.value,
                                longitude: longitude.value,
                                localityLanguage: 'id'
                            }
                        });
                        
                        location.value = `${geoResponse.data.city || geoResponse.data.locality || 'Unknown'}, ${geoResponse.data.countryName}`;
                    } catch (error) {
                        console.error('Error getting location name:', error);
                    }
                    
                    await getPrayerTimesData();
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                    // Use default location since geolocation failed
                    getPrayerTimesData();
                }
            );
        } else {
            // Geolocation not supported, use default location
            await getPrayerTimesData();
        }
    } catch (error) {
        console.error('Error in fetchPrayerTimes:', error);
        prayerTimesError.value = 'Gagal memuat jadwal salat. Silakan coba lagi.';
        loadingPrayerTimes.value = false;
    }
}

async function getPrayerTimesData() {
    try {
        const today = new Date();
        const formattedDate = formatDate(today);
        
        const response = await axios.get(`https://api.aladhan.com/v1/timings/${formattedDate}`, {
            params: {
                latitude: latitude.value,
                longitude: longitude.value,
                method: 3 // Umm al-Qura University, Makkah (default)
            }
        });
        
        const timings = response.data.data.timings;
        
        todayPrayers.value = [
            { name: 'Subuh', time: timings.Fajr, isNext: false },
            { name: 'Dzuhur', time: timings.Dhuhr, isNext: false },
            { name: 'Ashar', time: timings.Asr, isNext: false },
            { name: 'Maghrib', time: timings.Maghrib, isNext: false },
            { name: 'Isya', time: timings.Isha, isNext: false }
        ];
        
        // Update which prayer is next
        updateNextPrayer();
        
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        prayerTimesError.value = 'Gagal memuat jadwal salat. Silakan coba lagi.';
    } finally {
        loadingPrayerTimes.value = false;
    }
}

// Fetch Latest Articles
// Note: This is a placeholder function that would normally fetch from your backend API
// Replace with your actual implementation
async function fetchLatestArticles() {
    loadingArticles.value = true;
    articlesError.value = null;
    
    try {
        // Contoh data artikel (gantilah dengan API call yang sebenarnya)
        // Dalam implementasi sebenarnya, Anda akan menggunakan axios untuk mengambil data dari API
        
        // Simulasi delay request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Data contoh
        latestArticles.value = [
            {
                id: 1,
                title: 'Pentingnya Salat Lima Waktu',
                thumbnail: null,
                publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 hari yang lalu
            },
            {
                id: 2,
                title: 'Keutamaan Membaca Al-Kahfi',
                thumbnail: null,
                publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 1 minggu yang lalu
            }
        ];
        
        /* 
        // Ini adalah contoh implementasi dengan axios jika Anda memiliki backend API
        const response = await axios.get('/api/articles', {
            params: {
                limit: 2,
                sort: 'publishedAt:desc'
            }
        });
        latestArticles.value = response.data;
        */
        
    } catch (error) {
        console.error('Error fetching articles:', error);
        articlesError.value = 'Gagal memuat artikel. Silakan coba lagi.';
    } finally {
        loadingArticles.value = false;
    }
}

// Load Last Read Quran
function loadLastRead() {
    const savedLastRead = localStorage.getItem('lastRead');
    if (savedLastRead) {
        lastRead.value = JSON.parse(savedLastRead);
    }
}

// Initialize on component mount
onMounted(() => {
    loadLastRead();
    fetchPrayerTimes();
    fetchLatestArticles();
    
    // Set interval to update current time every second and next prayer time every minute
    const timeIntervalId = setInterval(() => {
        currentTime.value = new Date();
    }, 1000);
    
    const prayerIntervalId = setInterval(() => {
        updateNextPrayer();
    }, 60000);
    
    // Clean up intervals on component unmount
    onUnmounted(() => {
        clearInterval(timeIntervalId);
        clearInterval(prayerIntervalId);
    });
});
</script>