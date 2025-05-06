<template>
  <div>
    <!-- Back button and navigation -->
    <div class="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <NuxtLink to="/quran" class="inline-flex items-center bg-white px-3 py-1.5 rounded-md shadow hover:bg-blue-50 text-blue-600">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </NuxtLink>

      <!-- Surah Navigation -->
      <div class="flex w-full sm:w-auto justify-between sm:justify-end gap-2">
        <NuxtLink 
          v-if="hasPrevSurah" 
          :to="`/quran/${prevSurahNumber}`"
          class="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 py-2 bg-blue-50 rounded-md shadow-sm text-blue-600 hover:bg-blue-100 active:bg-blue-200 transition-colors"
          aria-label="Surah sebelumnya"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <div class="flex flex-col items-start leading-tight">
            <span class="text-xs text-blue-500">Surah Sebelumnya</span>
            <span class="font-medium">{{ prevSurahName || 'Surah ' + prevSurahNumber }}</span>
          </div>
        </NuxtLink>
        
        <NuxtLink 
          v-if="hasNextSurah" 
          :to="`/quran/${nextSurahNumber}`"
          class="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 py-2 bg-blue-50 rounded-md shadow-sm text-blue-600 hover:bg-blue-100 active:bg-blue-200 transition-colors"
          aria-label="Surah berikutnya"
        >
          <div class="flex flex-col items-end leading-tight">
            <span class="text-xs text-blue-500">Surah Berikutnya</span>
            <span class="font-medium">{{ nextSurahName || 'Surah ' + nextSurahNumber }}</span>
          </div>
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg mb-6">
      <p class="text-red-600">{{ error }}</p>
      <button @click="fetchSurahDetail" class="mt-2 text-blue-600">Coba lagi</button>
    </div>

    <!-- Surah detail -->
    <div v-else>
      <!-- Surah header -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow text-center">
        <h1 class="text-2xl font-semibold">{{ surah.name?.transliteration?.id }}</h1>
        <p class="text-gray-600">{{ surah.name?.translation?.id }}</p>
        <p class="text-xl font-arabic mt-2">{{ surah.name?.short }}</p>
        
        <div class="mt-3 flex justify-center space-x-4 text-sm text-gray-500">
          <span>{{ surah.revelation?.id || '' }}</span>
          <span>•</span>
          <span>{{ surah.numberOfVerses || 0 }} Ayat</span>
        </div>

        <div v-if="surah.preBismillah" class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-xl font-arabic text-right leading-loose">{{ surah.preBismillah.text.arab }}</p>
          <p class="text-sm text-gray-600 mt-2">{{ surah.preBismillah.translation.id }}</p>
        </div>
      </div>
      
      <!-- Ayat pagination indicator -->
      <div class="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-3 rounded-lg shadow">
        <div class="text-sm text-gray-600 w-full sm:w-auto">
          Menampilkan ayat {{ startAyat }}-{{ endAyat }} dari {{ totalAyat }} ayat
        </div>
        
        <!-- Ayat pagination controls -->
        <div class="flex items-center space-x-1 w-full sm:w-auto justify-start sm:justify-end">
          <button 
            @click="goToPage(1)"
            :disabled="currentPage === 1"
            :class="[
              'px-2 py-1 rounded text-xs sm:text-sm',
              currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 active:bg-blue-100'
            ]"
            aria-label="Halaman awal"
          >
            <span class="hidden xs:inline">Awal</span>
            <span class="xs:hidden">«</span>
          </button>
          
          <button 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'px-2 py-1 rounded text-xs sm:text-sm',
              currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 active:bg-blue-100'
            ]"
            aria-label="Halaman sebelumnya"
          >
            <span class="hidden xs:inline">&laquo;</span>
            <span class="xs:hidden">‹</span>
          </button>
          
          <span class="px-2 py-1 text-xs sm:text-sm min-w-[50px] text-center">
            {{ currentPage }}/{{ totalPages }}
          </span>
          
          <button 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="[
              'px-2 py-1 rounded text-xs sm:text-sm',
              currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 active:bg-blue-100'
            ]"
            aria-label="Halaman berikutnya"
          >
            <span class="hidden xs:inline">&raquo;</span>
            <span class="xs:hidden">›</span>
          </button>
          
          <button 
            @click="goToPage(totalPages)"
            :disabled="currentPage === totalPages"
            :class="[
              'px-2 py-1 rounded text-xs sm:text-sm',
              currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 active:bg-blue-100'
            ]"
            aria-label="Halaman akhir"
          >
            <span class="hidden xs:inline">Akhir</span>
            <span class="xs:hidden">»</span>
          </button>
        </div>
      </div>

      <!-- Ayat list with pagination -->
      <div class="space-y-4 mb-6">
        <div 
          v-for="verse in paginatedVerses" 
          :key="verse.number.inSurah"
          class="bg-white p-4 rounded-lg shadow"
          :id="`ayat-${verse.number.inSurah}`"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600 font-medium">{{ verse.number.inSurah }}</span>
            </div>
            <div class="flex space-x-1">
              <button 
                @click="bookmarkVerse(verse)" 
                class="p-1.5 sm:p-2 rounded-full hover:bg-gray-100"
                title="Bookmark ayat ini"
                aria-label="Bookmark ayat ini"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              <button 
                @click="shareVerse(verse)" 
                class="p-1.5 sm:p-2 rounded-full hover:bg-gray-100"
                title="Bagikan ayat ini"
                aria-label="Bagikan ayat ini"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
          <p class="text-xl font-arabic text-right leading-loose mb-4">{{ verse.text.arab }}</p>
          <p class="text-gray-700 mb-2 text-sm italic">{{ verse.text.transliteration.en }}</p>
          <p class="text-gray-800">{{ verse.translation.id }}</p>
          
        </div>
      </div>
      
      <!-- Bottom ayat pagination controls -->
      <div class="mb-6 bg-white p-3 rounded-lg shadow flex justify-center">
        <div class="flex items-center space-x-2">
          <button 
            @click="goToPage(1)"
            :disabled="currentPage === 1"
            :class="[
              'w-9 h-9 flex items-center justify-center rounded-full text-xs',
              currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50 active:bg-blue-100'
            ]"
            aria-label="Halaman awal"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'w-9 h-9 flex items-center justify-center rounded-full text-xs',
              currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50 active:bg-blue-100'
            ]"
            aria-label="Halaman sebelumnya"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <!-- Page number display -->
          <div class="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium min-w-[60px] text-center">
            {{ currentPage }} / {{ totalPages }}
          </div>
          
          <button 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="[
              'w-9 h-9 flex items-center justify-center rounded-full text-xs',
              currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50 active:bg-blue-100'
            ]"
            aria-label="Halaman berikutnya"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button 
            @click="goToPage(totalPages)"
            :disabled="currentPage === totalPages"
            :class="[
              'w-9 h-9 flex items-center justify-center rounded-full text-xs',
              currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50 active:bg-blue-100'
            ]"
            aria-label="Halaman akhir"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Floating scroll buttons -->
    <div v-if="showScrollButtons" class="fixed right-4 flex flex-col gap-3 z-20" :style="{ bottom: '80px' }">
      <button 
        @click="scrollToTop" 
        class="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
        aria-label="Scroll ke atas"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      <button 
        @click="scrollToBottom" 
        class="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
        aria-label="Scroll ke bawah"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Tambahkan import useRouter
