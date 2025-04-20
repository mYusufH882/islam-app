<template>
    <div>
      <!-- Back button and navigation -->
      <div class="mb-4 flex items-center justify-between">
        <NuxtLink to="/quran" class="inline-flex items-center text-blue-600">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </NuxtLink>
  
        <!-- Surah Navigation -->
        <div class="flex space-x-2">
          <NuxtLink 
            v-if="hasPrevSurah" 
            :to="`/quran/${prevSurahNumber}`"
            class="inline-flex items-center px-3 py-1 bg-white rounded-md shadow text-blue-600 hover:bg-blue-50"
          >
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Surah Sebelumnya
          </NuxtLink>
          
          <NuxtLink 
            v-if="hasNextSurah" 
            :to="`/quran/${nextSurahNumber}`"
            class="inline-flex items-center px-3 py-1 bg-white rounded-md shadow text-blue-600 hover:bg-blue-50"
          >
            Surah Berikutnya
            <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div class="mb-4 flex justify-between items-center bg-white p-3 rounded-lg shadow">
          <div class="text-sm text-gray-600">
            Menampilkan ayat {{ startAyat }}-{{ endAyat }} dari {{ totalAyat }} ayat
          </div>
          
          <!-- Ayat pagination controls -->
          <div class="flex items-center space-x-1">
            <button 
              @click="currentPage = 1"
              :disabled="currentPage === 1"
              :class="[
                'px-2 py-1 rounded text-sm',
                currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
              ]"
            >
              Awal
            </button>
            
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              :class="[
                'px-2 py-1 rounded text-sm',
                currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
              ]"
            >
              &laquo;
            </button>
            
            <span class="px-2 py-1 text-sm">
              {{ currentPage }}/{{ totalPages }}
            </span>
            
            <button 
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              :class="[
                'px-2 py-1 rounded text-sm',
                currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
              ]"
            >
              &raquo;
            </button>
            
            <button 
              @click="currentPage = totalPages"
              :disabled="currentPage === totalPages"
              :class="[
                'px-2 py-1 rounded text-sm',
                currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
              ]"
            >
              Akhir
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
              <div class="flex space-x-2">
                <button 
                  @click="bookmarkVerse(verse)" 
                  class="p-2 rounded-full hover:bg-gray-100"
                  title="Bookmark ayat ini"
                >
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                <button 
                  @click="shareVerse(verse)" 
                  class="p-2 rounded-full hover:bg-gray-100"
                  title="Bagikan ayat ini"
                >
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
            <p class="text-xl font-arabic text-right leading-loose mb-4">{{ verse.text.arab }}</p>
            <p class="text-gray-700 mb-2 text-sm italic">{{ verse.text.transliteration.en }}</p>
            <p class="text-gray-800">{{ verse.translation.id }}</p>
            
            <!-- Business insight untuk entrepreneur (opsional) -->
            <div v-if="hasBusinessInsight(verse.number.inSurah)" class="mt-3 p-3 bg-amber-50 rounded-md border border-amber-200">
              <h4 class="font-medium text-amber-800">Insight Bisnis:</h4>
              <p class="text-sm text-amber-700">{{ getBusinessInsight(verse.number.inSurah) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Bottom ayat pagination controls -->
        <div class="mb-20 bg-white p-3 rounded-lg shadow flex justify-center">
          <div class="flex items-center space-x-1">
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
            <div class="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium">
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
  
        <!-- Bottom navigation (for mobile experience) -->
        <div class="fixed bottom-20 left-0 right-0 px-4 flex justify-center z-10 mb-2">
          <div class="flex space-x-2 bg-white p-2 rounded-full shadow-lg">
            <NuxtLink 
              v-if="hasPrevSurah" 
              :to="`/quran/${prevSurahNumber}`"
              class="p-2 rounded-full bg-blue-100 text-blue-600"
              title="Surah Sebelumnya"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </NuxtLink>
            
            <NuxtLink 
              to="/quran"
              class="p-2 rounded-full bg-gray-100 text-gray-600"
              title="Daftar Surah"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </NuxtLink>
            
            <NuxtLink 
              v-if="hasNextSurah" 
              :to="`/quran/${nextSurahNumber}`"
              class="p-2 rounded-full bg-blue-100 text-blue-600"
              title="Surah Berikutnya"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const surahId = parseInt(route.params.id);
  
  // State
  const surah = ref({});
  const loading = ref(true);
  const error = ref(null);
  const businessInsights = ref({});
  const currentPage = ref(1);
  const versesPerPage = 10; // Fixed at 10 ayat per page
  
  // Computed properties untuk navigasi surah
  const hasPrevSurah = computed(() => surahId > 1);
  const hasNextSurah = computed(() => surahId < 114);
  const prevSurahNumber = computed(() => surahId - 1);
  const nextSurahNumber = computed(() => surahId + 1);
  
  // Computed properties untuk pagination ayat
  const totalAyat = computed(() => {
    return surah.value.verses ? surah.value.verses.length : 0;
  });
  
  const totalPages = computed(() => {
    return Math.ceil(totalAyat.value / versesPerPage);
  });
  
  const paginatedVerses = computed(() => {
    if (!surah.value.verses) return [];
    
    const startIndex = (currentPage.value - 1) * versesPerPage;
    const endIndex = Math.min(startIndex + versesPerPage, surah.value.verses.length);
    
    return surah.value.verses.slice(startIndex, endIndex);
  });
  
  const startAyat = computed(() => {
    return ((currentPage.value - 1) * versesPerPage) + 1;
  });
  
  const endAyat = computed(() => {
    return Math.min(currentPage.value * versesPerPage, totalAyat.value);
  });
  
  // Watch untuk reset halaman saat surah berubah
  watch(() => route.params.id, () => {
    currentPage.value = 1;
  });
  
  // Watch untuk hash fragment (agar bekerja dengan last read/bookmarks)
  watch(() => route.hash, (newHash) => {
    if (newHash) {
      const ayatNumber = parseInt(newHash.replace('#ayat-', ''));
      if (!isNaN(ayatNumber)) {
        // Hitung halaman berdasarkan nomor ayat
        currentPage.value = Math.ceil(ayatNumber / versesPerPage);
        
        // Scroll ke ayat setelah render
        setTimeout(() => {
          const element = document.getElementById(newHash.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, { immediate: true });
  
  // Contoh insights bisnis
  const loadBusinessInsights = () => {
    // Contoh dari beberapa ayat yang relevan dengan bisnis
    if (surahId === 2) { // Al-Baqarah
      businessInsights.value = {
        275: "Ayat ini memberikan dasar hukum tentang riba dan jual beli halal dalam bisnis. Sebagai pengusaha muslim kita harus memastikan transaksi bisnis kita bebas dari riba.",
        282: "Ayat ini mengajarkan pentingnya pencatatan transaksi dan kontrak bisnis secara tertulis untuk menghindari perselisihan di kemudian hari.",
        261: "Ilustrasi investasi dan pengembalian berlipat ganda bagi yang membelanjakan harta di jalan Allah, yang bisa diterapkan dalam prinsip sedekah dalam bisnis."
      };
    } else if (surahId === 4) { // An-Nisa
      businessInsights.value = {
        29: "Ayat ini mengajarkan untuk melakukan bisnis atas dasar suka sama suka, mendorong transaksi yang adil dan transparan dengan semua pihak."
      };
    } else if (surahId === 62) { // Al-Jumu'ah
      businessInsights.value = {
        10: "Menyeimbangkan antara ibadah dan berbisnis. Setelah menunaikan kewajiban (shalat Jumat), bertebarlah untuk mencari rezeki Allah."
      };
    }
  };
  
  // Methods
  const fetchSurahDetail = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`https://api.quran.gading.dev/surah/${surahId}`);
      const data = await response.json();
      
      if (data.code === 200) {
        surah.value = data.data;
        
        // Load business insights setelah surah dimuat
        loadBusinessInsights();
        
        // Save last read position
        saveLastRead();
        
        // Handle hash jika ada
        if (route.hash) {
          const ayatNumber = parseInt(route.hash.replace('#ayat-', ''));
          if (!isNaN(ayatNumber)) {
            currentPage.value = Math.ceil(ayatNumber / versesPerPage);
          }
        }
      } else {
        error.value = 'Terjadi kesalahan saat memuat detail surah';
      }
    } catch (err) {
      console.error('Error fetching surah detail:', err);
      error.value = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    } finally {
      loading.value = false;
    }
  };
  
  const hasBusinessInsight = (ayatNumber) => {
    return businessInsights.value[ayatNumber] !== undefined;
  };
  
  const getBusinessInsight = (ayatNumber) => {
    return businessInsights.value[ayatNumber] || '';
  };
  
  const saveLastRead = () => {
    if (surah.value.name) {
      const lastRead = {
        surah: {
          number: surah.value.number,
          name: surah.value.name.transliteration.id,
          nameArab: surah.value.name.short
        },
        ayat: ((currentPage.value - 1) * versesPerPage) + 1, // First ayat on current page
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('lastRead', JSON.stringify(lastRead));
    }
  };
  
  const bookmarkVerse = (verse) => {
    const bookmarkData = {
      surah: {
        number: surah.value.number,
        name: surah.value.name.transliteration.id,
        nameArab: surah.value.name.short
      },
      ayat: verse.number.inSurah,
      text: verse.text.arab,
      translation: verse.translation.id,
      timestamp: new Date().toISOString()
    };
    
    // Get existing bookmarks
    let bookmarks = JSON.parse(localStorage.getItem('quranBookmarks') || '[]');
    
    // Check if already bookmarked
    const exists = bookmarks.findIndex(b => 
      b.surah.number === bookmarkData.surah.number && 
      b.ayat === bookmarkData.ayat
    );
    
    if (exists >= 0) {
      // Remove if already exists (toggle functionality)
      bookmarks.splice(exists, 1);
      alert('Bookmark dihapus');
    } else {
      // Add new bookmark
      bookmarks.push(bookmarkData);
      alert('Ayat ditandai');
    }
    
    // Save updated bookmarks
    localStorage.setItem('quranBookmarks', JSON.stringify(bookmarks));
  };
  
  const shareVerse = (verse) => {
    const shareText = `${surah.value.name.transliteration.id} (${verse.number.inSurah}):\n\n${verse.text.arab}\n\n${verse.translation.id}\n\nDibagikan dari Entrepreneur Muslim App`;
    
    if (navigator.share) {
      navigator.share({
        title: `${surah.value.name.transliteration.id} ayat ${verse.number.inSurah}`,
        text: shareText
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText)
        .then(() => alert('Ayat disalin ke clipboard'))
        .catch(err => {
          console.error('Error copying to clipboard:', err);
          alert('Tidak dapat menyalin teks');
        });
    }
  };
  
  // Handle keyboard navigation
  const setupKeyboardNavigation = () => {
    window.addEventListener('keydown', (e) => {
      // Left arrow key to navigate to previous surah
      if (e.key === 'ArrowLeft' && hasPrevSurah.value) {
        router.push(`/quran/${prevSurahNumber.value}`);
      }
      // Right arrow key to navigate to next surah
      else if (e.key === 'ArrowRight' && hasNextSurah.value) {
        router.push(`/quran/${nextSurahNumber.value}`);
      }
      // Page Up key to navigate to previous page of verses
      else if (e.key === 'PageUp' && currentPage.value > 1) {
        currentPage.value--;
        window.scrollTo(0, 0);
      }
      // Page Down key to navigate to next page of verses
      else if (e.key === 'PageDown' && currentPage.value < totalPages.value) {
        currentPage.value++;
        window.scrollTo(0, 0);
      }
    });
  };
  
  // Lifecycle
  onMounted(() => {
    fetchSurahDetail();
    setupKeyboardNavigation();
  });
</script>