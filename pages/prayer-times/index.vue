<template>
  <div>
    <!-- Location and Date Header -->
    <div class="mb-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-lg font-semibold">Jadwal Salat</h2>
            <p class="text-gray-600">{{ currentDate }}</p>
          </div>
          <div class="flex items-center bg-gray-100 rounded-lg p-2">
            <!-- Location indicator with status -->
            <div v-if="loadingPrayer" class="flex items-center text-gray-600">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-sm">Memuat...</span>
            </div>
            <div v-else class="flex items-center" :class="{'text-yellow-700': prayerLocation?.usingDefault, 'text-gray-600': !prayerLocation?.usingDefault}">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-sm">{{ prayerLocation ? (prayerLocation.city + ', ' + prayerLocation.country) : 'Lokasi Tidak Tersedia' }}</span>
              <span v-if="prayerLocation?.usingDefault" class="ml-1 text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">Default</span>
            </div>
          </div>
        </div>
        
        <!-- Location controls -->
        <div class="mt-3 flex justify-between items-center">
          <button 
            @click="showCitySelector = !showCitySelector" 
            class="text-xs md:text-sm text-blue-600 flex items-center"
          >
            {{ showCitySelector ? 'Tutup Pemilihan Kota' : 'Pilih Kota' }}
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="showCitySelector" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button 
            @click="getGeoLocation" 
            class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center"
            :disabled="loadingPrayer"
          >
            <svg v-if="loadingPrayer" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ loadingPrayer ? 'Memuat...' : 'Gunakan Lokasi Saat Ini' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Show location error message and instructions -->
    <div v-if="prayerError && locationInstructions" class="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
      {{ prayerError }}
      <div class="mt-2 text-xs">
        {{ locationInstructions }}
      </div>
    </div>

    <!-- Popular Cities Selector -->
    <div v-if="showCitySelector" class="mb-6 bg-white p-4 rounded-lg shadow">
      <h3 class="font-medium mb-3">Pilih Kota</h3>
      <div class="grid grid-cols-2 gap-2">
        <button 
          v-for="city in popularCities" 
          :key="city.name"
          @click="selectCity(city)"
          class="p-2 border rounded-md hover:bg-blue-50 text-left"
          :class="isSelectedCity(city) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
        >
          <div class="font-medium">{{ city.name }}</div>
          <div class="text-xs text-gray-500">{{ city.country }}</div>
        </button>
      </div>
    </div>

    <!-- Today's Prayer Card -->
    <div class="mb-6">
      <div v-if="isLoading" class="bg-white p-6 rounded-lg shadow text-center">
        <div class="animate-pulse flex flex-col items-center">
          <div class="w-12 h-12 mb-4 rounded-full bg-gray-200"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <p class="mt-4 text-gray-600">Memuat jadwal salat...</p>
      </div>
      
      <div v-else-if="errorMessage" class="bg-white p-6 rounded-lg shadow text-center">
        <div class="text-red-500 mb-2">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-700">{{ errorMessage }}</p>
        <button @click="fetchAllPrayerTimes" class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
          Coba Lagi
        </button>
      </div>
      
      <div v-else>
        <div class="bg-blue-600 text-white p-3">
          <h3 class="text-xl font-semibold">Hari Ini</h3>
        </div>
        <div class="bg-white shadow">
          <div v-for="(prayer, index) in todayPrayers" :key="prayer.name" 
              class="flex items-center p-4 border-b border-gray-100" 
              :class="{ 
                'bg-blue-50': prayer.isNext && index !== currentPrayerTimeId, 
                'bg-white': !prayer.isNext && index !== currentPrayerTimeId, 
                'bg-blue-100': index === currentPrayerTimeId 
              }">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-grow">
              <div class="flex justify-between items-center">
                <span class="font-medium">{{ prayer.name }}</span>
                <span>{{ prayer.time }}</span>
              </div>
              <div v-if="prayer.isNext" class="text-sm text-blue-600 mt-1">
                Waktu salat berikutnya
              </div>
              <div v-if="prayer.timeRemaining" class="text-xs text-gray-500 mt-1">
                {{ prayer.timeRemaining }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Schedule -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Jadwal Mingguan</h3>
      
      <!-- Day Navigation -->
      <div class="flex space-x-2 overflow-x-auto mb-4 pb-1">
        <button 
          v-for="day in weekDays" 
          :key="day.value" 
          @click="selectedDay = day.value"
          class="flex-shrink-0 flex flex-col items-center justify-center w-12 h-16 rounded-lg"
          :class="selectedDay === day.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'">
          <span class="text-xs mb-1">{{ day.short }}</span>
          <span class="text-lg font-semibold">{{ day.date }}</span>
        </button>
      </div>
      
      <!-- Selected Day Schedule -->
      <div v-if="isLoading" class="bg-white p-6 rounded-lg shadow">
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="animate-pulse flex justify-between items-center">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        </div>
      </div>
      
      <div v-else-if="errorMessage" class="bg-white p-6 rounded-lg shadow text-center">
        <p class="text-gray-700">{{ errorMessage }}</p>
      </div>
      
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div class="divide-y divide-gray-200">
          <div v-for="prayer in weeklyPrayers[selectedDay]" :key="prayer.name" class="flex justify-between p-3">
            <span class="font-medium">{{ prayer.name }}</span>
            <span>{{ prayer.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Card -->
    <div class="mb-6">
      <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Pengaturan</h3>
          </div>
          <div class="mt-3 space-y-3">
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Lokasi</span>
                </div>
                <div class="text-gray-600">{{ prayerLocation ? prayerLocation.city : 'Tidak diketahui' }}</div>
            </div>

            <div class="flex justify-between items-center">
                <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Metode Perhitungan</span>
                </div>
                <div class="text-gray-600">Kementerian Agama RI</div>
            </div>

            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>Notifikasi</span>
              </div>
              <button 
                @click="toggleNotification" 
                class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :class="notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200'"
                :disabled="!isNotificationSupported"
              >
                <span 
                  class="pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  :class="notificationsEnabled ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { usePrayerService } from '~/composables/usePrayerService';

// Prayer service
const prayerService = usePrayerService();

// State for date and location
const today = new Date();
const currentDate = ref(today.toLocaleDateString('id-ID', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}));

const location = ref('Bandung, Indonesia');
const latitude = ref(-6.9175);
const longitude = ref(107.6191);

// State for city selector
const showCitySelector = ref(false);
const prayerLocation = ref(null);
const locationInstructions = ref('');

// Loading and error states
const isLoading = ref(true);
const errorMessage = ref(null);
const loadingPrayer = ref(false);
const prayerError = ref(null);

// Prayer time variables
const todayPrayers = ref([
  { name: 'Subuh', time: '00:00', isNext: false },
  { name: 'Dzuhur', time: '00:00', isNext: false },
  { name: 'Ashar', time: '00:00', isNext: false },
  { name: 'Maghrib', time: '00:00', isNext: false },
  { name: 'Isya', time: '00:00', isNext: false }
]);

// Current prayer time indicator
const currentPrayerTimeId = ref(null);

// Weekly schedule variables
const weekDays = computed(() => {
  const days = [];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    days.push({
      value: i,
      short: dayNames[date.getDay()],
      date: date.getDate(),
      full: date.toLocaleDateString('id-ID', { weekday: 'long' }),
      isoDate: formatDate(date) // YYYY-MM-DD format for API
    });
  }

  return days;
});

const selectedDay = ref(0); // Default to today

// Initialize weekly prayers data structure
const weeklyPrayers = ref({});
for (let i = 0; i < 7; i++) {
  weeklyPrayers.value[i] = [
    { name: 'Subuh', time: '00:00' },
    { name: 'Dzuhur', time: '00:00' },
    { name: 'Ashar', time: '00:00' },
    { name: 'Maghrib', time: '00:00' },
    { name: 'Isya', time: '00:00' }
  ];
}

// Daftar kota populer dengan koordinat
const popularCities = [
  { name: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456 },
  { name: 'Bandung', country: 'Indonesia', latitude: -6.9175, longitude: 107.6191 },
  { name: 'Surabaya', country: 'Indonesia', latitude: -7.2575, longitude: 112.7521 },
  { name: 'Yogyakarta', country: 'Indonesia', latitude: -7.7971, longitude: 110.3688 },
  { name: 'Semarang', country: 'Indonesia', latitude: -6.9932, longitude: 110.4203 },
  { name: 'Medan', country: 'Indonesia', latitude: 3.5896, longitude: 98.6731 },
  { name: 'Makassar', country: 'Indonesia', latitude: -5.1477, longitude: 119.4327 },
  { name: 'Palembang', country: 'Indonesia', latitude: -2.9761, longitude: 104.7754 }
];

// Format date as YYYY-MM-DD for API
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Check if city is selected
const isSelectedCity = (city) => {
  if (!prayerLocation.value) return false;
  
  return Math.abs(prayerLocation.value.latitude - city.latitude) < 0.01 &&
         Math.abs(prayerLocation.value.longitude - city.longitude) < 0.01;
};

// Select a city from popular cities list
const selectCity = (city) => {
  latitude.value = city.latitude;
  longitude.value = city.longitude;
  
  // Update lokasi
  prayerLocation.value = {
    city: city.name,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude,
    usingDefault: false
  };
  
  // Fetch prayer times
  fetchPrayerTimes(latitude.value, longitude.value, true);
  
  // Hide city selector
  showCitySelector.value = false;
};

// Show browser-specific location enable instructions
const showLocationEnableInstructions = () => {
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
  
  locationInstructions.value = instructions;
};

// Save location to localStorage
const saveLocationToLocalStorage = (lat, lng, cityName = null, countryName = null) => {
  if (process.client) {
    try {
      // Simpan informasi lebih lengkap
      const locationData = {
        latitude: lat,
        longitude: lng,
        city: cityName || (prayerLocation.value?.city || 'Jakarta'),
        country: countryName || (prayerLocation.value?.country || 'Indonesia'),
        timestamp: new Date().toISOString(),
        usingDefault: false // Karena ini lokasi yang dipilih/dideteksi, bukan default
      };
      
      localStorage.setItem('prayer_location', JSON.stringify(locationData));
      console.log('Lokasi berhasil disimpan ke localStorage:', locationData);
    } catch (error) {
      console.error('Error saving location to localStorage:', error);
    }
  }
};

// Use stored location
const useStoredLocation = () => {
  try {
    if (!process.client) return false;
    
    const storedLocationString = localStorage.getItem('prayer_location');
    
    if (storedLocationString) {
      const locationData = JSON.parse(storedLocationString);
      
      // Cek apakah data lokasi masih valid (kurang dari 7 hari)
      const storedTime = new Date(locationData.timestamp).getTime();
      const currentTime = new Date().getTime();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      
      if (currentTime - storedTime < sevenDaysInMs) {
        // Gunakan lokasi tersimpan
        latitude.value = locationData.latitude;
        longitude.value = locationData.longitude;
        
        // Juga set data lokasi lengkap
        prayerLocation.value = {
          city: locationData.city || 'Jakarta',
          country: locationData.country || 'Indonesia',
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          usingDefault: locationData.usingDefault || false
        };
        
        console.log('Menggunakan lokasi dari localStorage:', prayerLocation.value);
        
        // Fetch prayer times dengan lokasi tersimpan
        fetchPrayerTimes(latitude.value, longitude.value);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error using stored location:', error);
    return false;
  }
};

// Use default location (Bandung)
const useDefaultLocation = () => {
  // Default to Jakarta
  latitude.value = -6.2088;
  longitude.value = 106.8456;
  
  prayerLocation.value = {
    city: 'Jakarta',
    country: 'Indonesia',
    latitude: latitude.value,
    longitude: longitude.value,
    usingDefault: true
  };
  
  // Fetch prayer times
  fetchPrayerTimes(latitude.value, longitude.value);
};

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
    prayer.timeRemaining = '';
    
    if (difference > 0 && difference < minDifference) {
      minDifference = difference;
      nextPrayerIndex = index;
    }
  });

  // If we found a next prayer time
  if (nextPrayerIndex !== -1) {
    const prayer = todayPrayers.value[nextPrayerIndex];
    prayer.isNext = true;
    
    const hours = Math.floor(minDifference / 60);
    const minutes = minDifference % 60;
    
    let remainingText = '';
    if (hours > 0) {
      remainingText += `${hours} jam `;
    }
    remainingText += `${minutes} menit lagi`;
    
    prayer.timeRemaining = remainingText;
  }

  // Determine current prayer time
  determineCurrentPrayer();
}

