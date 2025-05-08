<template>
    <div class="mb-6">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold">Artikel Terbaru</h3>
        <NuxtLink to="/blog" class="text-sm text-blue-600 flex items-center">
          Semua Artikel
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
      
      <!-- Skeleton loader for articles -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="bg-white p-3 rounded-lg shadow flex items-center space-x-3">
          <div class="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 animate-pulse"></div>
          <div class="flex-1">
            <div class="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
          </div>
        </div>
      </div>
      
      <div v-else-if="error" class="p-4 bg-white rounded-lg shadow text-center">
        <p class="text-red-600 mb-2">{{ error }}</p>
        <button @click="$emit('refresh')" class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
          Coba lagi
        </button>
      </div>
      
      <div v-else class="space-y-3">
        <div 
          v-for="article in articles" 
          :key="article.id" 
          class="bg-white p-3 rounded-lg shadow flex items-start space-x-3 relative">
          <div class="w-16 h-16 flex-shrink-0 overflow-hidden bg-gray-200 rounded-md">
            <img 
              v-if="article.image" 
              :src="getImageUrl(article.image)" 
              :alt="article.title"
              class="w-full h-full object-cover" 
              loading="lazy"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div class="flex-1">
            <h4 class="font-medium">{{ article.title }}</h4>
            <p class="text-sm text-gray-600 mb-2 line-clamp-2">
              {{ truncateText(article.content, 100) }}
            </p>
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-500">{{ formatArticleDate(article.publishedAt) }}</p>
              <NuxtLink :to="`/blog/${article.id}`" class="text-sm text-blue-600">Baca Selengkapnya</NuxtLink>
            </div>
          </div>
          
          <!-- Add bookmark icon with absolute positioning -->
          <div class="absolute top-2 right-2">
            <BlogBookmarkIcon
              :is-bookmarked="isArticleBookmarked(article.id)"
              :blog-id="article.id"
              :blog-title="article.title"
              :blog-excerpt="article.excerpt || truncateText(article.content, 100)"
              :blog-image="article.image"
              @update:bookmark="handleBookmarkUpdate($event, article.id)"
            />
          </div>
        </div>
        
        <div v-if="articles.length === 0" class="bg-white p-4 rounded-lg shadow text-center">
          <p class="text-gray-500">Belum ada artikel</p>
        </div>
        
        <!-- Conditional "Update Articles" button -->
        <div v-if="hasNew" class="text-center pt-2">
          <button 
            @click="$emit('refresh')" 
            :disabled="refreshing"
            class="px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors duration-300"
          >
            <span v-if="refreshing">
              <svg class="inline-block w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memperbarui...
            </span>
            <span v-else>Perbarui Artikel</span>
          </button>
        </div>
      </div>
    </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { getImageUrl } from '~/utils/imageHelper';
  import { useUserDashboard } from '~/composables/useUserDashboard';
  import BlogBookmarkIcon from '~/components/blog/BlogBookmarkIcon.vue';
  
  const props = defineProps({
    articles: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    },
    refreshing: {
      type: Boolean,
      default: false
    },
    hasNew: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['refresh', 'bookmark']);
  
  // Get the formatArticleDate function from the composable
  const { formatArticleDate } = useUserDashboard();
  
  // Memori bookmark state dengan Map untuk performa yang lebih baik
  const bookmarkState = new Map();
  
  // Check if article is bookmarked - use efficient lookup
  const isArticleBookmarked = (articleId) => {
    // If we have cached the state, use it
    if (bookmarkState.has(articleId)) {
      return bookmarkState.get(articleId);
    }
    
    // Default is false
    return false;
  };
  
  // Handle bookmark update events
  const handleBookmarkUpdate = (event, articleId) => {
    // Update local cache
    bookmarkState.set(articleId, event.action === 'add');
    
    // Emit up to parent
    emit('bookmark', event);
  };
  
  // Truncate text function with memoization 
  const truncateCache = new Map();
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    
    // Create a cache key
    const cacheKey = `${text.substring(0, 20)}:${maxLength}`;
    
    // Check cache
    if (truncateCache.has(cacheKey)) {
      return truncateCache.get(cacheKey);
    }
    
    // Strip HTML tags
    const strippedText = text.replace(/<[^>]*>/g, '');
    
    if (strippedText.length <= maxLength) {
      truncateCache.set(cacheKey, strippedText);
      return strippedText;
    }
    
    // Find last space
    const lastSpace = strippedText.substring(0, maxLength).lastIndexOf(' ');
    const result = strippedText.substring(0, lastSpace > 0 ? lastSpace : maxLength);
    
    // Save to cache and return
    truncateCache.set(cacheKey, result);
    return result;
  };
</script>

<style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
  }
</style>