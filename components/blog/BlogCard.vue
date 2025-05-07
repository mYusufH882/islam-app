<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="relative">
      <!-- Image section -->
      <div class="h-40 bg-gray-200">
        <img 
          v-if="blog.image" 
          :src="getImageUrl(blog.image)" 
          :alt="blog.title"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      
      <!-- Bookmark icon (absolute positioning) -->
      <div class="absolute top-2 right-2">
        <BlogBookmarkIcon
          :is-bookmarked="isBlogBookmarked(blog.id)"
          :blog-id="blog.id"
          :blog-title="blog.title"
          :blog-excerpt="blog.excerpt || truncateText(blog.content, 100)"
          :blog-image="blog.image"
          @update:bookmark="handleBookmarkUpdate"
        />
      </div>
    </div>
    
    <!-- Content section -->
    <div class="p-4">
      <div class="flex items-center mb-2">
        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {{ getCategoryName(blog.categoryId) }}
        </span>
        <span class="ml-2 text-xs text-gray-500">
          {{ formatDate(blog.publishedAt || blog.date) }}
        </span>
      </div>
      
      <h3 class="font-medium mb-2">{{ blog.title }}</h3>
      
      <p class="text-sm text-gray-600 mb-3 line-clamp-2">
        {{ truncateText(blog.content, 100) }}
        <span v-if="(blog.content || '').length > 100" class="text-gray-400">...</span>
      </p>
      
      <NuxtLink :to="`/blog/${blog.id}`" class="text-blue-600 font-medium inline-flex items-center">
        Baca Selengkapnya
        <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { getImageUrl } from '~/utils/imageHelper';
import { useBookmarkService } from '~/composables/useBookmarkService';
import BlogBookmarkIcon from '~/components/blog/BlogBookmarkIcon.vue';

const props = defineProps({
  blog: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['bookmark-updated']);
const bookmarkService = useBookmarkService();

// Helper function to get category name
const getCategoryName = (categoryId) => {
  const category = props.categories.find(c => c.id === categoryId);
  return category ? category.name : 'Umum';
};

// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return '';
  
  // Strip HTML tags if present
  const strippedText = text.replace(/<[^>]*>/g, '');
  
  // If the text is already shorter than maxLength, return it as is
  if (strippedText.length <= maxLength) {
    return strippedText;
  }
  
  // Find the last space before maxLength to avoid cutting words
  const lastSpace = strippedText.substring(0, maxLength).lastIndexOf(' ');
  
  // If no space found, just cut at maxLength
  return strippedText.substring(0, lastSpace > 0 ? lastSpace : maxLength);
};

// Check if blog is bookmarked
const isBlogBookmarked = (blogId) => {
  return bookmarkService.isBlogBookmarked(blogId);
};

// Handle bookmark update
const handleBookmarkUpdate = (event) => {
  emit('bookmark-updated', event);
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>