// Add function to determine current prayer time
function determineCurrentPrayer() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  let lastPassedPrayerIndex = -1;

  // Check which prayer time has most recently passed
  todayPrayers.value.forEach((prayer, index) => {
    const [hour, minute] = prayer.time.split(':').map(Number);
    const prayerTimeInMinutes = hour * 60 + minute;
    
    if (prayerTimeInMinutes <= currentTimeInMinutes) {
      lastPassedPrayerIndex = index;
    }
  });

  // If any prayer time has passed today, set it as current
  if (lastPassedPrayerIndex !== -1) {
    currentPrayerTimeId.value = lastPassedPrayerIndex;
  } else {
    // If no prayer time has passed today, set to null
    currentPrayerTimeId.value = null;
  }
}

// Fetch prayer times
async function fetchPrayerTimes(lat, lng, forceRefresh = false) {
  loadingPrayer.value = true;
  prayerError.value = null;
  
  try {
    const response = await prayerService.getTodayPrayerTimes(lat, lng, 3, forceRefresh);
    
    // Periksa apakah respons valid
    if (!response.data) {
      throw new Error('Gagal memuat jadwal salat: Data tidak tersedia');
    }
    
    const responseData = response.data;
    
    if (responseData.success && responseData.data && responseData.data.prayerTimes) {
      // Ekstrak data prayer times
      const prayerTimesData = responseData.data.prayerTimes;
      
      // Ekstrak data lokasi
      const locationData = responseData.data.location;
      
      // Pastikan timings ada
      if (prayerTimesData.timings) {
        // Update prayer times
        todayPrayers.value = [
        { name: 'Subuh', time: prayerTimesData.timings.Fajr, isNext: false },
          { name: 'Dzuhur', time: prayerTimesData.timings.Dhuhr, isNext: false },
          { name: 'Ashar', time: prayerTimesData.timings.Asr, isNext: false },
          { name: 'Maghrib', time: prayerTimesData.timings.Maghrib, isNext: false },
          { name: 'Isya', time: prayerTimesData.timings.Isha, isNext: false }
        ];
        
        // Calculate which prayer is next
        updateNextPrayer();
        
        // Update location data
        if (locationData) {
          // If location "Unknown", use data from timezone or default to Jakarta
          let city = locationData.city;
          let country = locationData.country;
          
          // Determine if this is the default location
          const isDefaultLocation = Math.abs(lat - (-6.2088)) < 0.01 && 
                                 Math.abs(lng - 106.8456) < 0.01;
          
          // If this is default coordinates or city/country Unknown
          if (isDefaultLocation || city === "Unknown" || country === "Unknown") {
            if (isDefaultLocation) {
              city = 'Bandung';
              country = 'Indonesia';
            } 
            else if (prayerTimesData.meta && prayerTimesData.meta.timezone) {
              const timezoneParts = prayerTimesData.meta.timezone.split('/');
              if (timezoneParts.length > 1) {
                city = timezoneParts[1].replace('_', ' ');
                country = "Indonesia";
              } else {
                city = 'Bandung';
                country = 'Indonesia';
              }
            } else {
              city = 'Bandung';
              country = 'Indonesia';
            }
          }
          
          prayerLocation.value = {
            city: city,
            country: country,
            latitude: locationData.latitude || lat,
            longitude: locationData.longitude || lng,
            usingDefault: isDefaultLocation
          };
        } else {
          // Fallback to default
          prayerLocation.value = {
            city: 'Bandung',
            country: 'Indonesia',
            latitude: lat,
            longitude: lng,
            usingDefault: Math.abs(lat - (-6.9175)) < 0.01 && Math.abs(lng - 107.6191) < 0.01
          };
        }
        
        // Update weekly schedule
        updateWeeklySchedule(prayerTimesData);
        
        // Reset errors
        isLoading.value = false;
        errorMessage.value = null;
      } else {
        throw new Error('Waktu salat tidak ditemukan dalam data');
      }
    } else {
      throw new Error('Format data jadwal salat tidak valid');
    }
  } catch (error) {
    console.error('Error in fetchPrayerTimes:', error);
    prayerError.value = error.message || 'Gagal memuat jadwal salat dari koordinat';
    isLoading.value = false;
    errorMessage.value = 'Gagal memuat jadwal salat. Silakan coba lagi.';
  } finally {
    loadingPrayer.value = false;
  }
}

