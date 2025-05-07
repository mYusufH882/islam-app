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
import { useBookmarkService } from '~/composables/useBookmarkService';

const props = defineProps({
  isBookmarked: {
    type: Boolean,
    default: false
  },
  blogId: {
    type: Number,
    required: true
  },
  blogTitle: {
    type: String,
    required: true
  },
  blogExcerpt: {
    type: String,
    default: ''
  },
  blogImage: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:bookmark']);
const authStore = useAuthStore();
const { openLoginModal } = useLoginModal();
const bookmarkService = useBookmarkService();

const toggleBookmark = async () => {
  // Check if user is logged in
  if (!authStore.isAuthenticated) {
    // Blog bookmarks require authentication
    const currentPath = window.location.pathname;
    openLoginModal(currentPath);
    return;
  }
  
  // Toggle bookmark
  if (props.isBookmarked) {
    // Remove bookmark
    const success = await bookmarkService.removeBookmark(props.blogId);
    if (success) {
      emit('update:bookmark', {
        blogId: props.blogId,
        action: 'remove'
      });
    }
  } else {
    // Add bookmark
    const success = await bookmarkService.addBookmark({
      type: 'blog',
      blogId: props.blogId,
      blogTitle: props.blogTitle,
      blogExcerpt: props.blogExcerpt,
      blogImage: props.blogImage
    });
    
    if (success) {
      emit('update:bookmark', {
        blogId: props.blogId,
        action: 'add'
      });
    }
  }
};
</script>