import { useQuranService } from '~/composables/useQuranService';

// Interfaces
interface Verse {
  number: {
    inSurah: number;
    inQuran?: number; // Jadikan inQuran sebagai optional property
  };
  text: {
    arab: string;
    transliteration: {
      en: string;
    };
  };
  translation: {
    id: string;
  };
}

interface SurahDetail {
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
  verses: Verse[];
  preBismillah?: {
    text: {
      arab: string;
      transliteration: {
        en: string;
      };
    };
    translation: {
      id: string;
    };
  };
}

// Route dan parameter
const route = useRoute();
const router = useRouter(); // Inisialisasi useRouter di sini
const surahId = ref<number>(parseInt(route.params.id as string));

// State
const surah = ref<SurahDetail>({} as SurahDetail);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const currentPage = ref<number>(1);
const versesPerPage = ref<number>(10); // Default 10 ayat per page
const businessInsights = ref<Record<number, string>>({});
const prevSurahName = ref<string>('');
const nextSurahName = ref<string>('');

const showScrollButtons = ref<boolean>(false);
const scrollThreshold = ref<number>(300); // Show buttons after scrolling this many pixels

// Gunakan composable quran service
const quranService = useQuranService();

// Computed properties
const totalAyat = computed<number>(() => {
  return surah.value?.verses?.length || 0;
});

const totalPages = computed<number>(() => {
  return Math.ceil(totalAyat.value / versesPerPage.value) || 1;
});

const paginatedVerses = computed<Verse[]>(() => {
  if (!surah.value?.verses) return [];
  
  const startIndex = (currentPage.value - 1) * versesPerPage.value;
  const endIndex = Math.min(startIndex + versesPerPage.value, totalAyat.value);
  
  return surah.value.verses.slice(startIndex, endIndex);
});

const startAyat = computed<number>(() => {
  return ((currentPage.value - 1) * versesPerPage.value) + 1;
});