// Update weekly schedule with today's data
function updateWeeklySchedule(prayerTimesData) {
  if (!prayerTimesData || !prayerTimesData.timings) return;
  
  // Update first day (today) with the fetched data
  weeklyPrayers.value[0] = [
    { name: 'Subuh', time: prayerTimesData.timings.Fajr },
    { name: 'Dzuhur', time: prayerTimesData.timings.Dhuhr },
    { name: 'Ashar', time: prayerTimesData.timings.Asr },
    { name: 'Maghrib', time: prayerTimesData.timings.Maghrib },
    { name: 'Isya', time: prayerTimesData.timings.Isha }
  ];
  
  // For demonstration purposes, add slight variations for other days
  // In a real app, you would fetch data for each day separately
  for (let i = 1; i < 7; i++) {
    weeklyPrayers.value[i] = [
      { name: 'Subuh', time: adjustTime(prayerTimesData.timings.Fajr, i) },
      { name: 'Dzuhur', time: adjustTime(prayerTimesData.timings.Dhuhr, i) },
      { name: 'Ashar', time: adjustTime(prayerTimesData.timings.Asr, i) },
      { name: 'Maghrib', time: adjustTime(prayerTimesData.timings.Maghrib, i) },
      { name: 'Isya', time: adjustTime(prayerTimesData.timings.Isha, i) }
    ];
  }
}

