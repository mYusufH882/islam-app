<template>
  <div class="reply-form">
    <p class="text-sm text-gray-600 mb-2">
      Membalas komentar
    </p>
    
    <form @submit.prevent="submitReply">
      <textarea
        v-model="content"
        placeholder="Tulis balasan Anda..."
        class="w-full p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="{ 'border-red-300': error }"
        rows="2"
        :disabled="isLoading"
      ></textarea>
      
      <!-- Error message -->
      <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
      
      <!-- Character counter -->
      <div class="flex justify-between items-center mt-2">
        <span class="text-xs text-gray-500" :class="{ 'text-red-500': content.length > maxLength || content.length < minLength }">
          {{ content.length }}/{{ maxLength }} karakter
        </span>
        
        <div class="flex space-x-2">
          <button
            type="button"
            @click="$emit('cancel')"
            class="px-3 py-1.5 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            :disabled="isLoading"
          >
            Batal
          </button>
          
          <button
            type="submit"
            class="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            :disabled="!isValid || isLoading"
          >
            <span v-if="isLoading">
              <svg class="animate-spin -ml-1 mr-2 h-3 w-3 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mengirim...
            </span>
            <span v-else>Kirim</span>
          </button>
        </div>
      </div>
    </form>
    
    <!-- Success message -->
    <div v-if="showSuccessMessage" class="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
      <p v-if="needsModeration">Balasan Anda berhasil dikirim dan sedang dalam proses moderasi. Terima kasih!</p>
      <p v-else>Balasan Anda berhasil dikirim. Terima kasih!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCommentStore } from '~/stores/comment.store';

// Define props
const props = defineProps({
  parentCommentId: {
    type: Number,
    required: true
  },
  blogId: {
    type: Number,
    required: true
  }
});

// Define emits
const emit = defineEmits(['reply-submitted', 'cancel']);

// Setup store
const commentStore = useCommentStore();

// State
const content = ref('');
const error = ref('');
const showSuccessMessage = ref(false);
const needsModeration = ref(false);

// Constants
const minLength = 3;
const maxLength = 500;

// Computed
const isValid = computed(() => {
  return content.value.length >= minLength && content.value.length <= maxLength;
});

const isLoading = computed(() => {
  return commentStore.loadingStates.reply === props.parentCommentId;
});

// Methods
const submitReply = async () => {
  // Reset error
  error.value = '';
  
  // Validasi
  if (content.value.trim().length < minLength) {
    error.value = `Balasan terlalu pendek. Minimal ${minLength} karakter.`;
    return;
  }
  
  if (content.value.length > maxLength) {
    error.value = `Balasan terlalu panjang. Maksimal ${maxLength} karakter.`;
    return;
  }
  
  // Submit balasan
  try {
    const reply = await commentStore.replyToComment(props.parentCommentId, content.value);
    
    if (reply) {
      // Reset form
      content.value = '';
      
      // Tampilkan pesan sukses
      showSuccessMessage.value = true;
      
      // PERBAIKAN: Gunakan optional chaining untuk mencegah error
      // Dan tambahkan fallback ke true jika status undefined
      needsModeration.value = reply?.status === 'pending' || true;
      
      // Sembunyikan pesan sukses setelah beberapa detik
      setTimeout(() => {
        showSuccessMessage.value = false;
        
        // Emit event untuk parent component
        emit('reply-submitted');
      }, 3000);
    } else {
      error.value = 'Gagal mengirim balasan. Silakan coba lagi.';
    }
  } catch (err: any) {
    error.value = err.message || 'Terjadi kesalahan. Silakan coba lagi.';
  }
};
</script>