const endAyat = computed<number>(() => {
  return Math.min(startAyat.value + versesPerPage.value - 1, totalAyat.value);
});

const hasPrevSurah = computed<boolean>(() => {
  return surahId.value > 1;
});

const hasNextSurah = computed<boolean>(() => {
  return surahId.value < 114; // Total surah dalam Al-Quran adalah 114
});

const prevSurahNumber = computed<number>(() => {
  return Math.max(1, surahId.value - 1);
});

const nextSurahNumber = computed<number>(() => {
  return Math.min(114, surahId.value + 1);
});

// Watch untuk reset page saat berganti surah
watch(() => route.params.id, () => {
  const newSurahId = parseInt(route.params.id as string);
  surahId.value = newSurahId;
  
  // Reload surah data dan reset pagination hanya jika surahId benar-benar berubah
  if (newSurahId !== surahId.value) {
    currentPage.value = 1; // Reset pagination sebelum fetchSurahDetail
    fetchSurahDetail();
  }
});

// Fetch surah detail dengan composable update
const fetchSurahDetail = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const { data, error: serviceError } = await quranService.fetchSurahById(surahId.value);
    
    if (serviceError) {
      throw new Error(serviceError);
    }
    
    if (data) {
      surah.value = data;
      
      // Load business insights setelah surah dimuat
      loadBusinessInsights();
      
      // Save last read position
      saveLastRead();
      
      // Handle hash jika ada
      if (route.hash) {
        const ayatNumber = parseInt(route.hash.replace('#ayat-', ''));
        if (!isNaN(ayatNumber)) {
          currentPage.value = Math.ceil(ayatNumber / versesPerPage.value);
        }
      }
      
      // Fetch adjacent surah names
      fetchAdjacentSurahNames();
    } else {
      error.value = 'Terjadi kesalahan saat memuat detail surah';
    }
  } catch (err: unknown) {
    console.error('Error fetching surah detail:', err);
    const errorMessage = err instanceof Error ? err.message : 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    error.value = errorMessage;
  } finally {
    loading.value = false;
  }
};

// Fetch adjacent surah names
const fetchAdjacentSurahNames = async () => {
  if (hasPrevSurah.value) {
    try {
      const { data } = await quranService.fetchSurahById(prevSurahNumber.value);
      if (data && data.name && data.name.transliteration) {
        prevSurahName.value = data.name.transliteration.id;
      }
    } catch (err) {
      console.error('Error fetching previous surah name:', err);
    }
  }
  
  if (hasNextSurah.value) {
    try {
      const { data } = await quranService.fetchSurahById(nextSurahNumber.value);
      if (data && data.name && data.name.transliteration) {
        nextSurahName.value = data.name.transliteration.id;
      }
    } catch (err) {
      console.error('Error fetching next surah name:', err);
    }
  }
};

// Load business insights (contoh implementasi)
const loadBusinessInsights = () => {
  // Ini hanya contoh implementasi, bisa disesuaikan dengan kebutuhan
  // Di aplikasi nyata, mungkin data ini berasal dari API atau database
  businessInsights.value = {
    // Contoh insight bisnis untuk ayat tertentu
    1: "Memulai bisnis dengan bismillah adalah kunci keberhasilan seorang entrepreneur muslim.",
    5: "Prinsip transparansi dan kejujuran dalam bisnis sangat ditekankan dalam Islam.",
    10: "Keseimbangan antara mencari keuntungan dan beribadah adalah filosofi penting dalam bisnis Islam."
  };
};

// Cek apakah ada business insight untuk ayat tertentu
const hasBusinessInsight = (ayatNumber: number): boolean => {
  return !!businessInsights.value[ayatNumber];
};

// Ambil business insight untuk ayat tertentu
const getBusinessInsight = (ayatNumber: number): string => {
  return businessInsights.value[ayatNumber] || '';
};

