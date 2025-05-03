<template>
  <ClientOnly>
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
          <form v-if="!resetSuccess" class="space-y-5 sm:space-y-6" @submit.prevent="resetPassword">
            <div v-if="!isValidToken" class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Link reset password tidak valid atau sudah kadaluarsa</h3>
                  <div class="mt-2 text-xs sm:text-sm text-red-700">
                    <p>Silakan minta link reset password baru</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="isValidToken">
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Password Baru
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

              <div class="mt-4 sm:mt-5">
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                  Konfirmasi Password Baru
                </label>
                <div class="mt-1">
                  <input
                    id="confirmPassword"
                    v-model="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autocomplete="new-password"
                    required
                    placeholder="Masukkan ulang password baru"
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <p v-if="passwordError" class="mt-1 text-xs sm:text-sm text-red-600">
                  {{ passwordError }}
                </p>
              </div>

              <div class="mt-5 sm:mt-6">
                <button
                  type="submit"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  :disabled="loading || !isPasswordValid"
                >
                  <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Simpan Password Baru
                </button>
              </div>
            </div>

            <div v-if="!isValidToken">
              <NuxtLink 
                to="/auth/forgot-password"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Minta Link Reset Password Baru
              </NuxtLink>
            </div>
          </form>

          <!-- Success message after password reset -->
          <div v-if="resetSuccess" class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="mt-3 text-sm font-medium text-gray-900">Password berhasil diubah!</h3>
            <p class="mt-2 text-xs sm:text-sm text-gray-500">
              Password Anda telah berhasil diubah. Sekarang Anda bisa login dengan password baru Anda.
            </p>
            <div class="mt-5 sm:mt-6">
              <NuxtLink
                to="/auth/login"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Masuk Sekarang
              </NuxtLink>
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
  </ClientOnly>
</template>

<script setup>
// Definisikan layout untuk halaman ini
definePageMeta({
  layout: "custom",
  ssr: false
});

import { ClientOnly } from '#components';
import { ref, computed, watch, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();

// State variables
const token = ref('');
const isValidToken = ref(true); // Assume token is valid initially
const password = ref('');
const confirmPassword = ref('');
const passwordError = ref('');
const loading = ref(false);
const resetSuccess = ref(false);

// Minimum password length
const MIN_PASSWORD_LENGTH = 8;

// Get token from URL on component mount
onMounted(() => {
  // In a real app, you'd get this from route query or params
  token.value = route.query.token?.toString() || '';
  
  // Validate token (simulate token validation)
  validateToken();
});

// Validate the reset token
async function validateToken() {
  loading.value = true;
  
  try {
    // This would be an API call in a real application
    // Example: await api.validateResetToken(token.value)
    
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, we'll consider the token valid if it's not empty
    isValidToken.value = !!token.value;
  } catch (err) {
    console.error('Token validation error:', err);
    isValidToken.value = false;
  } finally {
    loading.value = false;
  }
}

// Watch for password changes to validate matching passwords
watch([password, confirmPassword], () => {
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    passwordError.value = 'Password tidak cocok';
  } else if (password.value && password.value.length < MIN_PASSWORD_LENGTH) {
    passwordError.value = `Password harus minimal ${MIN_PASSWORD_LENGTH} karakter`;
  } else {
    passwordError.value = '';
  }
});

// Check if password is valid
const isPasswordValid = computed(() => {
  return (
    password.value.length >= MIN_PASSWORD_LENGTH &&
    password.value === confirmPassword.value
  );
});

// Reset password function
async function resetPassword() {
  if (!isPasswordValid.value) return;
  
  loading.value = true;
  
  try {
    // This would be an API call in a real application
    // Example: await api.resetPassword(token.value, password.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // On successful password reset
    resetSuccess.value = true;
  } catch (err) {
    console.error('Password reset error:', err);
    // Handle error (e.g., show error message)
  } finally {
    loading.value = false;
  }
}
</script>