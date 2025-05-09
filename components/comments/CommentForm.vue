<template>
  <div class="comment-form">
    <form @submit.prevent="submitComment">
      <textarea
        v-model="content"
        :placeholder="placeholder"
        class="w-full p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="{ 'border-red-300': error }"
        rows="3"
        :disabled="isLoading"
      ></textarea>
      
      <!-- Error message -->
      <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
      
      <!-- Character counter -->
      <div class="flex justify-between items-center mt-2">
        <span class="text-xs text-gray-500" :class="{ 'text-red-500': content.length > maxLength || content.length < minLength }">
          {{ content.length }}/{{ maxLength }} karakter
        </span>
        
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          :disabled="!isValid || isLoading"
        >
          <span v-if="isLoading">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Mengirim...
          </span>
          <span v-else>Kirim Komentar</span>
        </button>
      </div>
      
      <!-- Helper text -->
      <p v-if="showModerationInfo" class="mt-3 text-xs text-gray-500">
        Komentar Anda akan ditinjau oleh moderator sebelum ditampilkan.
      </p>
    </form>
    
    <!-- Success message -->
    <div v-if="showSuccessMessage" class="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
      <p v-if="needsModeration">Komentar Anda berhasil dikirim dan sedang dalam proses moderasi. Terima kasih!</p>
      <p v-else>Komentar Anda berhasil dikirim. Terima kasih!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCommentStore } from '~/stores/comment.store';
import { useAuthStore } from '~/stores/auth';

// Define props
const props = defineProps({
  blogId: {
    type: Number,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Tulis komentar Anda...'
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

// Define emits
const emit = defineEmits(['comment-added']);

// Setup stores
const commentStore = useCommentStore();
const authStore = useAuthStore();

// State
const content = ref('');
const error = ref('');
const showSuccessMessage = ref(false);
const needsModeration = ref(false);

// Constants
const minLength = 3;
const maxLength = 1000;

// Computed
const isValid = computed(() => {
  return content.value.length >= minLength && content.value.length <= maxLength;
});

const showModerationInfo = computed(() => {
  // Tampilkan informasi moderasi untuk user baru atau yang belum pernah komentar
  return authStore.isAuthenticated ? !authStore.user?.lastCommentAt : true;
});

// Methods
const submitComment = async () => {
  // Reset error
  error.value = '';
  
  // Validasi
  if (content.value.trim().length < minLength) {
    error.value = `Komentar terlalu pendek. Minimal ${minLength} karakter.`;
    return;
  }
  
  if (content.value.length > maxLength) {
    error.value = `Komentar terlalu panjang. Maksimal ${maxLength} karakter.`;
    return;
  }
  
  // Log data untuk debugging
  console.log("Sending comment with data:", {
    content: content.value,
    blogId: props.blogId,
  });
  
  // Submit komentar
  try {
    // PENTING: Pastikan blogId dikirim dengan benar!
    const comment = await commentStore.createComment(content.value, props.blogId);
    
    if (comment) {
      // Reset form
      content.value = '';
      
      // Tampilkan pesan sukses
      showSuccessMessage.value = true;
      needsModeration.value = comment.status === 'pending';
      
      // Sembunyikan pesan sukses setelah beberapa detik
      setTimeout(() => {
        showSuccessMessage.value = false;
      }, 5000);
      
      // Emit event
      emit('comment-added', comment);
    } else {
      error.value = 'Gagal mengirim komentar. Silakan coba lagi.';
    }
  } catch (err: any) {
    error.value = err.message || 'Terjadi kesalahan. Silakan coba lagi.';
  }
};
</script>