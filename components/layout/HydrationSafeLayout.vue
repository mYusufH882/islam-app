// pages/auth/reset-password.vue
<template>
  <HydrationSafeLayout>
    <div class="min-h-screen flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8 bg-blue-700">
      <div class="mx-auto w-full max-w-md">
        <div class="flex justify-center">
          <div class="h-16 w-16 sm:h-20 sm:w-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg class="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h2 class="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-white">
          Buat Password Baru
        </h2>
        <p class="mt-2 text-center text-sm text-blue-200">
          Buat password baru untuk akun Anda
        </p>
      </div>

      <div class="mt-6 sm:mt-8 mx-auto w-full max-w-md">
        <div class="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow rounded-lg">
          <!-- Rest of your content -->
          <!-- Form content and logic here -->

          <!-- Keeping the rest of the template the same -->
        </div>
      </div>
    </div>

    <template #fallback>
      <!-- Simplified version for SSR -->
      <div class="min-h-screen flex flex-col justify-center py-6 px-4 bg-blue-700">
        <div class="mx-auto w-full max-w-md">
          <div class="bg-white py-6 px-4 shadow rounded-lg">
            <div class="animate-pulse">
              <div class="flex justify-center mb-6">
                <div class="h-16 w-16 bg-gray-200 rounded-full"></div>
              </div>
              <div class="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
              <div class="space-y-4">
                <div class="h-10 bg-gray-200 rounded"></div>
                <div class="h-10 bg-gray-200 rounded"></div>
                <div class="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </HydrationSafeLayout>
</template>

<script setup>
definePageMeta({
  layout: "custom",
  ssr: false // Disable SSR for this page completely
});

import { ref, computed, watch, onMounted } from 'vue';
import HydrationSafeLayout from '~/components/layout/HydrationSafeLayout.vue';

// Rest of your script logic unchanged
</script>