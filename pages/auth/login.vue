<template>
  <div class="min-h-screen flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8 bg-blue-700">
    <div class="mx-auto w-full max-w-md">
      <div class="flex justify-center">
        <div class="h-16 w-16 sm:h-20 sm:w-20 bg-white rounded-full flex items-center justify-center shadow-lg">
          <svg class="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      <h2 class="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-white">
        Masuk ke Akun Anda
      </h2>
      <p class="mt-2 text-center text-sm text-blue-200">
        Silahkan masuk untuk mengakses fitur lengkap
      </p>
    </div>

    <div class="mt-6 sm:mt-8 mx-auto w-full max-w-md">
      <div class="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow rounded-lg">
        <form class="space-y-5 sm:space-y-6" @submit.prevent="login">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email / Username
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="text"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Masukkan email atau username"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Masukkan password"
              />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Ingat saya
              </label>
            </div>

            <div class="text-sm mt-2 sm:mt-0">
              <NuxtLink to="/auth/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
                Lupa password?
              </NuxtLink>
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
              Masuk
            </button>
          </div>
        </form>

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
              Belum memiliki akun?
              <NuxtLink to="/auth/register" class="font-medium text-blue-600 hover:text-blue-500">
                Daftar disini
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
const router = useRouter();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const loading = ref(false);
const error = ref('');

async function login() {
  loading.value = true;
  error.value = '';
  
  try {
    // Implement your login logic here
    // Example: await api.login(email.value, password.value)
    console.log('Login attempt with:', {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // On successful login
    router.push('/');
  } catch (err) {
    error.value = 'Login gagal. Silakan periksa email dan password Anda.';
    console.error('Login error:', err);
  } finally {
    loading.value = false;
  }
}
</script>