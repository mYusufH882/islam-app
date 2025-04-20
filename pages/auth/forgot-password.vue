<template>
  <div class="min-h-screen flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8 bg-blue-700">
    <div class="mx-auto w-full max-w-md">
      <div class="flex justify-center">
        <div class="h-16 w-16 sm:h-20 sm:w-20 bg-white rounded-full flex items-center justify-center shadow-lg">
          <svg class="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
      </div>
      <h2 class="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-white">
        Reset Password
      </h2>
      <p class="mt-2 text-center text-sm text-blue-200">
        Masukkan email Anda untuk menerima link reset password
      </p>
    </div>

    <div class="mt-6 sm:mt-8 mx-auto w-full max-w-md">
      <div class="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow rounded-lg">
        <form v-if="!emailSent" class="space-y-5 sm:space-y-6" @submit.prevent="sendResetEmail">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                placeholder="Masukkan email terdaftar Anda"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="loading"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Kirim Link Reset
            </button>
          </div>
        </form>

        <!-- Success message after email sent -->
        <div v-if="emailSent" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="mt-3 text-sm font-medium text-gray-900">Email terkirim!</h3>
          <p class="mt-2 text-xs sm:text-sm text-gray-500">
            Kami telah mengirimkan instruksi untuk reset password ke email Anda. Silakan periksa kotak masuk atau folder spam Anda.
          </p>
          <div class="mt-5 sm:mt-6">
            <button
              type="button"
              @click="resetForm"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Coba Lagi
            </button>
          </div>
        </div>

        <div class="mt-5 sm:mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Atau</span>
            </div>
          </div>

          <div class="mt-4 sm:mt-6">
            <p class="text-center text-sm text-gray-600">
              <NuxtLink to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
                Kembali ke halaman login
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Definisikan layout untuk halaman ini
definePageMeta({
  layout: "custom" // Gunakan 'custom' (akan di-fallback ke default jika tidak ada) daripada false
});

import { ref } from 'vue';

const email = ref('');
const loading = ref(false);
const error = ref('');
const emailSent = ref(false);

async function sendResetEmail() {
  loading.value = true;
  error.value = '';
  
  try {
    // Implement your password reset logic here
    // Example: await api.sendPasswordResetEmail(email.value)
    console.log('Password reset requested for:', email.value);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // On successful request
    emailSent.value = true;
  } catch (err) {
    error.value = 'Gagal mengirim email. Silakan coba lagi.';
    console.error('Password reset error:', err);
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  email.value = '';
  emailSent.value = false;
}
</script>