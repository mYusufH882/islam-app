<template>
    <div>
      <h3 class="text-lg font-semibold mb-3">Ayat yang Ditandai</h3>
      
      <div v-if="bookmarks.length === 0" class="bg-white p-4 rounded-lg shadow text-center">
        <p class="text-gray-500">Belum ada ayat yang ditandai</p>
        <NuxtLink to="/quran" class="mt-2 inline-block text-blue-600">
          Buka Al-Quran
        </NuxtLink>
      </div>
      
      <div v-else class="space-y-3">
        <div 
          v-for="(bookmark, index) in bookmarks" 
          :key="index"
          class="bg-white p-4 rounded-lg shadow"
        >
          <div class="flex justify-between">
            <h4 class="font-medium">{{ bookmark.surah.name }}</h4>
            <span class="text-sm text-gray-500">Ayat {{ bookmark.ayat }}</span>
          </div>
          
          <p class="text-right mt-2 font-arabic text-lg leading-relaxed">
            {{ bookmark.text }}
          </p>
          
          <p class="text-sm text-gray-700 mt-2">
            {{ bookmark.translation }}
          </p>
          
          <div class="mt-3 flex justify-between">
            <span class="text-xs text-gray-500">
              {{ formatDate(bookmark.timestamp) }}
            </span>
            
            <div class="flex space-x-2">
              <button 
                @click="openBookmark(bookmark)" 
                class="text-sm text-blue-600 flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Buka
              </button>
              
              <button 
                @click="removeBookmark(index)" 
                class="text-sm text-red-600 flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const bookmarks = ref([]);
  
  // Load bookmarks from localStorage
  const loadBookmarks = () => {
    const savedBookmarks = localStorage.getItem('quranBookmarks');
    if (savedBookmarks) {
      bookmarks.value = JSON.parse(savedBookmarks);
    }
  };
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Open surah at specific ayat
  const openBookmark = (bookmark) => {
    router.push(`/quran/${bookmark.surah.number}#ayat-${bookmark.ayat}`);
  };
  
  // Remove bookmark
  const removeBookmark = (index) => {
    if (confirm('Hapus bookmark ini?')) {
      bookmarks.value.splice(index, 1);
      localStorage.setItem('quranBookmarks', JSON.stringify(bookmarks.value));
    }
  };
  
  // Load bookmarks when component is mounted
  onMounted(() => {
    loadBookmarks();
  });
</script>