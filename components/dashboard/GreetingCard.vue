<template>
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <h2 class="text-lg font-semibold">
        Assalamu'alaikum{{ authStore.isAuthenticated ? ', ' + username : ', Akhi/Ukhti' }}
      </h2>
      <p class="text-gray-600">Selamat datang di Pemuda Muslim Cimsel</p>
      <div class="mt-2 flex items-center text-sm text-gray-500">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{{ date }}</span>
      </div>
    </div>
</template>

<script setup>
  import { useAuthStore } from '~/stores/auth';
  
  const authStore = useAuthStore();
  
  defineProps({
    username: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      required: true
    }
  });
</script>