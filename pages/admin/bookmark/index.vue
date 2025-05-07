<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <div class="mb-2">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Manajemen Bookmark</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Lihat bookmark yang dilakukan oleh pengguna</p>
      </div>
    </div>

    <!-- Filter dan Pencarian -->
    <div class="mb-6 bg-white dark:bg-dark-bg-secondary p-4 shadow dark:shadow-gray-800 sm:rounded-md">
      <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <!-- Search input -->
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cari bookmark
          </label>
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              id="search"
              v-model="searchQuery"
              class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md"
              placeholder="Cari pengguna atau referensi"
              type="search"
              @input="onSearchInput"
            />
          </div>
        </div>
        
        <!-- Type filter -->
        <Listbox v-model="selectedType" as="div" class="w-full md:w-56">
          <ListboxLabel class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipe
          </ListboxLabel>
          <div class="mt-1 relative">
            <ListboxButton class="bg-white dark:bg-dark-bg-primary relative w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <span class="block truncate dark:text-white">{{ selectedType.name }}</span>
              <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </ListboxButton>

            <Transition
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions class="absolute z-10 mt-1 w-full bg-white dark:bg-dark-bg-secondary shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                <ListboxOption
                  v-for="type in bookmarkTypes"
                  :key="type.id"
                  :value="type"
                  v-slot="{ active, selected }"
                >
                  <div :class="[
                    active ? 'text-white bg-blue-600 dark:bg-blue-800' : 'text-gray-900 dark:text-white',
                    'cursor-default select-none relative py-2 pl-3 pr-9'
                  ]">
                    <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                      {{ type.name }}
                    </span>

                    <span
                      v-if="selected"
                      :class="[
                        active ? 'text-white' : 'text-blue-600 dark:text-blue-400',
                        'absolute inset-y-0 right-0 flex items-center pr-4'
                      ]"
                    >
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </ListboxOption>
              </ListboxOptions>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      <button @click="fetchBookmarks" class="mt-2 text-blue-600 dark:text-blue-400">Coba lagi</button>
    </div>

    <!-- Tabel bookmark -->
    <div v-else class="bg-white dark:bg-dark-bg-secondary shadow dark:shadow-gray-800 overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-dark-bg-primary">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Pengguna
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tipe
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Referensi
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tanggal Dibuat
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Catatan
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bookmark, index) in bookmarks" :key="index" class="odd:bg-white odd:dark:bg-dark-bg-secondary even:bg-gray-50 even:dark:bg-dark-bg-primary">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <!-- Gunakan helper function untuk mendapatkan inisial -->
                    {{ bookmark.User?.name ? getUserInitials(bookmark.User.name) : 
                      (bookmark.user?.name ? getUserInitials(bookmark.user.name) : 'UN') }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    <!-- Gunakan helper function untuk mendapatkan nama user -->
                    {{ getUserName(bookmark) }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    <!-- Gunakan helper function untuk mendapatkan email -->
                    {{ getUserEmail(bookmark) }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getTypeClass(bookmark.type)">
                {{ getTypeLabel(bookmark.type) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ bookmark.referenceId }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(bookmark.createdAt) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
              {{ bookmark.notes || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="deleteBookmark(bookmark.id)" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                Hapus
              </button>
            </td>
          </tr>
          <tr v-if="bookmarks.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
              Tidak ada bookmark yang ditemukan
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="bookmarks.length > 0 && pagination.totalPages > 1" class="mt-4 flex items-center justify-between">
      <div class="flex items-center">
        <span class="text-sm text-gray-700 dark:text-gray-300">
          Menampilkan <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span> hingga 
          <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> dari 
          <span class="font-medium">{{ pagination.total }}</span> bookmark
        </span>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="prevPage" 
          class="px-3 py-1 border rounded-md text-sm text-gray-700 dark:text-gray-300 dark:border-gray-700"
          :disabled="pagination.page === 1"
          :class="[pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-dark-bg-primary']"
        >
          Sebelumnya
        </button>
        <button 
          @click="nextPage" 
          class="px-3 py-1 border rounded-md text-sm text-gray-700 dark:text-gray-300 dark:border-gray-700"
          :disabled="pagination.page === pagination.totalPages"
          :class="[pagination.page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-dark-bg-primary']"
        >
          Berikutnya
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <Dialog :open="showDeleteModal" @close="cancelDelete" class="relative z-50">
      <div class="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
      
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="mx-auto max-w-md rounded-lg bg-white dark:bg-dark-bg-secondary p-6 shadow-xl">
          <DialogTitle class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Konfirmasi Hapus Bookmark
          </DialogTitle>
          <div class="mt-2">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Apakah Anda yakin ingin menghapus bookmark ini? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          
          <div class="mt-6 flex justify-end space-x-2">
            <button
              @click="cancelDelete"
              class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg-primary px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-dark-bg-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
            >
              Batal
            </button>
            <button
              @click="confirmDelete"
              class="inline-flex justify-center rounded-md border border-transparent bg-red-600 dark:bg-red-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
              :disabled="deleting"
            >
              <svg v-if="deleting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Hapus
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </div>
</template>

// Perbaikan pada index.vue (frontend) tanpa mengubah backend

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useApi } from '~/composables/useApi';
import { debounce } from 'lodash';

// Definisikan layout untuk halaman ini
definePageMeta({
  layout: 'admin'
});

// Interface untuk bookmark
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Bookmark {
  id: number;
  userId: number;
  User?: User; // Perhatikan huruf kapital 'U' jika backend menggunakan auto-include
  user?: User; // Alternatif dengan huruf kecil
  type: 'blog' | 'quran';
  referenceId: string;
  notes?: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// State
const bookmarks = ref<Bookmark[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const pagination = ref<Pagination>({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0
});

// Filter state
const searchQuery = ref('');
const bookmarkTypes = [
  { id: 0, name: 'Semua Tipe', value: '' },
  { id: 1, name: 'Blog', value: 'blog' },
  { id: 2, name: 'Al-Quran', value: 'quran' },
];
const selectedType = ref(bookmarkTypes[0]);

// Delete modal state
const showDeleteModal = ref(false);
const bookmarkToDelete = ref<number | null>(null);
const deleting = ref(false);

// Fetch bookmarks - Disesuaikan dengan struktur API backend
const fetchBookmarks = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const { apiFetch } = useApi();
    
    // Build query params
    const params: Record<string, any> = {
      page: pagination.value.page,
      limit: pagination.value.limit
    };
    
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    
    if (selectedType.value.value) {
      params.type = selectedType.value.value;
    }
    
    // Gunakan endpoint yang disediakan oleh backend
    const { data, error: fetchError } = await apiFetch<{
      bookmarks: Bookmark[];
      pagination: Pagination;
    }>('/bookmarks/admin/bookmarks', {
      params
    });
    
    if (fetchError.value) {
      throw new Error(fetchError.value.message || 'Error fetching bookmarks');
    }
    
    if (data.value && data.value.success) {
      // Proses data sebelum disimpan ke state
      // Pastikan setiap bookmark memiliki properti user yang dapat diakses
      bookmarks.value = data.value.data.bookmarks.map((bookmark) => {
        // Periksa apakah backend mengirim User (huruf kapital) atau user (huruf kecil)
        // Dan normalisasi ke properti 'user' (huruf kecil) untuk konsistensi di frontend
        if (bookmark.User && !bookmark.user) {
          bookmark.user = bookmark.User;
        }
        
        return bookmark;
      });
      
      pagination.value = data.value.data.pagination;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (err: any) {
    error.value = err.message || 'Terjadi kesalahan saat mengambil data bookmark';
    console.error('Error fetching bookmarks:', err);
  } finally {
    loading.value = false;
  }
};

// Debounced search
const onSearchInput = debounce(() => {
  pagination.value.page = 1;
  fetchBookmarks();
}, 300);

// Watch untuk filter tipe bookmark
watch(selectedType, () => {
  pagination.value.page = 1;
  fetchBookmarks();
});

// Pagination handlers
const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++;
    fetchBookmarks();
  }
};

const prevPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--;
    fetchBookmarks();
  }
};

// Delete handlers
const deleteBookmark = (id: number) => {
  bookmarkToDelete.value = id;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  bookmarkToDelete.value = null;
  showDeleteModal.value = false;
};

const confirmDelete = async () => {
  if (!bookmarkToDelete.value) return;
  
  deleting.value = true;
  
  try {
    const { apiFetch } = useApi();
    
    // Gunakan endpoint yang disediakan oleh backend
    const { data, error: deleteError } = await apiFetch(`/bookmarks/admin/bookmarks/${bookmarkToDelete.value}`, {
      method: 'DELETE'
    });
    
    if (deleteError.value) {
      throw new Error(deleteError.value.message || 'Error deleting bookmark');
    }
    
    if (data.value && data.value.success) {
      // Refresh bookmarks list
      await fetchBookmarks();
      showDeleteModal.value = false;
    } else {
      throw new Error('Failed to delete bookmark');
    }
  } catch (err: any) {
    error.value = err.message || 'Terjadi kesalahan saat menghapus bookmark';
    console.error('Error deleting bookmark:', err);
  } finally {
    deleting.value = false;
    bookmarkToDelete.value = null;
  }
};

// Helper functions - Perbarui untuk mendukung struktur objek bookmark yang berbeda
const getUserInitials = (name: string): string => {
  if (!name) return 'UN'; // Return default if name is undefined
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Helper function untuk mendapatkan nama user dari bookmark
const getUserName = (bookmark: Bookmark): string => {
  // Periksa apakah bookmark memiliki User (huruf kapital) atau user (huruf kecil)
  if (bookmark.User && bookmark.User.name) {
    return bookmark.User.name;
  }
  
  if (bookmark.user && bookmark.user.name) {
    return bookmark.user.name;
  }
  
  // Jika relasi tidak ada, coba lihat userId
  if (bookmark.userId) {
    return `User ID: ${bookmark.userId}`;
  }
  
  return 'Pengguna Tidak Diketahui';
};

// Helper function untuk mendapatkan email user dari bookmark
const getUserEmail = (bookmark: Bookmark): string => {
  // Periksa apakah bookmark memiliki User (huruf kapital) atau user (huruf kecil)
  if (bookmark.User && bookmark.User.email) {
    return bookmark.User.email;
  }
  
  if (bookmark.user && bookmark.user.email) {
    return bookmark.user.email;
  }
  
  return '-';
};

const getTypeClass = (type: string): string => {
  const typeClasses: Record<string, string> = {
    'blog': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'quran': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  return typeClasses[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
};

const getTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    'blog': 'Blog',
    'quran': 'Al-Quran',
  };

  return typeLabels[type] || type;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Fetch bookmarks when component is mounted
onMounted(() => {
  fetchBookmarks();
});
</script>