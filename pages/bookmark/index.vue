<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import BookmarkList from '~/components/quran/BookmarkList.vue';

const router = useRouter();
const authStore = useAuthStore();
const activeTab = ref('quran');

// State untuk mengontrol pemberitahuan akses ditolak
const accessDenied = ref(false);

// Periksa autentikasi pada mounting komponen
onMounted(() => {
  // Jika pengguna belum login, tampilkan pemberitahuan
  if (!authStore.isAuthenticated) {
    accessDenied.value = true;
  }
});

// Fungsi untuk melakukan redirect manual
const goToLogin = () => {
  router.push('/auth/login?redirect=/bookmark');
};
</script>

<template>
  <div>
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

      <!-- Quran Bookmarks Section -->
      <div class="mb-6">
        <BookmarkList />
      </div>
    </div>
  </div>
</template>