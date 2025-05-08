<template>
  <div>
    <h3 class="text-lg font-semibold mb-3">Ayat yang Ditandai</h3>
    
    <div v-if="bookmarks.length === 0" class="bg-white p-4 rounded-lg shadow text-center">
      <p class="text-gray-500">Belum ada ayat yang ditandai</p>
      <NuxtLink to="/quran" class="mt-2 inline-block text-blue-600">
        Buka Al-Quran
      </NuxtLink>
    </div>
    
    <div v-else class="space-y-3">
      <div 
        v-for="bookmark in processedBookmarks" 
        :key="bookmark.id"
        class="bg-white p-4 rounded-lg shadow"
      >
        <div class="flex justify-between">
          <h4 class="font-medium">Surat {{ getSurahName(bookmark) }} - {{ getSurahNameArab(bookmark) }}</h4>
          <span class="text-sm text-gray-500">Ayat {{ getVerseNumber(bookmark) }}</span>
        </div>
        
        <!-- Tampilkan teks ayat jika tersedia -->
        <p v-if="getVerseText(bookmark)" class="text-right mt-3 font-arabic text-lg leading-relaxed">
          {{ getVerseText(bookmark) }}
        </p>
        
        <!-- Tampilkan terjemahan jika tersedia -->
        <p v-if="getVerseTranslation(bookmark)" class="text-sm text-gray-700 mt-2">
          {{ getVerseTranslation(bookmark) }}
        </p>
        
        <div class="mt-3 flex justify-between">
          <span class="text-xs text-gray-500">
            {{ formatDate(bookmark.timestamp) }}
          </span>
          
          <div class="flex space-x-2">
            <button 
              @click="openBookmark(bookmark)" 
              class="text-sm text-blue-600 flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Buka
            </button>
            
            <button 
              @click="promptDeleteBookmark(bookmark)"
              class="text-sm text-red-600 flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal konfirmasi hapus bookmark -->
    <DeleteConfirmationModal
      :is-open="showDeleteModal"
      :is-deleting="isDeleting"
      title="Hapus Bookmark Al-Quran"
      :message="`Apakah Anda yakin ingin menghapus bookmark ${selectedBookmarkName}?`"
      @close="cancelDelete"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuranService } from '~/composables/useQuranService';
import { useBookmarkService } from '~/composables/useBookmarkService';
import DeleteConfirmationModal from '../DeleteConfirmationModal.vue';

