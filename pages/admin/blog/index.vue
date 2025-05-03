<template>
  <div>
    <!-- Header dan tombol tambah artikel -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Manajemen Blog</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Kelola artikel blog Islami Anda
        </p>
      </div>
      <NuxtLink
        to="/admin/blog/create"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-primary"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Tambah Artikel
      </NuxtLink>
    </div>

    <!-- Statistik Blog -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-dark-bg-secondary p-4 rounded-lg shadow dark:shadow-gray-800">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Artikel</div>
            <div class="text-lg font-semibold dark:text-white">{{ totalStats.total }}</div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-bg-secondary p-4 rounded-lg shadow dark:shadow-gray-800">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg class="h-6 w-6 text-green-600 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Dipublikasikan</div>
            <div class="text-lg font-semibold dark:text-white">{{ totalStats.published }}</div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-bg-secondary p-4 rounded-lg shadow dark:shadow-gray-800">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
            <svg class="h-6 w-6 text-yellow-600 dark:text-yellow-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Draft</div>
            <div class="text-lg font-semibold dark:text-white">{{ totalStats.draft }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter dan Pencarian -->
    <div class="mb-6 bg-white dark:bg-dark-bg-secondary p-4 shadow dark:shadow-gray-800 sm:rounded-md">
      <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <!-- Search input -->
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cari artikel
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
              placeholder="Cari artikel"
              type="search"
              @input="onSearchInput"
            />
          </div>
        </div>
        
        <!-- Category filter -->
        <Listbox v-model="selectedCategory" as="div" class="w-full md:w-56">
          <ListboxLabel class="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</ListboxLabel>
          <div class="mt-1 relative">
            <ListboxButton class="bg-white dark:bg-dark-bg-primary relative w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <span class="block truncate dark:text-white">{{ selectedCategory.name }}</span>
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
                  v-for="category in categories"
                  :key="category.id"
                  :value="category"
                  v-slot="{ active, selected }"
                >
                  <div :class="[
                    active ? 'text-white bg-blue-600 dark:bg-blue-800' : 'text-gray-900 dark:text-white',
                    'cursor-default select-none relative py-2 pl-3 pr-9'
                  ]">
                    <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                      {{ category.name }}
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
        
        <!-- Status filter -->
        <Listbox v-model="selectedStatus" as="div" class="w-full md:w-56">
          <ListboxLabel class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</ListboxLabel>
          <div class="mt-1 relative">
            <ListboxButton class="bg-white dark:bg-dark-bg-primary relative w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <span class="block truncate dark:text-white">{{ selectedStatus.name }}</span>
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
              <ListboxOptions class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                <ListboxOption
                  v-for="status in statuses"
                  :key="status.id"
                  :value="status"
                  v-slot="{ active, selected }"
                >
                  <div :class="[
                    active ? 'text-white bg-blue-600' : 'text-gray-900',
                    'cursor-default select-none relative py-2 pl-3 pr-9'
                  ]">
                    <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                      {{ status.name }}
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
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      <button @click="fetchBlogs" class="mt-2 text-blue-600 dark:text-blue-400">Coba lagi</button>
    </div>

    <!-- Tabel artikel -->
    <div v-else class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-dark-bg-primary">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Judul
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tanggal Publikasi
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-dark-bg-secondary divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="article in filteredArticles" :key="article.id" class="hover:bg-gray-50 dark:hover:bg-dark-bg-primary">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                        <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ article.title }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          {{ truncateText(article.description, 50) }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{{ article.category }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                          :class="isValidStatus(article.status) 
                            ? (article.status === 'Dipublikasikan' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200') 
                            : ''">
                      {{ article.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ article.date }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex space-x-2 justify-end">
                      <NuxtLink :to="`/admin/blog/${article.id}`" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                        Lihat
                      </NuxtLink>
                      <NuxtLink :to="`/admin/blog/${article.id}/edit`" class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                        Edit
                      </NuxtLink>
                      <button @click="openDeleteModal(article)" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredArticles.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Tidak ada artikel yang ditemukan
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <div v-if="blogs.length > 0 && totalPages > 1" class="flex justify-center mt-6 space-x-2">
      <button 
        @click="setPage(currentPage - 1)" 
        :disabled="currentPage === 1"
        :class="[
          'px-3 py-1 rounded-md',
          currentPage === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'bg-white dark:bg-dark-bg-secondary text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-dark-bg-primary'
        ]"
      >
        &laquo;
      </button>
      
      <button 
        v-for="page in pageNumbers" 
        :key="page"
        :disabled="typeof page === 'string'"
        :class="[
          typeof page === 'string' ? 'cursor-default' : '',
          currentPage === page ? 'bg-blue-600 dark:bg-blue-700 text-white' : 'bg-white dark:bg-dark-bg-secondary text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-dark-bg-primary',
          'px-3 py-1 rounded-md'
        ]"
      >
        {{ page }}
      </button>
      
      <button 
        @click="setPage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
        :class="[
          'px-3 py-1 rounded-md',
          currentPage === totalPages ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'bg-white dark:bg-dark-bg-secondary text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-dark-bg-primary'
        ]"
      >
        &raquo;
      </button>
    </div>

    <!-- Modal konfirmasi hapus -->
    <Dialog :open="isDeleteModalOpen" @close="closeDeleteModal" class="relative z-50">
      <div class="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel class="mx-auto max-w-md rounded-lg bg-white dark:bg-dark-bg-secondary p-6 shadow-xl">
            <DialogTitle class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Hapus Artikel
            </DialogTitle>
            <div class="mt-2">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Apakah Anda yakin ingin menghapus artikel "{{ selectedArticle?.title }}"? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div class="mt-4 flex space-x-2 justify-end">
              <button
                type="button"
                class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                @click="closeDeleteModal"
              >
                Batal
              </button>
              <button
                type="button"
                class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
                @click="deleteArticle"
              >
                Hapus
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { debounce } from 'lodash';
import { useBlogStore } from '~/stores/blog.store';
import { storeToRefs } from 'pinia';
import { useApi } from '~/composables/useApi';

// Define layout for this page
definePageMeta({
  layout: 'admin'
});

// Initialize blog store
const blogStore = useBlogStore();

// Destructure store state with storeToRefs to maintain reactivity
const { 
  blogs, 
  categories: storeCategories, 
  loading, 
  error, 
  pagination,
  searchQuery: storeSearchQuery,
  categoryFilter: storeCategoryFilter,
  statusFilter: storeStatusFilter
} = storeToRefs(blogStore);

// Local reactive state
const searchQuery = ref('');
const isDeleteModalOpen = ref(false);
const selectedArticle = ref(null);

const totalStats = ref({
  total: 0,
  published: 0,
  draft: 0
});

// Status filter options - with null value for "All"
const statuses = ref([
  { id: 0, value: null, name: 'Semua Status' },
  { id: 1, value: 'published', name: 'Dipublikasikan' },
  { id: 2, value: 'draft', name: 'Draft' }
]);

// Set default filters and fetch initial data
// Use useLazyAsyncData instead of onMounted for initial data loading
const { pending } = useLazyAsyncData('blogInitialData', async () => {
  // Clear filters to show all blogs
  storeStatusFilter.value = null;
  storeCategoryFilter.value = null;
  storeSearchQuery.value = '';
  searchQuery.value = '';
  
  try {
    // Fetch categories and blogs
    await Promise.all([
      blogStore.fetchCategories(),
      blogStore.fetchBlogs()
    ]);
    
    // Fetch statistics
    await fetchBlogStats();
    return null;
  } catch (error) {
    console.error('Error initializing blog data:', error);
    return null;
  }
});

// Function to fetch blog statistics
const fetchBlogStats = async () => {
  try {
    const { apiFetch } = useApi();
    const { data, error: statsError } = await apiFetch('/blogs/stats');
    
    if (statsError.value) {
      console.error('Error fetching blog stats:', statsError.value);
      return;
    }
    
    if (data.value && data.value.success) {
      totalStats.value = data.value.data;
    }
  } catch (err) {
    console.error('Error fetching blog stats:', err);
  }
};

// Category filter
const categories = computed(() => {
  const allCategories = { id: 0, name: 'Semua Kategori' };
  return [allCategories, ...storeCategories.value];
});

// Selected filters with computed getters/setters
const selectedStatus = computed({
  get: () => {
    const currentStatus = storeStatusFilter.value;
    return statuses.value.find(status => status.value === currentStatus) || statuses.value[0];
  },
  set: (status) => {
    storeStatusFilter.value = status.value;
    blogStore.fetchBlogs();
  }
});

const selectedCategory = computed({
  get: () => {
    const currentCategoryId = storeCategoryFilter.value;
    if (!currentCategoryId) return categories.value[0];
    
    const category = categories.value.find(cat => cat.id === currentCategoryId);
    return category || categories.value[0];
  },
  set: (category) => {
    storeCategoryFilter.value = category.id === 0 ? null : category.id;
    blogStore.fetchBlogs();
  }
});

// Computed properties for articles
const filteredArticles = computed(() => {
  return blogs.value.map(blog => ({
    id: blog.id,
    title: blog.title,
    description: blog.content ? getExcerpt(blog.content) : '',
    category: blog.category?.name || 'Tidak ada kategori',
    status: blog.status === 'published' ? 'Dipublikasikan' : 'Draft',
    date: formatDate(blog.publishedAt || blog.createdAt)
  }));
});

// Pagination
const currentPage = computed(() => pagination.value.page);
const totalPages = computed(() => pagination.value.totalPages);

// Generate page numbers array
const pageNumbers = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  
  if (totalPages.value <= maxVisiblePages) {
    // Show all pages if there are fewer than maxVisiblePages
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);
    
    // Calculate start and end of pages to show
    let startPage = Math.max(2, currentPage.value - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages.value - 1, startPage + maxVisiblePages - 3);
    
    // Adjust if we're near the beginning
    if (currentPage.value <= Math.floor(maxVisiblePages / 2)) {
      endPage = maxVisiblePages - 1;
    }
    
    // Adjust if we're near the end
    if (currentPage.value > totalPages.value - Math.floor(maxVisiblePages / 2)) {
      startPage = totalPages.value - maxVisiblePages + 2;
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages.value - 1) {
      pages.push('...');
    }
    
    // Always show last page
    pages.push(totalPages.value);
  }
  
  return pages;
});

