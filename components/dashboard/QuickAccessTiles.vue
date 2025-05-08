<template>
    <div class="grid grid-cols-2 gap-4 mb-6">
      <NuxtLink to="/quran" class="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50 transition-colors">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 mb-2 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span class="font-medium">Al-Quran</span>
        </div>
      </NuxtLink>
      
      <NuxtLink to="/prayer-times" class="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50 transition-colors">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 mb-2 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="font-medium">Jadwal Salat</span>
        </div>
      </NuxtLink>
      
      <NuxtLink to="/blog" class="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50 transition-colors">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 mb-2 bg-purple-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <span class="font-medium">Blog</span>
        </div>
      </NuxtLink>
      
      <NuxtLink to="/bookmark" class="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50 transition-colors relative">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 mb-2 bg-amber-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <span class="font-medium">Bookmark</span>
        </div>
        
        <!-- Badge showing total bookmarks -->
        <div 
          v-if="totalBookmarks > 0" 
          class="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium"
        >
          {{ formatBadgeCount(totalBookmarks) }}
        </div>
      </NuxtLink>
    </div>
</template>

<script setup>
  import { useAuthStore } from '~/stores/auth';
  
  const props = defineProps({
    totalBookmarks: {
      type: Number,
      default: 0
    }
  });
  
  const authStore = useAuthStore();
  
  // Memformat jumlah bookmark untuk badge (misalnya 99+ jika > 99)
  const formatBadgeCount = (count) => {
    return count > 99 ? '99+' : count;
  };
</script>