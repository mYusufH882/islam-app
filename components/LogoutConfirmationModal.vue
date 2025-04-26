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
          
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="close"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Batal
            </button>
            <button
              @click="confirm"
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
  import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
  
  // Props for controlling the modal state
  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true
    }
  });
  
  // Emit events for actions
  const emit = defineEmits(['close', 'confirm']);
  
  // Methods
  const close = () => {
    emit('close');
  }
  
  const confirm = () => {
    emit('confirm');
  }
</script>