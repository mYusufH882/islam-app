<template>
  <Dialog :open="isOpen" @close="close" class="relative z-50">
    <!-- Backdrop overlay -->
    <div class="fixed inset-0 bg-black/30 transition-opacity" aria-hidden="true" />
  
    <!-- Modal panel -->
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel class="bg-white rounded-lg max-w-md w-full p-6 shadow-xl transition-all">
        <DialogTitle class="text-lg font-medium text-gray-900 mb-2">Konfirmasi Logout</DialogTitle>
        
        <p class="text-sm text-gray-500 mb-4">
          Apakah Anda yakin ingin keluar dari aplikasi? Sesi Anda akan berakhir.
        </p>
        
        <div class="flex items-center mb-4">
          <input 
            id="rememberMe" 
            v-model="rememberUser" 
            type="checkbox"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="rememberMe" class="ml-2 text-sm text-gray-600">
            Ingat username saya di perangkat ini
          </label>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="close"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Batal
          </button>
          <button
            @click="confirmWithRemember"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ya, Keluar
          </button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { useAuthStore } from '~/stores/auth';

// Props untuk mengontrol status modal
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const authStore = useAuthStore();

// State untuk checkbox "Ingat saya"
const rememberUser = ref(false);
  
// Emit events untuk actions
const emit = defineEmits(['close', 'confirm']);
  
// Methods
const close = () => {
  emit('close');
}
  
const confirmWithRemember = () => {
  // Penting: pastikan parameter rememberUser diteruskan dengan benar
  emit('confirm', rememberUser.value);
}

// Cek apakah user sebelumnya mengaktifkan "remember me"
onMounted(() => {
  if (process.client) {
    // Periksa apakah fitur "remember me" diaktifkan
    const rememberMeEnabled = localStorage.getItem('remember_me_enabled') === 'true';
    
    // Default ke true jika sebelumnya sudah diaktifkan
    rememberUser.value = rememberMeEnabled;
  }
});
</script>