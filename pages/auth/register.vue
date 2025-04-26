<template>
  <div class="min-h-screen flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8 bg-blue-700">
    <div class="mx-auto w-full max-w-md">
      <div class="flex justify-center">
        <div class="h-16 w-16 sm:h-20 sm:w-20 bg-white rounded-full flex items-center justify-center shadow-lg">
          <svg class="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
      </div>
      <h2 class="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-white">
        Daftar Akun Baru
      </h2>
      <p class="mt-2 text-center text-sm text-blue-200">
        Bergabunglah dengan komunitas Pemuda Persis Cimsel
      </p>
    </div>

    <div class="mt-6 sm:mt-8 mx-auto w-full max-w-md">
      <div class="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow rounded-lg">
        <form class="space-y-4 sm:space-y-6" @submit.prevent="register">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="name"
                name="name"
                type="text"
                required
                placeholder="Masukkan nama lengkap Anda"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
          
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div class="mt-1">
              <input
                id="username"
                v-model="username"
                name="username"
                type="text"
                required
                placeholder="Masukkan username"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

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
                placeholder="contoh@email.com"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                autocomplete="new-password"
                required
                placeholder="Minimal 8 karakter"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Konfirmasi Password
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                placeholder="Masukkan ulang password"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <p v-if="passwordError" class="mt-1 text-xs sm:text-sm text-red-600">
              {{ passwordError }}
            </p>
          </div>

          <div class="flex items-start sm:items-center">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="agreeToTerms"
                name="terms"
                type="checkbox"
                required
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div class="ml-2 text-sm">
              <label for="terms" class="text-gray-700">
                Saya setuju dengan <a href="#" class="text-blue-600 hover:text-blue-500">Syarat dan Ketentuan</a>
              </label>
            </div>
          </div>

          <div class="mt-2 sm:mt-4">
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Daftar
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
              Sudah memiliki akun?
              <NuxtLink to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
                Masuk disini
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

import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Form fields
const name = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreeToTerms = ref(false);
const loading = ref(false);
const showPassword = ref(false);

// Validation errors
const nameError = ref('');
const usernameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const generalError = ref('');

// Minimum password length
const MIN_PASSWORD_LENGTH = 8;

// Watch for changes to validate in real-time
watch([name], () => {
  if (name.value.trim() === '') {
    nameError.value = 'Nama lengkap diperlukan';
  } else if (name.value.length < 3) {
    nameError.value = 'Nama harus minimal 3 karakter';
  } else {
    nameError.value = '';
  }
});

watch([username], () => {
  if (username.value.trim() === '') {
    usernameError.value = 'Username diperlukan';
  } else if (username.value.length < 3) {
    usernameError.value = 'Username harus minimal 3 karakter';
  } else if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
    usernameError.value = 'Username hanya boleh berisi huruf, angka, dan underscore';
  } else {
    usernameError.value = '';
  }
});

watch([email], () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value.trim() === '') {
    emailError.value = 'Email diperlukan';
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Format email tidak valid';
  } else {
    emailError.value = '';
  }
});

// Watch for password changes to validate matching passwords
watch([password, confirmPassword], () => {
  if (password.value.trim() === '') {
    passwordError.value = 'Password diperlukan';
  } else if (password.value.length < MIN_PASSWORD_LENGTH) {
    passwordError.value = `Password harus minimal ${MIN_PASSWORD_LENGTH} karakter`;
  } else if (confirmPassword.value && password.value !== confirmPassword.value) {
    passwordError.value = 'Password tidak cocok';
  } else {
    passwordError.value = '';
  }
});

// Check if form is valid
const isFormValid = computed(() => {
  return (
    name.value.trim() !== '' &&
    name.value.length >= 3 &&
    username.value.trim() !== '' &&
    username.value.length >= 3 &&
    /^[a-zA-Z0-9_]+$/.test(username.value) &&
    email.value.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
    password.value.trim() !== '' &&
    password.value.length >= MIN_PASSWORD_LENGTH &&
    confirmPassword.value === password.value &&
    agreeToTerms.value &&
    !nameError.value &&
    !usernameError.value &&
    !emailError.value &&
    !passwordError.value
  );
});

// Function to register a new user
async function register() {
  if (!isFormValid.value) return;
  
  loading.value = true;
  generalError.value = '';
  
  try {
    // Register using auth store
    const success = await authStore.register({
      name: name.value,
      username: username.value,
      email: email.value,
      password: password.value
    });
    
    if (success) {
      // On successful registration
      router.push('/auth/login?registration_success=true');
    } else {
      generalError.value = 'Pendaftaran gagal. Silakan coba lagi.';
    }
  } catch (err: any) {
    // Handle specific error messages from API
    if (err?.response?.data?.message) {
      generalError.value = err.response.data.message;
    } else if (err?.message) {
      generalError.value = err.message;
    } else {
      generalError.value = 'Pendaftaran gagal. Silakan coba lagi.';
    }
    console.error('Registration error:', err);
  } finally {
    loading.value = false;
  }
}
</script>