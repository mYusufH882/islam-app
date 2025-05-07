<template>
  <Dialog :open="showLoginModal" @close="closeModal" class="relative z-50">
    <!-- Backdrop overlay -->
    <div class="fixed inset-0 bg-black/30 transition-opacity" aria-hidden="true" />
    
    <!-- Modal panel -->
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel class="bg-white rounded-lg max-w-md w-full p-6 shadow-xl transition-all">
        <div class="flex justify-between items-center mb-4">
          <DialogTitle class="text-lg font-medium text-gray-900">
            {{ source === 'bookmark' ? 'Bookmark Memerlukan Login' : 'Selamat Datang di Aplikasi Muslim' }}
          </DialogTitle>
          <!-- Close button -->
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mb-6">
          <p class="text-sm text-gray-600 mb-3">
            <span v-if="source === 'bookmark'">
              Untuk dapat menyimpan bookmark, Anda perlu login terlebih dahulu.
            </span>
            <span v-else>
              Untuk mendapatkan pengalaman yang lebih lengkap dan menyimpan data pribadi Anda, silakan login terlebih dahulu.
            </span>
          </p>
          
          <div class="bg-blue-50 p-4 rounded-md text-sm text-blue-700 mb-4">
            <p class="font-medium mb-2">Dengan login, Anda bisa menikmati berbagai fitur seperti:</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Menyimpan bookmark ayat Al-Quran</li>
              <li>Melanjutkan bacaan terakhir Al-Quran</li>
              <li v-if="source === 'bookmark'" class="font-medium">Sinkronisasi bookmark di semua perangkat</li>
            </ul>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-3 mb-4">
          <NuxtLink 
            :to="redirectUrl ? `/auth/login?redirect=${redirectUrl}` : '/auth/login'" 
            class="flex justify-center items-center bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 font-medium"
            @click="closeModal"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Masuk
          </NuxtLink>
          <NuxtLink 
            :to="redirectUrl ? `/auth/register?redirect=${redirectUrl}` : '/auth/register'" 
            class="flex justify-center items-center bg-gray-100 text-gray-700 py-2.5 px-4 rounded-md hover:bg-gray-200 font-medium"
            @click="closeModal"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Daftar Baru
          </NuxtLink>
        </div>
        
        <div class="text-center border-t border-gray-100 pt-4">
          <button @click="closeModal" class="text-sm text-gray-500 hover:text-gray-700">
            {{ source === 'bookmark' ? 'Lanjutkan tanpa bookmark' : 'Lanjutkan tanpa login' }}
          </button>
          <p class="text-xs text-gray-400 mt-2">
            Anda tetap dapat mengakses fitur dasar tanpa login.
          </p>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { useAuthStore } from '~/stores/auth';
import { useLoginModal } from '~/composables/useLoginModal';

const props = defineProps({
  showDelay: {
    type: Number,
    default: 2000 // Updated to 2 seconds (2000ms)
  },
  redirectPath: {
    type: String,
    default: ''
  }
});

const authStore = useAuthStore();
const { showLoginModal: globalShowLoginModal, redirectPath: globalRedirectPath, closeLoginModal } = useLoginModal();

// Local modal state
const showLoginModal = ref(false);
const hasShownModal = ref(false);
const source = ref('welcome'); // 'welcome' or 'bookmark'
const redirectUrl = ref('');

// Watch for changes in the global login modal state
watch(globalShowLoginModal, (newVal) => {
  if (newVal) {
    // Get source and redirect from global state
    source.value = globalRedirectPath.value.includes('quran') ? 'bookmark' : 'welcome';
    redirectUrl.value = globalRedirectPath.value;
    showLoginModal.value = true;
  }
});

// Close modal and set flag
const closeModal = () => {
  showLoginModal.value = false;
  hasShownModal.value = true;
  closeLoginModal(); // Also close the global modal
  
  // Set localStorage to remember user dismissed welcome modal
  // Only for welcome modals, not bookmark modals
  if (process.client && source.value === 'welcome') {
    localStorage.setItem('login_modal_dismissed', 'true');
    
    // Set expiration for the dismissed flag (24 hours)
    const now = new Date();
    const expiryTime = now.getTime() + 24 * 60 * 60 * 1000; // 24 hours in ms
    localStorage.setItem('login_modal_dismissed_expiry', expiryTime.toString());
  }
};

onMounted(() => {
  // Skip if not client-side or if user is already authenticated
  if (!process.client || authStore.isAuthenticated) return;
  
  // Check for welcome modal (automatic display)
  if (!hasShownModal.value) {
    // Check if modal dismissal has expired
    const dismissalExpiry = localStorage.getItem('login_modal_dismissed_expiry');
    if (dismissalExpiry) {
      const now = new Date().getTime();
      if (now > parseInt(dismissalExpiry)) {
        // Expired, remove items
        localStorage.removeItem('login_modal_dismissed');
        localStorage.removeItem('login_modal_dismissed_expiry');
      }
    }
    
    // Check if modal has been dismissed before
    const modalDismissed = localStorage.getItem('login_modal_dismissed');
    
    // Show modal if not previously dismissed
    if (!modalDismissed) {
      // Default source for automatic display
      source.value = 'welcome';
      redirectUrl.value = '';
      
      // Delay to show modal after page loads
      setTimeout(() => {
        showLoginModal.value = true;
      }, props.showDelay);
    }
  }
});
</script>