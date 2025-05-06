<template>
  <div>
    <!-- Header section -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold">Al-Quran</h2>
      <p class="text-gray-600">Baca, renungkan, dan implementasikan dalam bisnis</p>
    </div>

    <!-- Search bar -->
    <div class="mb-6">
      <div class="relative">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Cari surat..." 
          class="w-full p-3 bg-white rounded-lg shadow pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div class="absolute left-3 top-3 text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg mb-6">
      <p class="text-red-600">{{ error }}</p>
      <button @click="fetchSurahList" class="mt-2 text-blue-600">Coba lagi</button>
    </div>

    <!-- Surah list with pagination -->
    <div v-else>
      <!-- Display count info -->
      <div class="mb-4 text-sm text-gray-500">
        Menampilkan {{ paginatedSurahs.length }} dari {{ filteredSurahs.length }} surat
      </div>
      
      <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div v-for="surah in paginatedSurahs" :key="surah.number" class="border-b border-gray-200 last:border-b-0">
          <NuxtLink :to="`/quran/${surah.number}`" class="flex items-center p-4 hover:bg-gray-50">
            <div class="w-10 h-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span class="text-blue-600 font-medium">{{ surah.number }}</span>
            </div>
            <div class="flex-grow">
              <div class="flex justify-between">
                <h3 class="font-medium">{{ surah.name.transliteration.id }}</h3>
                <span class="text-right font-arabic text-lg">{{ surah.name.short }}</span>
              </div>
              <div class="flex justify-between mt-1">
                <p class="text-gray-500 text-sm">{{ surah.revelation.id }} • {{ surah.numberOfVerses }} Ayat</p>
                <p class="text-gray-500 text-sm">{{ surah.name.translation.id }}</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Pagination controls -->
      <div class="flex justify-between items-center mb-4">
        <!-- Page size selector -->
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500">Tampilkan:</span>
          <select 
            v-model="pageSize" 
            class="bg-white border border-gray-300 rounded-md p-1 text-sm"
            @change="currentPage = 1"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="15">15</option>
            <option :value="20">20</option>
          </select>
        </div>
        
        <!-- Pagination buttons -->
        <div class="flex space-x-2">
          <button 
            @click="currentPage = 1" 
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-1 rounded-md text-sm',
              currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'
            ]"
          >
            Awal
          </button>
          
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-1 rounded-md text-sm',
              currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'
            ]"
          >
            &laquo;
          </button>
          
          <!-- Page number display -->
          <div class="px-3 py-1 bg-white rounded-md text-sm">
            {{ currentPage }} / {{ totalPages }}
          </div>
          
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            :class="[
              'px-3 py-1 rounded-md text-sm',
              currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'
            ]"
          >
            &raquo;
          </button>
          
          <button 
            @click="currentPage = totalPages" 
            :disabled="currentPage === totalPages"
            :class="[
              'px-3 py-1 rounded-md text-sm',
              currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'
            ]"
          >
            Akhir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuranService } from '~/composables/useQuranService';

// Definisikan tipe untuk Surah
interface Surah {
  number: number;
  name: {
    short: string;
    transliteration: {
      id: string;
    };
    translation: {
      id: string;
    };
  };
  revelation: {
    id: string;
  };
  numberOfVerses: number;
}

// State
const surahs = ref<Surah[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const searchQuery = ref<string>('');
const currentPage = ref<number>(1);
const pageSize = ref<number>(10); // Default 10 surat per page

// Gunakan composable quran service
const quranService = useQuranService();

// Computed properties
const filteredSurahs = computed<Surah[]>(() => {
  if (!searchQuery.value) return surahs.value;
  
  const query = searchQuery.value.toLowerCase();
  return surahs.value.filter(surah => 
    surah.name.transliteration.id.toLowerCase().includes(query) ||
    surah.name.translation.id.toLowerCase().includes(query) ||
    surah.number.toString().includes(query)
  );
});

const totalPages = computed<number>(() => {
  return Math.ceil(filteredSurahs.value.length / pageSize.value) || 1;
});

const paginatedSurahs = computed<Surah[]>(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredSurahs.value.slice(startIndex, endIndex);
});

// Menambahkan watcher agar currentPage kembali ke 1 saat mencari
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Watch untuk memastikan currentPage tidak melebihi totalPages
watch(totalPages, (newValue) => {
  if (currentPage.value > newValue) {
    currentPage.value = newValue;
  }
});

// Fetch surah list dengan composable quranService
const fetchSurahList = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const { data, error: serviceError } = await quranService.fetchAllSurahs();
    
    if (serviceError) {
      throw new Error(serviceError);
    }
    
    if (data) {
      surahs.value = data;
    } else {
      error.value = 'Terjadi kesalahan saat memuat daftar surah';
    }
  } catch (err: unknown) {
    console.error('Error fetching surah list:', err);
    const errorMessage = err instanceof Error ? err.message : 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    error.value = errorMessage;
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchSurahList();
});
</script>