// TypeScript helper for status
const isValidStatus = (status) => {
  return Object.keys(statusClasses).includes(status);
};

// Classes for article status with dark mode support
const statusClasses = {
  'Dipublikasikan': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Draft': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
};

// Event handlers
const onSearchInput = debounce(() => {
  storeSearchQuery.value = searchQuery.value;
  blogStore.fetchBlogs();
}, 300);

const setPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  blogStore.setPage(page);
};

// Methods for managing blog articles
const fetchBlogs = async () => {
  try {
    await blogStore.fetchBlogs();
  } catch (err) {
    console.error('Error fetching blogs:', err);
  }
};

// Watch for changes in store query to sync with local state
watch(storeSearchQuery, (newValue) => {
  searchQuery.value = newValue;
});

const openDeleteModal = (article) => {
  selectedArticle.value = article;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedArticle.value = null;
};

const deleteArticle = async () => {
  if (selectedArticle.value) {
    try {
      const success = await blogStore.deleteBlog(selectedArticle.value.id);
      if (success) {
        closeDeleteModal();
      }
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  }
};

// Helper functions
const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const formatDate = (dateString) => {
  if (!dateString) return 'Belum dipublikasikan';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (err) {
    return 'Tanggal tidak valid';
  }
};

const getExcerpt = (content) => {
  if (!content) return '';
  
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>?/gm, '');
  
  // Take first 150 characters
  return truncateText(plainText, 150);
};
</script>