<template>
  <div class="mb-6">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold">Terakhir Dibaca</h3>
      <NuxtLink to="/quran" class="text-sm text-blue-600">Buka Al-Quran</NuxtLink>
    </div>
    
    <div v-if="lastRead" class="bg-white p-4 rounded-lg shadow">
      <div class="mb-2">
        <div class="flex justify-between">
          <h4 class="font-medium">{{ lastRead.surah.name }}</h4>
          <span class="text-sm text-gray-500">
            Ayat {{ lastRead.ayat }}
          </span>
        </div>
        <p class="text-sm text-gray-500">{{ formattedTime }}</p>
      </div>
      <div class="mt-3 text-right">
        <!-- Gunakan lazy loading untuk font Arabic -->
        <p v-cloak class="text-lg leading-relaxed font-arabic">{{ lastRead.surah.nameArab }}</p>
      </div>
      <NuxtLink 
        :to="`/quran/${lastRead.surah.number}#ayat-${lastRead.ayat}`" 
        class="mt-3 block w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium text-center hover:bg-blue-700 transition-colors"
      >
        Lanjutkan Membaca
      </NuxtLink>
    </div>
    
    <div v-else class="bg-white p-4 rounded-lg shadow text-center">
      <p class="text-gray-500">Belum ada surat yang dibaca</p>
      <NuxtLink to="/quran" class="mt-2 inline-block text-blue-600 hover:underline">
        Mulai Membaca Al-Quran
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  lastRead: {
    type: Object,
    default: null
  }
});

// Pre-compute formatted time sekali saja, jangan gunakan fungsi di template
const formattedTime = computed(() => {
  if (!props.lastRead || !props.lastRead.timestamp) return '';
  
  // Implementasi formatting timestamp yang lebih efisien
  return formatTimeEfficient(props.lastRead.timestamp);
});

// Membuat cache untuk format timestamp
const timeFormatCache = new Map();

// Fungsi format waktu yang lebih efisien dengan caching
function formatTimeEfficient(timestamp) {
  // Gunakan cache jika ada
  if (timeFormatCache.has(timestamp)) {
    return timeFormatCache.get(timestamp);
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
  
  // Simpan ke cache
  timeFormatCache.set(timestamp, result);
  return result;
}

// Pre-load font Arabic saat komponen dimount jika ada lastRead
const fontLoaded = ref(false);

onMounted(() => {
  if (props.lastRead && props.lastRead.surah.nameArab) {
    // Lazy load font hanya jika benar-benar diperlukan
    if (!fontLoaded.value) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/css/arabic-font-subset.css';
      document.head.appendChild(link);
      fontLoaded.value = true;
    }
  }
});
</script>

<style scoped>
/* Prevensi FOUC (Flash of Unstyled Content) */
[v-cloak] {
  display: none;
}

/* Font akan dimuat dari CSS terpisah untuk optimasi */
.font-arabic {
  font-family: 'Scheherazade New', serif;
}
</style>