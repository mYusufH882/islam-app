// components/blog/BlogPage.vue
<template>
  <ClientOnly>
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

      <!-- Rest of component content remains the same -->
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Search
const searchQuery = ref('');

// Categories
const selectedCategory = ref(null);
const categories = ref([
  { id: 1, name: 'Aqidah' },
  { id: 2, name: 'Fiqih' },
  { id: 3, name: 'Akhlak' },
  { id: 4, name: 'Sirah' },
  { id: 5, name: 'Kajian' }
]);

// Article data (mock data for now)
const articles = ref([
  // Your existing articles data
]);

// Pagination
const articlesPerPage = 4;
const currentPage = ref(1);

// Featured article and filtered articles
const featuredArticle = computed(() => {
  return articles.value.find(article => article.featured);
});

const filteredArticles = computed(() => {
  let filtered = articles.value;
  
  // Remove featured article from the list
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
  
  // Return only current page articles
  return filtered.slice(0, currentPage.value * articlesPerPage);
});

// Rest of your component logic remains the same
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>