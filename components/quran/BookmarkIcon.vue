<template>
    <button 
      @click.prevent.stop="toggleBookmark" 
      class="flex items-center justify-center p-1.5 rounded-full hover:bg-gray-100 transition-colors"
      :class="{ 'text-blue-600': isBookmarked, 'text-gray-500': !isBookmarked }"
      :title="isBookmarked ? 'Hapus bookmark' : 'Tambahkan bookmark'"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path v-if="isBookmarked" 
          fill-rule="evenodd" 
          d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" 
          clip-rule="evenodd" 
        />
        <path v-else 
          fill-rule="evenodd" 
          d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4zm2-1a1 1 0 00-1 1v13.5l4-2 4 2V4a1 1 0 00-1-1H7z" 
          clip-rule="evenodd" 
        />
      </svg>
    </button>
</template>

<script setup>
  import { useAuthStore } from '~/stores/auth';
  import { useLoginModal } from '~/composables/useLoginModal';
  
  const props = defineProps({
    isBookmarked: {
      type: Boolean,
      default: false
    },
    surahId: {
      type: Number,
      required: true
    },
    verseId: {
      type: Number,
      default: null
    }
  });
  
  const emit = defineEmits(['update:bookmark']);
  const authStore = useAuthStore();
  const { openLoginModal } = useLoginModal();
  
  const toggleBookmark = () => {
    // Check if user is logged in
    if (!authStore.isAuthenticated) {
        // Open login modal with current page as redirect
        const currentPath = window.location.pathname;
        openLoginModal(currentPath);
        return;
    }
    
    // Toggle bookmark status
    emit('update:bookmark', {
      surahId: props.surahId,
      verseId: props.verseId,
      action: props.isBookmarked ? 'remove' : 'add'
    });
  };
</script>