// Simpan posisi terakhir membaca
const saveLastRead = () => {
  if (!surah.value?.number) return;
  
  const lastRead = {
    surah: surah.value.number,
    name: surah.value.name?.transliteration?.id || '',
    page: currentPage.value,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('lastRead', JSON.stringify(lastRead));
};

// Fungsi bookmark ayat
const bookmarkVerse = (verse: Verse) => {
  if (!surah.value?.number) return;
  
  const bookmark = {
    surah: surah.value.number,
    surahName: surah.value.name?.transliteration?.id || '',
    ayat: verse.number.inSurah,
    text: verse.text.arab,
    translation: verse.translation.id,
    timestamp: new Date().toISOString()
  };
  
  // Ambil bookmark yang sudah ada
  const bookmarksJson = localStorage.getItem('quranBookmarks') || '[]';
  const bookmarks = JSON.parse(bookmarksJson);
  
  // Cek apakah sudah ada bookmark untuk ayat ini
  const existingIndex = bookmarks.findIndex((b: any) => 
    b.surah === bookmark.surah && b.ayat === bookmark.ayat
  );
  
  // Jika sudah ada, hapus bookmark tersebut
  if (existingIndex >= 0) {
    bookmarks.splice(existingIndex, 1);
    alert('Bookmark telah dihapus');
  } else {
    // Jika belum ada, tambahkan bookmark baru
    bookmarks.push(bookmark);
    alert('Ayat telah ditambahkan ke bookmark');
  }
  
  // Simpan bookmark yang sudah diupdate
  localStorage.setItem('quranBookmarks', JSON.stringify(bookmarks));
};

// Fungsi share ayat
const shareVerse = (verse: Verse) => {
  if (!surah.value?.number) return;
  
  const text = `${surah.value.name?.transliteration?.id} (${surah.value.number}:${verse.number.inSurah})\n\n${verse.text.arab}\n\n${verse.translation.id}`;
  
  // Coba gunakan Web Share API jika tersedia
  if (navigator.share) {
    navigator.share({
      title: `${surah.value.name?.transliteration?.id} (${surah.value.number}:${verse.number.inSurah})`,
      text: text
    }).catch(err => {
      console.error('Error sharing:', err);
      // Fallback: copy to clipboard
      copyToClipboard(text);
    });
  } else {
    // Fallback: copy to clipboard
    copyToClipboard(text);
  }
};

// Fungsi helper untuk copy ke clipboard
const copyToClipboard = (text: string) => {
  // Untuk browser yang mendukung Clipboard API
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => alert('Ayat telah disalin ke clipboard'))
      .catch(err => {
        console.error('Error copying to clipboard:', err);
        alert('Tidak dapat menyalin teks');
      });
  } else {
    // Fallback untuk browser yang tidak mendukung Clipboard API
    alert('Tidak dapat membagikan ayat ini');
  }
};

// Handle scroll events to show/hide floating buttons
const handleScroll = () => {
  showScrollButtons.value = window.scrollY > scrollThreshold.value;
};

// Scroll to the top of the page (surah header)
const scrollToTop = () => {
  const surahHeader = document.querySelector('.mb-6.bg-white.p-4.rounded-lg.shadow.text-center');
  if (surahHeader) {
    surahHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Scroll to the bottom of the page
const scrollToBottom = () => {
  const bottomPagination = document.querySelector('.mb-6.bg-white.p-3.rounded-lg.shadow.flex.justify-center');
  if (bottomPagination) {
    bottomPagination.scrollIntoView({ behavior: 'smooth', block: 'end' });
  } else {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
};

// Modify the goToPage function to scroll to the surah header
const goToPage = (pageNumber: number) => {
  if (pageNumber < 1 || pageNumber > totalPages.value || pageNumber === currentPage.value) {
    return;
  }
  
  currentPage.value = pageNumber;
  
  // Scroll to the surah header after a short delay to allow for rendering
  setTimeout(() => {
    // Find the surah header element
    const surahHeader = document.querySelector('.mb-6.bg-white.p-4.rounded-lg.shadow.text-center');
    if (surahHeader) {
      // Scroll to the surah header with smooth behavior
      surahHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback: scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, 100);
};

// Lifecycle
onMounted(() => {
  fetchSurahDetail();
  
  // Add scroll event listener for floating buttons
  window.addEventListener('scroll', handleScroll);
  
  // Tambahkan event listener untuk keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && hasPrevSurah.value) {
      // Navigasi ke surah sebelumnya (dalam bahasa Arab, sebelumnya = ke kanan)
      navigateToRoute(`/quran/${prevSurahNumber.value}`);
    } else if (e.key === 'ArrowLeft' && hasNextSurah.value) {
      // Navigasi ke surah berikutnya (dalam bahasa Arab, berikutnya = ke kiri)
      navigateToRoute(`/quran/${nextSurahNumber.value}`);
    } else if (e.key === 'ArrowUp' && currentPage.value > 1) {
      // Navigasi ke halaman sebelumnya
      goToPage(currentPage.value - 1);
    } else if (e.key === 'ArrowDown' && currentPage.value < totalPages.value) {
      // Navigasi ke halaman berikutnya
      goToPage(currentPage.value + 1);
    }
  });
});

// Clean up event listeners when component is unmounted
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Helper untuk navigasi
const navigateToRoute = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
@media (min-width: 480px) {
  .xs\:inline {
    display: inline;
  }
  .xs\:hidden {
    display: none;
  }
}
</style>