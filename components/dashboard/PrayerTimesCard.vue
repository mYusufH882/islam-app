<template>
  <div class="mb-6">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold">Jadwal Salat Hari Ini</h3>
      <NuxtLink to="/prayer-times" class="text-sm text-blue-600">Lihat Semua</NuxtLink>
    </div>
    
    <div v-if="error && locationInstructions" class="mt-2 p-3 bg-yellow-50 text-yellow-800 rounded-md text-xs">
      {{ locationInstructions }}
    </div>
    
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Header dengan lokasi - gunakan v-once untuk konten statis -->
      <div class="p-3 bg-blue-200 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <div class="text-xl font-semibold text-blue-600">
            {{ formattedTime }}
          </div>
          <div class="flex items-center">
            <!-- Status lokasi -->
            <div v-if="loading" class="flex items-center text-blue-700">
              <svg class="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-sm">Memuat...</span>
            </div>
            
            <div v-else-if="location" class="flex items-center" :class="{'text-yellow-700': location.usingDefault, 'text-blue-700': !location.usingDefault}">
              <svg v-once class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-sm">{{ locationText }}</span>
              <span v-if="location.usingDefault" class="ml-1 text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">Default</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Kondisi loading -->
      <div v-if="loading" class="divide-y divide-gray-200">
        <div v-once class="flex justify-between p-3 bg-blue-50 font-medium text-gray-600">
          <span>Waktu Sholat</span>
          <span>Jam</span>
        </div>
        <!-- Skeleton loader -->
        <div v-for="i in 5" :key="i" class="flex justify-between p-3">
          <div class="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      
      <!-- Kondisi error -->
      <div v-else-if="error" class="p-4 text-center">
        <div class="text-red-600 mb-2">{{ error }}</div>
        <button @click="$emit('refresh')" class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
          Coba lagi
        </button>
      </div>
      
      <!-- Kondisi data berhasil dimuat - optimasi dengan v-memo -->
      <div v-else-if="prayers && prayers.length > 0" class="divide-y divide-gray-200">
        <div v-once class="flex justify-between p-3 bg-blue-50 font-medium text-gray-600">
          <span>Waktu Sholat</span>
          <span>Jam</span>
        </div>
        <div v-for="prayer in optimizedPrayers" :key="prayer.name" 
          class="flex justify-between p-3 transition-colors duration-200"
          :class="{ 'bg-blue-50': prayer.isNext }"
        >
          <div class="font-medium flex items-center">
            <span v-once>{{ prayer.name }}</span>
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
        <button @click="$emit('refresh')" class="ml-1 text-blue-600 underline">Muat ulang</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  
  const props = defineProps({
    prayers: {
      type: Array,
      default: () => []
    },
    location: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    }
  });
  
  defineEmits(['refresh']);
  
  // Current time that updates every minute instead of every second
  const currentTime = ref(new Date());
  
  // Memoize formatted time
  const formattedTime = computed(() => {
    return currentTime.value.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  });
  
  // Memoize location text to prevent re-renders
  const locationText = computed(() => {
    if (!props.location) return '';
    return `${props.location.city}, ${props.location.country}`;
  });
  
  // Optimize prayers dengan memoization untuk mengurangi re-renders
  const optimizedPrayers = computed(() => {
    return props.prayers;
  });
  
  // Timer untuk update waktu - gunakan intersectionObserver untuk menghemat resources
  let timeInterval;
  let observer;
  
  onMounted(() => {
    // Gunakan Intersection Observer untuk hanya update waktu ketika komponen terlihat
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        const isVisible = entries[0].isIntersecting;
        if (isVisible) {
          // Komponen terlihat, update waktu
          if (!timeInterval) {
            // Update time every minute instead of every second
            timeInterval = setInterval(() => {
              currentTime.value = new Date();
            }, 60000); // Every minute
          }
        } else {
          // Komponen tidak terlihat, hentikan update untuk menghemat resources
          if (timeInterval) {
            clearInterval(timeInterval);
            timeInterval = null;
          }
        }
      });
      
      // Observe komponen
      const element = document.querySelector('.prayer-times-component');
      if (element) {
        observer.observe(element);
      }
    } else {
      // Fallback jika IntersectionObserver tidak didukung
      timeInterval = setInterval(() => {
        currentTime.value = new Date();
      }, 60000);
    }
  });
  
  onUnmounted(() => {
    // Bersihkan timer dan observer
    if (timeInterval) {
      clearInterval(timeInterval);
    }
    
    if (observer) {
      observer.disconnect();
    }
  });
  
  // Default instructions for enabling location - computed memoized
  const locationInstructions = computed(() => {
    if (!props.error) return '';
    
    // Kode menentukan browser
    const browser = process.client
      ? navigator.userAgent.includes('Chrome') 
        ? 'Chrome'
        : navigator.userAgent.includes('Firefox')
          ? 'Firefox' 
          : navigator.userAgent.includes('Safari') 
            ? 'Safari' 
            : 'browser'
      : 'browser';
      
    // Petunjuk statis
    const instructions = {
      'Chrome': 'Klik ikon kunci di address bar → Izin Situs → Lokasi → Izinkan',
      'Firefox': 'Klik ikon kunci di address bar → Izin → Akses Lokasi Anda → Izinkan',
      'Safari': 'Buka Preferensi Safari → Privasi → Layanan Lokasi → Aktifkan',
      'browser': 'Periksa pengaturan privasi browser Anda'
    };
    
    return instructions[browser] || instructions.browser;
  });
</script>