<template>
    <Dialog :open="isOpen" @close="closeModal" class="relative z-50">
      <div class="fixed inset-0 bg-black/30 dark:bg-black/50 transition-opacity" aria-hidden="true" />
      
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="mx-auto max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
          <DialogTitle class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ title || 'Konfirmasi Hapus' }}
          </DialogTitle>
          
          <div class="mt-2">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ message || 'Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.' }}
            </p>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="closeModal"
              class="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {{ cancelText || 'Batal' }}
            </button>
            <button
              @click="confirmDelete"
              class="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              :disabled="isDeleting"
            >
              <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isDeleting ? 'Menghapus...' : deleteText || 'Hapus' }}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
</template>

<script setup>
  import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true
    },
    isDeleting: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Konfirmasi Hapus'
    },
    message: {
      type: String,
      default: 'Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.'
    },
    cancelText: {
      type: String,
      default: 'Batal'
    },
    deleteText: {
      type: String,
      default: 'Hapus'
    },
    itemType: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['close', 'confirm']);
  
  const closeModal = () => {
    emit('close');
  };
  
  const confirmDelete = () => {
    emit('confirm');
  };
</script>