// Helper to slightly adjust prayer times for demonstration
function adjustTime(timeStr, dayOffset) {
  const [hour, minute] = timeStr.split(':').map(Number);
  let newMinute = minute + (dayOffset % 3);
  
  if (newMinute >= 60) {
    newMinute = newMinute - 60;
  }
  
  return `${hour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
}

// Fetch all prayer times for the week
async function fetchAllPrayerTimes() {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    // Check if we have stored location first
    if (!useStoredLocation()) {
      // If no stored location, get geolocation
      getGeoLocation();
    }
  } catch (error) {
    console.error('Error fetching all prayer times:', error);
    errorMessage.value = 'Gagal memuat jadwal salat. Silakan coba lagi.';
    isLoading.value = false;
  }
}

// Get user's geolocation
function getGeoLocation() {
  if (!navigator.geolocation) {
    prayerError.value = 'Browser tidak mendukung geolokasi';
    useDefaultLocation();
    return;
  }
  
  loadingPrayer.value = true;
  
  navigator.geolocation.getCurrentPosition(
    // Success callback
    async (position) => {
      try {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        
        // Langsung ambil jadwal sholat tanpa menyimpan ke localStorage
        await fetchPrayerTimes(latitude.value, longitude.value, true);
      } catch (error) {
        console.error('Error memproses lokasi:', error);
        prayerError.value = 'Gagal memproses lokasi';
      } finally {
        loadingPrayer.value = false;
      }
    },
    // Error callback
    (error) => {
      console.error('Geolocation error:', error);
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          prayerError.value = 'Izin lokasi ditolak.';
          showLocationEnableInstructions();
          break;
        case error.POSITION_UNAVAILABLE:
          prayerError.value = 'Informasi lokasi tidak tersedia.';
          break;
        case error.TIMEOUT:
          prayerError.value = 'Permintaan lokasi timed out. Silakan coba lagi.';
          break;
        default:
          prayerError.value = 'Terjadi kesalahan saat mendapatkan lokasi.';
      }
      
      // Gunakan lokasi default saat error
      useDefaultLocation();
      loadingPrayer.value = false;
    }
  );
}

// Cek apakah notifikasi didukung oleh browser
const isNotificationSupported = computed(() => {
  return process.client && 'Notification' in window;
});

// State untuk status notifikasi
const notificationsEnabled = ref(false);

// Toggle notifikasi on/off
const toggleNotification = async () => {
  if (!isNotificationSupported.value) return;
  
  if (!notificationsEnabled.value) {
    // Minta izin notifikasi
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      notificationsEnabled.value = true;
      saveNotificationSetting(true);
      
      // Jadwalkan notifikasi untuk waktu salat berikutnya
      scheduleNotifications();
    } else {
      notificationsEnabled.value = false;
      saveNotificationSetting(false);
    }
  } else {
    // Matikan notifikasi
    notificationsEnabled.value = false;
    saveNotificationSetting(false);
  }
};

// Simpan pengaturan notifikasi
const saveNotificationSetting = (enabled) => {
  if (process.client) {
    localStorage.setItem('prayer_notifications_enabled', enabled ? 'true' : 'false');
  }
};

// Muat pengaturan notifikasi
const loadNotificationSetting = () => {
  if (process.client) {
    const setting = localStorage.getItem('prayer_notifications_enabled');
    notificationsEnabled.value = setting === 'true';
  }
};

// Tampilkan notifikasi untuk waktu salat
const showPrayerNotification = (prayerName, prayerTime) => {
  if (!isNotificationSupported.value || !notificationsEnabled.value) return;
  
  const notification = new Notification('Waktu Salat', {
    body: `Waktu salat ${prayerName} (${prayerTime}) telah tiba.`,
    icon: '/icon-192x192.png' // Sesuaikan dengan path icon aplikasi Anda
  });
  
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
};

// Jadwalkan notifikasi untuk waktu salat hari ini
const scheduleNotifications = () => {
  if (!isNotificationSupported.value || !notificationsEnabled.value) return;
  
  todayPrayers.value.forEach(prayer => {
    const [hour, minute] = prayer.time.split(':').map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hour, minute, 0, 0);
    
    const now = new Date();
    const timeUntilPrayer = prayerTime.getTime() - now.getTime();
    
    // Hanya jadwalkan jika waktu salat belum lewat
    if (timeUntilPrayer > 0) {
      setTimeout(() => {
        showPrayerNotification(prayer.name, prayer.time);
      }, timeUntilPrayer);
    }
  });
};

// Watch untuk mengamati perubahan pengaturan notifikasi
watch(notificationsEnabled, (newValue) => {
  if (newValue) {
    scheduleNotifications();
  }
});

// Watch untuk mengamati perubahan jadwal salat
watch(todayPrayers, () => {
  if (notificationsEnabled.value) {
    scheduleNotifications();
  }
}, { deep: true });

// Initialize on component mount
onMounted(() => {
  if (process.client) {
    // Langsung meminta lokasi pengguna tanpa memeriksa localStorage
    getGeoLocation();
    
    // Set interval untuk update waktu sholat selanjutnya
    const interval = setInterval(() => {
      updateNextPrayer();
    }, 60000); // Setiap menit
    
    // Cleanup saat komponen di-unmount
    onUnmounted(() => {
      clearInterval(interval);
    });
  }
});
</script>
