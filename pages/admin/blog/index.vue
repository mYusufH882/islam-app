<template>
    <div>
      <div class="mb-6 flex justify-between items-center">
        <div>
          <p class="mt-1 text-sm text-gray-600">
            Kelola artikel blog Islami Anda
          </p>
        </div>
        <NuxtLink
          to="/admin/blog/create"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Tambah Artikel
        </NuxtLink>
      </div>
  
      <!-- Filter dan Pencarian -->
      <div class="mb-6 bg-white p-4 shadow sm:rounded-md">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="search" class="sr-only">Cari artikel</label>
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
                placeholder="Cari artikel"
                type="search"
              />
            </div>
          </div>
          <Listbox v-model="selectedCategory" as="div" class="w-56">
            <ListboxLabel class="block text-sm font-medium text-gray-700">Kategori</ListboxLabel>
            <div class="mt-1 relative">
              <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <span class="block truncate">{{ selectedCategory.name }}</span>
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
                    v-for="category in categories"
                    :key="category.id"
                    :value="category"
                    v-slot="{ active, selected }"
                  >
                    <div :class="[
                      active ? 'text-white bg-blue-600' : 'text-gray-900',
                      'cursor-default select-none relative py-2 pl-3 pr-9'
                    ]">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                        {{ category.name }}
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
  
      <!-- Tabel artikel -->
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Judul
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Publikasi
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="article in filteredArticles" :key="article.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                          <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ article.title }}
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ truncateText(article.description, 50) }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ article.category }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="isValidStatus(article.status) ? statusClasses[article.status] : ''">
                        {{ article.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ article.date }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex space-x-2 justify-end">
                        <NuxtLink :to="`/admin/blog/${article.id}/edit`" class="text-blue-600 hover:text-blue-900">
                          Edit
                        </NuxtLink>
                        <button @click="openDeleteModal(article)" class="text-red-600 hover:text-red-900">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredArticles.length === 0">
                    <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                      Tidak ada artikel yang ditemukan
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal konfirmasi hapus -->
      <Dialog :open="isDeleteModalOpen" @close="closeDeleteModal" class="relative z-50">
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
  
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
              <DialogTitle class="text-lg font-medium leading-6 text-gray-900">
                Hapus Artikel
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus artikel "{{ selectedArticle?.title }}"? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
  
              <div class="mt-4 flex space-x-2 justify-end">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  @click="closeDeleteModal"
                >
                  Batal
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
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
  import { ref, computed } from 'vue'
  
  // Definisikan layout untuk halaman ini
  definePageMeta({
    layout: 'admin'
  })
  
  // Define interfaces for type safety
  interface Category {
    id: number;
    name: string;
  }
  
  interface Article {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string; // Changed from ArticleStatus to string to avoid indexing issues
    date: string;
  }
  
  // Data dummy untuk artikel
  const articles = ref<Article[]>([
    {
      id: 1,
      title: 'Keutamaan Puasa Senin Kamis',
      description: 'Artikel ini membahas berbagai keutamaan puasa Senin Kamis berdasarkan hadits-hadits shahih.',
      category: 'Ibadah',
      status: 'Dipublikasikan',
      date: '20 April 2025'
    },
    {
      id: 2,
      title: 'Jadwal Kajian Ramadhan',
      description: 'Jadwal lengkap kajian Ramadhan di Masjid Pemuda Persis Cimsel tahun 2025.',
      category: 'Informasi',
      status: 'Dipublikasikan',
      date: '18 April 2025'
    },
    {
      id: 3,
      title: 'Fadhilah Membaca Al-Quran',
      description: 'Artikel ini membahas berbagai keutamaan dan fadhilah membaca Al-Quran dalam kehidupan sehari-hari.',
      category: 'Al-Quran',
      status: 'Dipublikasikan',
      date: '16 April 2025'
    },
    {
      id: 4,
      title: 'Tata Cara Sholat Tarawih',
      description: 'Penjelasan lengkap mengenai tata cara sholat tarawih sesuai dengan sunnah Rasulullah SAW.',
      category: 'Ibadah',
      status: 'Draft',
      date: '15 April 2025'
    },
    {
      id: 5,
      title: 'Kisah Para Sahabat Nabi',
      description: 'Cerita inspiratif dari kehidupan para sahabat Nabi Muhammad SAW yang dapat kita teladani.',
      category: 'Kisah',
      status: 'Draft',
      date: '14 April 2025'
    }
  ])
  
  // Data kategori
  const categories = ref<Category[]>([
    { id: 0, name: 'Semua Kategori' },
    { id: 1, name: 'Ibadah' },
    { id: 2, name: 'Al-Quran' },
    { id: 3, name: 'Informasi' },
    { id: 4, name: 'Kisah' }
  ])
  
  // State untuk filter
  const searchQuery = ref('')
  const selectedCategory = ref<Category>(categories.value[0])
  
  // Artikel yang terfilter berdasarkan pencarian dan kategori
  const filteredArticles = computed(() => {
    let result = articles.value
  
    // Filter berdasarkan pencarian
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.description.toLowerCase().includes(query)
      )
    }
  
    // Filter berdasarkan kategori
    if (selectedCategory.value.id !== 0) { // 0 adalah 'Semua Kategori'
      result = result.filter(article => 
        article.category === selectedCategory.value.name
      )
    }
  
    return result
  })
  
  // Kelas warna untuk status artikel - using Record for type safety
  // Kelas warna untuk status artikel
const statusClasses = {
    'Dipublikasikan': 'bg-green-100 text-green-800',
    'Draft': 'bg-yellow-100 text-yellow-800'
  } as const

// Type guard untuk memeriksa apakah status valid
const isValidStatus = (status: string): status is keyof typeof statusClasses => {
  return status in statusClasses
}
  
  // Modal konfirmasi hapus
  const isDeleteModalOpen = ref(false)
  const selectedArticle = ref<Article | null>(null)
  
  const openDeleteModal = (article: Article): void => {
    selectedArticle.value = article
    isDeleteModalOpen.value = true
  }
  
  const closeDeleteModal = (): void => {
    isDeleteModalOpen.value = false
    selectedArticle.value = null
  }
  
  const deleteArticle = (): void => {
    if (selectedArticle.value) {
      const articleId = selectedArticle.value.id
      articles.value = articles.value.filter(article => article.id !== articleId)
      closeDeleteModal()
    }
  }
  
  /**
   * Fungsi untuk memotong teks yang terlalu panjang
   * @param text Teks yang akan dipotong
   * @param maxLength Panjang maksimal teks yang diinginkan
   * @returns Teks yang sudah dipotong sesuai dengan panjang maksimal
   */
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }
</script>