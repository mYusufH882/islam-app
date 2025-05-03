<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Blog Islami</h1>
      <p class="text-gray-600">Artikel dan tulisan inspiratif islami</p>
    </div>

    <!-- Search Bar -->
    <div class="mb-6">
      <div class="relative">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Cari artikel..." 
          class="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div class="absolute left-3 top-3 text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Categories -->
    <div class="mb-6 overflow-x-auto">
      <div class="flex space-x-2 pb-2">
        <button 
          @click="selectedCategory = null" 
          :class="[
            'px-4 py-2 rounded-full text-sm whitespace-nowrap',
            selectedCategory === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          ]"
        >
          Semua
        </button>
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'px-4 py-2 rounded-full text-sm whitespace-nowrap',
            selectedCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          ]"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Featured Article -->
    <div v-if="featuredArticle" class="mb-6">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="h-56 bg-gray-200">
          <img 
            v-if="featuredArticle.image" 
            :src="getImageUrl(featuredArticle.image)" 
            :alt="featuredArticle.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-center mb-2">
            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {{ getCategoryName(featuredArticle.categoryId) }}
            </span>
            <span class="ml-2 text-xs text-gray-500">
              {{ formatDate(featuredArticle.date) }}
            </span>
          </div>
          <h2 class="text-xl font-bold mb-2">{{ featuredArticle.title }}</h2>
          <p class="text-gray-600 mb-3 line-clamp-2">{{ featuredArticle.excerpt }}</p>
          <NuxtLink :to="`/blog/${featuredArticle.id}`" class="text-blue-600 font-medium inline-flex items-center">
            Baca Selengkapnya
            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Articles List -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div v-for="article in filteredArticles" :key="article.id" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="flex">
          <div v-if="article.image" class="w-24 h-24 flex-shrink-0 bg-gray-200">
            <img :src="getImageUrl(article.image)" alt="Thumbnail" class="w-full h-full object-cover">
          </div>
          <div v-else class="w-24 h-24 flex-shrink-0 bg-gray-100 flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="p-4 flex-1">
            <div class="flex items-center mb-1">
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {{ getCategoryName(article.categoryId) }}
              </span>
              <span class="ml-2 text-xs text-gray-500">
                {{ formatDate(article.date) }}
              </span>
            </div>
            <h3 class="font-medium mb-1">{{ article.title }}</h3>
            <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ article.excerpt }}</p>
            <NuxtLink :to="`/blog/${article.id}`" class="text-sm text-blue-600">Baca selengkapnya</NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredArticles.length === 0" class="bg-white p-6 rounded-lg shadow text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada artikel ditemukan</h3>
      <p class="mt-1 text-sm text-gray-500">
        Silakan coba kata kunci pencarian lain atau tampilkan semua kategori.
      </p>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMoreArticles" class="mt-6 text-center">
      <button 
        @click="loadMoreArticles"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Muat Artikel Lainnya
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useBlogStore } from '~/stores/blog.store';
import { storeToRefs } from 'pinia';
import { getImageUrl } from '~/utils/imageHelper';

// Initialize blog store
const blogStore = useBlogStore();

// Get reactive state from store
const { 
  blogs, 
  categories: storeCategories, 
  loading, 
  error,
  pagination
} = storeToRefs(blogStore);

// Local state
const searchQuery = ref('');
const selectedCategory = ref(null);
const currentPage = ref(1);
const articlesPerPage = 6;

// Computed properties
const categories = computed(() => storeCategories.value);

const featuredArticle = computed(() => {
  return blogs.value.find(blog => blog.featured);
});

const filteredArticles = computed(() => {
  let filtered = blogs.value;
  
  // Remove featured article
  filtered = filtered.filter(article => !article.featured);
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.excerpt.toLowerCase().includes(query)
    );
  }
  
  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(article => article.categoryId === selectedCategory.value);
  }
  
  // Apply pagination
  return filtered.slice(0, currentPage.value * articlesPerPage);
});

const hasMoreArticles = computed(() => {
  const total = blogs.value.filter(article => !article.featured).length;
  const filtered = filteredArticles.value.length;
  
  // If applying category filter
  if (selectedCategory.value) {
    const categoryTotal = blogs.value.filter(
      article => article.categoryId === selectedCategory.value && !article.featured
    ).length;
    return filtered < categoryTotal;
  }
  
  // If applying search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    const searchTotal = blogs.value.filter(
      article => !article.featured && (
        article.title.toLowerCase().includes(query) || 
        article.excerpt.toLowerCase().includes(query)
      )
    ).length;
    return filtered < searchTotal;
  }
  
  // No filters
  return filtered < total;
});

// Methods
const loadMoreArticles = () => {
  currentPage.value++;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : 'Umum';
};

// Reset pagination when filters change
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1;
});

// Fetch blogs and categories on mount
onMounted(async () => {
  // Fetch data if not already loaded
  if (blogs.value.length === 0) {
    await blogStore.fetchBlogs();
  }
  
  if (categories.value.length === 0) {
    await blogStore.fetchCategories();
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>