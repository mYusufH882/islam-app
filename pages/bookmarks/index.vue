<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Manajemen Bookmark</h1>
        <p class="mt-1 text-sm text-gray-600">
          Lihat bookmark yang dilakukan oleh pengguna
        </p>
      </div>
    </div>

    <!-- Filter dan Pencarian -->
    <div class="mb-6 bg-white p-4 shadow sm:rounded-md">
      <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <!-- Search input -->
        <div class="flex-1">
          <label for="search" class="sr-only">Cari bookmark</label>
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              id="search"
              v-model="searchQuery"
              class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Cari pengguna atau referensi"
              type="search"
              @input="onSearchInput"
            />
          </div>
        </div>
        
        <!-- Type filter -->
        <Listbox v-model="selectedType" as="div" class="w-full md:w-56">
          <ListboxLabel class="block text-sm font-medium text-gray-700">Tipe Bookmark</ListboxLabel>
          <div class="mt-1 relative">
            <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <span class="block truncate">{{ selectedType.name }}</span>
              <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </ListboxButton>

            <Transition
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                <ListboxOption
                  v-for="type in bookmarkTypes"
                  :key="type.id"
                  :value="type"
                  v-slot="{ active, selected }"
                >
                  <div :class="[
                    active ? 'text-white bg-blue-600' : 'text-gray-900',
                    'cursor-default select-none relative py-2 pl-3 pr-9'
                  ]">
                    <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                      {{ type.name }}
                    </span>

                    <span
                      v-if="selected"
                      :class="[
                        active ? 'text-white' : 'text-blue-600',
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
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg mb-6">
      <p class="text-red-600">{{ error }}</p>
      <button @click="fetchBookmarks" class="mt-2 text-blue-600">Coba lagi</button>
    </div>

    <!-- Tabel bookmark -->
    <div v-else class="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pengguna
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipe
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Referensi
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal Dibuat
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Catatan
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bookmark, index) in bookmarks" :key="index" class="odd:bg-white even:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {{ getUserInitials(bookmark.user.name) }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ bookmark.user.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ bookmark.user.email }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getTypeClass(bookmark.type)">
                {{ getTypeLabel(bookmark.type) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ bookmark.referenceId }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(bookmark.createdAt) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
              {{ bookmark.notes || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="deleteBookmark(bookmark.id)" class="text-red-600 hover:text-red-900">
                Hapus
              </button>
            </td>
          </tr>
          <tr v-if="bookmarks.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              Tidak ada bookmark yang ditemukan
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="bookmarks.length > 0 && pagination.totalPages > 1" class="mt-4 flex items-center justify-between">
      <div class="flex items-center">
        <span class="text-sm text-gray-700">
          Menampilkan <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span> hingga 
          <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> dari 
          <span class="font-medium">{{ pagination.total }}</span> bookmark
        </span>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="prevPage" 
          class="px-3 py-1 border rounded-md text-sm text-gray-700"
          :disabled="pagination.page === 1"
          :class="[pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : '']"
        >
          Sebelumnya
        </button>
        <button 
          @click="nextPage" 
          class="px-3 py-1 border rounded-md text-sm text-gray-700"
          :disabled="pagination.page === pagination.totalPages"
          :class="[pagination.page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : '']"
        >
          Berikutnya
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <Dialog :open="showDeleteModal" @close="cancelDelete" class="relative z-50">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle class="text-lg font-medium leading-6 text-gray-900">
            Konfirmasi Hapus Bookmark
          </DialogTitle>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Apakah Anda yakin ingin menghapus bookmark ini? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          
          <div class="mt-6 flex justify-end space-x-2">
            <button
              @click="cancelDelete"
              class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Batal
            </button>
            <button
              @click="confirmDelete"
              class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useApi } from '@/composables/useApi';
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
  user: User;
  type: 'blog' | 'quran' | 'prayer';
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
  { id: 3, name: 'Jadwal Sholat', value: 'prayer' }
];
const selectedType = ref(bookmarkTypes[0]);

// Delete modal state
const showDeleteModal = ref(false);
const bookmarkToDelete = ref<number | null>(null);
const deleting = ref(false);

// Fetch bookmarks
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
    
    const { data, error: fetchError } = await apiFetch<{
      bookmarks: Bookmark[];
      pagination: Pagination;
    }>('/admin/bookmarks', {
      params
    });
    
    if (fetchError.value) {
      throw new Error(fetchError.value.message);
    }
    
    if (data.value && data.value.success) {
      bookmarks.value = data.value.data.bookmarks;
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
    
    const { data, error: deleteError } = await apiFetch(`/admin/bookmarks/${bookmarkToDelete.value}`, {
      method: 'DELETE'
    });
    
    if (deleteError.value) {
      throw new Error(deleteError.value.message);
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

// Helper functions
const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const getTypeClass = (type: string): string => {
  switch (type) {
    case 'blog':
      return 'bg-blue-100 text-blue-800';
    case 'quran':
      return 'bg-green-100 text-green-800';
    case 'prayer':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'blog':
      return 'Blog';
    case 'quran':
      return 'Al-Quran';
    case 'prayer':
      return 'Jadwal Sholat';
    default:
      return type;
  }
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