const props = defineProps({
  bookmarks: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['remove-bookmark']);
const router = useRouter();
const quranService = useQuranService();
const bookmarkService = useBookmarkService();

// State untuk menyimpan data surah
const surahsData = ref({});
const isLoadingSurahs = ref(false);

// State untuk modal hapus
const showDeleteModal = ref(false);
const bookmarkToDelete = ref(null);
const isDeleting = ref(false);
const selectedBookmarkName = ref('');
const deleteError = ref(null);

// Processes bookmarks to normalize data structure
const processedBookmarks = computed(() => {
  return props.bookmarks.map(bookmark => {
    // Normalize bookmark structure
    const processedBookmark = { ...bookmark };
    
    // Extract surah and verse info from referenceId if needed
    if (bookmark.referenceId && bookmark.referenceId.startsWith('quran:')) {
      const parts = bookmark.referenceId.split(':');
      if (parts.length >= 3) {
        const surahId = parseInt(parts[1]);
        const verseId = parseInt(parts[2]);
        
        processedBookmark.surahId = surahId;
        processedBookmark.ayat = verseId;
        
        // Use cached surah data if available
        if (surahsData.value[surahId]) {
          processedBookmark.surahData = surahsData.value[surahId];
        }
      }
    }
    
    // Support both nested and flat structures
    if (bookmark.surah?.number) {
      processedBookmark.surahId = bookmark.surah.number;
    } else if (bookmark.surahId) {
      processedBookmark.surahId = bookmark.surahId;
    }
    
    if (bookmark.ayat) {
      processedBookmark.ayat = bookmark.ayat;
    } else if (bookmark.verseId) {
      processedBookmark.ayat = bookmark.verseId;
    }
    
    return processedBookmark;
  });
});

// Helper function to get surah name with fallbacks
const getSurahName = (bookmark) => {
  // Try to get name from different possible paths
  if (bookmark.surah?.name) {
    return bookmark.surah.name;
  }
  
  if (bookmark.surahName) {
    return bookmark.surahName;
  }
  
  if (bookmark.notes && bookmark.notes.includes(' - ')) {
    // If notes format is "SurahName - Text"
    return bookmark.notes.split(' - ')[0];
  }
  
  // If we have surahData from cache
  if (bookmark.surahData?.name?.transliteration?.id) {
    return bookmark.surahData.name.transliteration.id;
  }
  
  // Use cache if available
  if (bookmark.surahId && surahsData.value[bookmark.surahId]) {
    const surah = surahsData.value[bookmark.surahId];
    return surah.name?.transliteration?.id || `Surah ${bookmark.surahId}`;
  }
  
  // Default fallback
  return bookmark.surahId ? `Surah ${bookmark.surahId}` : 'Surah';
};

// Helper function to get surah name in Arabic with fallbacks
const getSurahNameArab = (bookmark) => {
  // Try direct access first
  if (bookmark.surah?.nameArab) {
    return bookmark.surah.nameArab;
  }
  
  if (bookmark.surahNameArab) {
    return bookmark.surahNameArab;
  }
  
  // Try different structure paths
  if (bookmark.surah?.name?.short) {
    return bookmark.surah.name.short;
  }
  
  if (bookmark.surah?.name?.arabic) {
    return bookmark.surah.name.arabic;
  }
  
  // If we have surahData from cache
  if (bookmark.surahData?.name?.short) {
    return bookmark.surahData.name.short;
  }
  
  if (bookmark.surahData?.name?.arabic) {
    return bookmark.surahData.name.arabic;
  }
  
  // Use cache if available
  if (bookmark.surahId && surahsData.value[bookmark.surahId]) {
    const surah = surahsData.value[bookmark.surahId];
    if (surah.name?.short) return surah.name.short;
    if (surah.name?.arabic) return surah.name.arabic;
  }
  
  // Default fallback - empty string instead of text placeholder for Arabic
  return '';
};

// Helper function to get verse text
const getVerseText = (bookmark) => {
  if (bookmark.text) return bookmark.text;
  
  // Look for other possible property names
  if (bookmark.verseText) return bookmark.verseText;
  if (bookmark.arabicText) return bookmark.arabicText;
  
  return '';
};

// Helper function to get verse translation
const getVerseTranslation = (bookmark) => {
  if (bookmark.translation) return bookmark.translation;
  
  // Look for other possible property names
  if (bookmark.verseTranslation) return bookmark.verseTranslation;
  if (bookmark.indonesianTranslation) return bookmark.indonesianTranslation;
  
  return '';
};

// Helper function to get verse number
const getVerseNumber = (bookmark) => {
  return bookmark.ayat || bookmark.verseId || '';
};

// Format date to be more readable
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Open surah at specific ayat
const openBookmark = (bookmark) => {
  const surahId = bookmark.surahId || bookmark.surah?.number;
  const ayatId = bookmark.ayat || bookmark.verseId;
  
  if (!surahId) {
    console.error('Unable to open bookmark: Missing surah ID');
    return;
  }
  
  router.push(`/quran/${surahId}${ayatId ? `#ayat-${ayatId}` : ''}`);
};

// Prompt user to delete bookmark with modal
const promptDeleteBookmark = (bookmark) => {
  bookmarkToDelete.value = bookmark;
  // Set nama untuk ditampilkan di modal
  selectedBookmarkName.value = `${getSurahName(bookmark)} Ayat ${getVerseNumber(bookmark)}`;
  showDeleteModal.value = true;
  deleteError.value = null;
};

// Cancel delete action
const cancelDelete = () => {
  bookmarkToDelete.value = null;
  selectedBookmarkName.value = '';
  showDeleteModal.value = false;
  deleteError.value = null;
};

// Confirm delete action
const confirmDelete = async () => {
  if (!bookmarkToDelete.value) return;
  
  isDeleting.value = true;
  deleteError.value = null;
  
  try {
    const bookmarkId = getBookmarkId(bookmarkToDelete.value);
    
    if (!bookmarkId) {
      throw new Error('ID bookmark tidak ditemukan');
    }
    
    console.log('Menghapus bookmark dengan ID:', bookmarkId, 'Data bookmark:', bookmarkToDelete.value);
    
    // Panggil metode penghapusan bookmark langsung dari service
    const success = await bookmarkService.removeBookmark(bookmarkId);
    
    if (success) {
      // Emit event bahwa bookmark telah dihapus
      emit('bookmark-deleted', bookmarkId);
      
      // Emitkan juga event yang sama dengan yang sebelumnya untuk kompatibilitas
      emit('remove-bookmark', bookmarkToDelete.value);
      
      console.log('Bookmark berhasil dihapus:', bookmarkId);
      
      // Tutup modal setelah berhasil
      showDeleteModal.value = false;
      bookmarkToDelete.value = null;
      selectedBookmarkName.value = '';
    } else {
      throw new Error('Gagal menghapus bookmark');
    }
  } catch (error) {
    console.error('Error saat menghapus bookmark:', error);
    deleteError.value = error.message || 'Gagal menghapus bookmark. Silakan coba lagi.';
  } finally {
    isDeleting.value = false;
  }
};

const getBookmarkId = (bookmark) => {
  // Coba berbagai kemungkinan lokasi ID
  if (bookmark.id) {
    return bookmark.id;
  }
  
  // Jika ID ada di referenceId format "quran:1:2"
  if (bookmark.referenceId && bookmark.referenceId.includes(':')) {
    return bookmark.referenceId;
  }
  
  // Jika bookmark memiliki format lain
  if (bookmark.surahId && bookmark.ayat) {
    return `quran:${bookmark.surahId}:${bookmark.ayat}`;
  }
  
  console.warn('Tidak dapat menentukan ID bookmark:', bookmark);
  return null;
};

// Load surah data for all bookmarks
const loadSurahsData = async () => {
  if (isLoadingSurahs.value) return;
  
  isLoadingSurahs.value = true;
  
  try {
    // Collect all unique surah IDs from bookmarks
    const surahIds = new Set();
    
    props.bookmarks.forEach(bookmark => {
      let surahId = null;
      
      // Extract from different possible paths
      if (bookmark.surah?.number) {
        surahId = bookmark.surah.number;
      } else if (bookmark.surahId) {
        surahId = bookmark.surahId;
      } else if (bookmark.referenceId && bookmark.referenceId.startsWith('quran:')) {
        const parts = bookmark.referenceId.split(':');
        if (parts.length >= 2) {
          surahId = parseInt(parts[1]);
        }
      }
      
      if (surahId && !surahsData.value[surahId]) {
        surahIds.add(surahId);
      }
    });
    
    // Fetch data for each missing surah
    const fetchPromises = Array.from(surahIds).map(async (surahId) => {
      try {
        const { data } = await quranService.fetchSurahById(surahId);
        if (data) {
          surahsData.value[surahId] = data;
          console.log(`Fetched surah ${surahId}:`, data);
        }
      } catch (error) {
        console.error(`Error fetching surah ${surahId}:`, error);
      }
    });
    
    await Promise.all(fetchPromises);
  } catch (error) {
    console.error('Error loading surahs data:', error);
  } finally {
    isLoadingSurahs.value = false;
  }
};

// Load surah data when component is mounted
onMounted(() => {
  loadSurahsData();
});

// Watch for changes in bookmarks to load missing surah data
watch(() => props.bookmarks, () => {
  loadSurahsData();
}, { deep: true });
</script>

<style scoped>
/* Pastikan font Arab diterapkan dengan benar */
.font-arabic {
  font-family: 'Scheherazade New', serif;
  direction: rtl;
}
</style>