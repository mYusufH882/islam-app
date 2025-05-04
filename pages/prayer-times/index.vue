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
            <svg class="w-5 h-5 text-gray-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-sm">{{ location }}</span>
          </div>
        </div>
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
          <button 
              @click="getGeoLocation" 
              class="text-blue-600 flex items-center"
              :disabled="isLoading">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span v-if="!isLoading">Perbarui</span>
              <span v-else>Memperbarui...</span>
          </button>
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
              <div class="text-gray-600">{{ location }}</div>
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
              <div class="flex items-center">
              <span class="relative inline-block w-10 h-6 transition duration-200 ease-in-out bg-blue-600 rounded-full">
                  <span class="absolute right-1 top-1 w-4 h-4 transition-transform duration-200 ease-in-out bg-white rounded-full"></span>
              </span>
              </div>
          </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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

const location = ref('Jakarta, Indonesia');
const latitude = ref(-6.2088);
const longitude = ref(106.8456);

// Loading and error states
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);

// Prayer time variables
interface Prayer {
  name: string;
  time: string;
  isNext: boolean;
  timeRemaining?: string;
}

const todayPrayers = ref<Prayer[]>([
  { name: 'Subuh', time: '00:00', isNext: false },
  { name: 'Dzuhur', time: '00:00', isNext: false },
  { name: 'Ashar', time: '00:00', isNext: false },
  { name: 'Maghrib', time: '00:00', isNext: false },
  { name: 'Isya', time: '00:00', isNext: false }
]);

  // Current prayer time indicator
  const currentPrayerTimeId = ref<number | null>(null);

  // Weekly schedule variables
  interface WeekDay {
    value: number;
    short: string;
    date: number;
    full: string;
    isoDate: string;
  }

const weekDays = computed((): WeekDay[] => {
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
const weeklyPrayers = ref<Record<number, Prayer[]>>({});

  // Initialize weekly prayers object with empty arrays
  for (let i = 0; i < 7; i++) {
    weeklyPrayers.value[i] = [
      { name: 'Subuh', time: '00:00', isNext: false },
      { name: 'Dzuhur', time: '00:00', isNext: false },
      { name: 'Ashar', time: '00:00', isNext: false },
      { name: 'Maghrib', time: '00:00', isNext: false },
      { name: 'Isya', time: '00:00', isNext: false }
    ];
  }

// Format date as YYYY-MM-DD for API
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Update next prayer and calculate remaining time
function updateNextPrayer(): void {
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
  function determineCurrentPrayer(): void {
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

// Fetch prayer times for a specific date
async function fetchPrayerTimes(date: string, dayIndex: number): Promise<void> {
  try {
    const response = await prayerService.getPrayerTimesByDate(date, 
      latitude.value,
      longitude.value,
      3 // Umm al-Qura University, Makkah (default)
    );
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    // Perbaikan: Akses struktur data yang benar - nested data
    const timings = response.data?.data?.timings;
    
    // console.log(`Debug - Extracted timings for ${date}:`, timings);
    
    if (timings) {
      // Update weekly prayers for the specified day
      if (weeklyPrayers.value[dayIndex]) {
        const updatedPrayers = [
          { name: 'Subuh', time: timings.Fajr, isNext: false },
          { name: 'Dzuhur', time: timings.Dhuhr, isNext: false },
          { name: 'Ashar', time: timings.Asr, isNext: false },
          { name: 'Maghrib', time: timings.Maghrib, isNext: false },
          { name: 'Isya', time: timings.Isha, isNext: false }
        ];
        
        // console.log(`Debug - Updated prayers for day ${dayIndex}:`, updatedPrayers);
        
        weeklyPrayers.value[dayIndex] = updatedPrayers;
        
        // If this is today (dayIndex = 0), update today's prayers too
        if (dayIndex === 0) {
          todayPrayers.value = [...updatedPrayers]; // Menggunakan spread operator
          
          // console.log('Debug - Updated today prayers:', todayPrayers.value);
          
          // Calculate which prayer is next
          updateNextPrayer();
        }
      }
    } else {
      console.error(`No timings found for ${date}`, response);
    }
  } catch (err) {
    console.error('Error fetching prayer times:', err);
    errorMessage.value = 'Gagal memuat jadwal salat. Silakan coba lagi.';
  }
}

// Fetch all prayer times for the week
async function fetchAllPrayerTimes(): Promise<void> {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    // Fetch times for each day of the week
    for (let i = 0; i < weekDays.value.length; i++) {
      await fetchPrayerTimes(weekDays.value[i].isoDate, i);
    }
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching all prayer times:', error);
    errorMessage.value = 'Gagal memuat jadwal salat. Silakan coba lagi.';
    isLoading.value = false;
  }
}

// Get user's geolocation
function getGeoLocation(): void {
  if (navigator.geolocation) {
    isLoading.value = true;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        
        try {
          // Instead of using getLocationInfo, use a custom implementation 
          // to get location data from coordinates
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude.value}&longitude=${longitude.value}&localityLanguage=id`);
          const data = await response.json();
          
          if (data) {
            location.value = `${data.city || data.locality || 'Unknown'}, ${data.countryName}`;
          }
        } catch (error) {
          console.error('Error getting location name:', error);
          location.value = 'Lokasi Anda';
        }
        
        // Fetch prayer times for the new location
        await fetchAllPrayerTimes();
      },
      (error) => {
        console.error('Error getting geolocation:', error);
        isLoading.value = false;
        
        // Use default location since geolocation failed
        fetchAllPrayerTimes();
      }
    );
  } else {
    // Geolocation not supported, use default location
    fetchAllPrayerTimes();
  }
}

// Initialize on component mount
onMounted(() => {
  getGeoLocation();
});
</script>