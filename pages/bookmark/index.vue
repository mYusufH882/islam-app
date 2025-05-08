<template>
  <div>
    <!-- Tombol Kembali -->
    <div class="mb-4">
      <NuxtLink to="/" class="inline-flex items-center text-blue-600">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Beranda
      </NuxtLink>
    </div>
    
    <!-- Pemberitahuan akses ditolak -->
    <div v-if="accessDenied" class="mb-6 bg-red-50 p-4 rounded-lg shadow-md">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-medium text-red-800">Akses Ditolak</h3>
          <div class="mt-2 text-red-700">
            <p>Anda harus login untuk mengakses halaman bookmark.</p>
            <button 
              @click="goToLogin" 
              class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Login Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Konten bookmark (hanya ditampilkan jika user terautentikasi) -->
    <div v-if="!accessDenied">
      <!-- Header -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold">Bookmark</h2>
        <p class="text-gray-600">Ayat dan artikel yang Anda tandai</p>
      </div>

      <!-- Notifikasi status operasi -->
      <div v-if="statusMessage" :class="[
        'mb-4 p-3 rounded-md text-sm',
        statusType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
      ]">
        {{ statusMessage }}
      </div>

      <!-- Filter Tab -->
      <div class="mb-6 bg-white rounded-lg shadow overflow-hidden">
        <div class="flex border-b border-gray-200">
          <button 
            @click="activeTab = 'quran'" 
            class="flex-1 py-3 px-4 text-center font-medium transition-colors duration-200"
            :class="activeTab === 'quran' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'"
          >
            Al-Quran
          </button>
          <button 
            @click="activeTab = 'blog'" 
            class="flex-1 py-3 px-4 text-center font-medium transition-colors duration-200"
            :class="activeTab === 'blog' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'"
          >
            Blog
          </button>
        </div>
      </div>

      <!-- Bookmark Content based on active tab -->
      <div v-if="activeTab === 'quran'">
        <BookmarkList 
          :bookmarks="quranBookmarks" 
          @remove-bookmark="removeQuranBookmark"
          @bookmark-deleted="handleBookmarkDeleted"
        />
      </div>
      
      <div v-else-if="activeTab === 'blog'">
        <BlogBookmarkList 
          :bookmarks="blogBookmarks" 
          @remove-bookmark="removeBlogBookmark"
          @bookmark-deleted="handleBookmarkDeleted"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useBookmarkService } from '~/composables/useBookmarkService';
import BookmarkList from '~/components/quran/BookmarkList.vue';
import BlogBookmarkList from '~/components/blog/BlogBookmarkList.vue';

const router = useRouter();
const authStore = useAuthStore();
const bookmarkService = useBookmarkService();
const activeTab = ref('quran');

// State untuk mengontrol pemberitahuan akses ditolak
const accessDenied = ref(false);

// State untuk menampilkan status operasi
const statusMessage = ref('');
const statusType = ref('success');
const statusTimeout = ref(null);

// Computed properties to get bookmarks by type
const quranBookmarks = computed(() => {
  return bookmarkService.quranBookmarks.value;
});

const blogBookmarks = computed(() => {
  return bookmarkService.blogBookmarks.value;
});

// Function untuk menampilkan status
const showStatus = (message, type = 'success') => {
  statusMessage.value = message;
  statusType.value = type;
  
  // Clear any existing timeout
  if (statusTimeout.value) {
    clearTimeout(statusTimeout.value);
  }
  
  // Auto clear after 5 seconds
  statusTimeout.value = setTimeout(() => {
    statusMessage.value = '';
  }, 5000);
};

// Periksa autentikasi pada mounting komponen
onMounted(async () => {
  // Jika pengguna belum login, tampilkan pemberitahuan
  if (!authStore.isAuthenticated) {
    accessDenied.value = true;
  } else {
    // Load bookmarks
    await bookmarkService.loadBookmarks();
  }
});

// Fungsi untuk melakukan redirect manual
const goToLogin = () => {
  router.push('/auth/login?redirect=/bookmark');
};

// Handler untuk menghapus bookmark Quran
const removeQuranBookmark = async (bookmark) => {
  try {
    // Coba mendapatkan ID bookmark
    let bookmarkId = bookmark.id;
    
    // Jika tidak ada ID langsung, mungkin ID ada di format khusus
    if (!bookmarkId && bookmark.referenceId) {
      bookmarkId = bookmark.referenceId;
    } else if (!bookmarkId && bookmark.surahId && bookmark.ayat) {
      bookmarkId = `quran:${bookmark.surahId}:${bookmark.ayat}`;
    }
    
    if (!bookmarkId) {
      console.error('Tidak dapat menentukan ID bookmark:', bookmark);
      showStatus('Gagal menghapus bookmark: ID tidak valid', 'error');
      return;
    }
    
    console.log('Menghapus bookmark Al-Quran dengan ID:', bookmarkId);
    
    const success = await bookmarkService.removeBookmark(bookmarkId);
    
    if (success) {
      showStatus('Bookmark Al-Quran berhasil dihapus', 'success');
      // Refresh daftar bookmark
      await bookmarkService.loadBookmarks();
    } else {
      showStatus('Gagal menghapus bookmark', 'error');
    }
  } catch (err) {
    console.error('Error saat menghapus bookmark Quran:', err);
    showStatus(`Gagal menghapus bookmark: ${err.message || 'Terjadi kesalahan'}`, 'error');
  }
};

// Handler untuk menghapus bookmark Blog
const removeBlogBookmark = async (bookmark) => {
  try {
    // Coba mendapatkan ID bookmark
    let bookmarkId = bookmark.id;
    
    // Jika tidak ada ID langsung, mungkin ID ada di format khusus
    if (!bookmarkId && bookmark.referenceId) {
      bookmarkId = bookmark.referenceId;
    } else if (!bookmarkId && bookmark.blogId) {
      bookmarkId = `blog:${bookmark.blogId}`;
    }
    
    if (!bookmarkId) {
      console.error('Tidak dapat menentukan ID bookmark:', bookmark);
      showStatus('Gagal menghapus bookmark: ID tidak valid', 'error');
      return;
    }
    
    console.log('Menghapus bookmark Blog dengan ID:', bookmarkId);
    
    const success = await bookmarkService.removeBookmark(bookmarkId);
    
    if (success) {
      showStatus('Bookmark Blog berhasil dihapus', 'success');
      // Refresh daftar bookmark
      await bookmarkService.loadBookmarks();
    } else {
      showStatus('Gagal menghapus bookmark', 'error');
    }
  } catch (err) {
    console.error('Error saat menghapus bookmark Blog:', err);
    showStatus(`Gagal menghapus bookmark: ${err.message || 'Terjadi kesalahan'}`, 'error');
  }
};

// Handler untuk event bookmark-deleted dari komponen anak
const handleBookmarkDeleted = async (bookmarkId) => {
  console.log('Bookmark telah dihapus:', bookmarkId);
  
  // Tentukan jenis bookmark untuk pesan
  const isQuranBookmark = typeof bookmarkId === 'string' && bookmarkId.startsWith('quran:');
  
  // Tampilkan notifikasi sukses
  showStatus(`Bookmark ${isQuranBookmark ? 'Al-Quran' : 'Blog'} berhasil dihapus`, 'success');
  
  // Refresh daftar bookmark
  await bookmarkService.loadBookmarks();
};
</script>