<template>
  <ClientOnly>
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
          <!-- Konten form login -->
          <form class="space-y-5 sm:space-y-6" @submit.prevent="login">
            <!-- Error alert -->
            <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">{{ error }}</p>
                </div>
              </div>
            </div>

            <!-- Input fields -->
            <div>
              <label for="identifier" class="block text-sm font-medium text-gray-700">
                Email / Username
              </label>
              <div class="mt-1">
                <input
                  id="identifier"
                  v-model="identifier"
                  name="identifier"
                  type="text"
                  autocomplete="username email"
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

            <!-- Remember me checkbox -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  v-model="rememberMe"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="remember-me" class="ml-2 text-sm text-gray-700">
                  Ingat saya
                </label>
              </div>
              
              <div class="text-sm">
                <NuxtLink to="/auth/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
                  Lupa password?
                </NuxtLink>
              </div>
            </div>

            <!-- Submit button -->
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

          <!-- Links -->
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
    
    <template #fallback>
      <!-- Fallback content untuk SSR -->
      <div class="min-h-screen flex flex-col justify-center bg-blue-700 p-4">
        <div class="mx-auto w-full max-w-md">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="animate-pulse space-y-4">
              <div class="h-12 w-12 bg-gray-200 rounded-full mx-auto"></div>
              <div class="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div class="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
definePageMeta({
  layout: "custom",
  ssr: false // Memastikan ini tidak di-render di server
});

import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

// Form data
const identifier = ref('');
const password = ref('');
const rememberMe = ref(false); // Tambahkan state untuk checkbox remember me
const loading = ref(false);
const error = ref('');

// Load saved user data when component mounts
onMounted(() => {
  if (process.client) {
    try {
      // Check if remember me is enabled
      const isRememberMeEnabled = localStorage.getItem('remember_me_enabled') === 'true';
      
      if (isRememberMeEnabled) {
        // Get remembered user data
        const rememberedUserJson = localStorage.getItem('remembered_user');
        if (rememberedUserJson) {
          const rememberedUser = JSON.parse(rememberedUserJson);
          
          // Auto-fill form with remembered data
          identifier.value = rememberedUser.username || rememberedUser.email || '';
          
          // Check remember me checkbox
          rememberMe.value = true;
          
          console.log('Form auto-filled with remembered user:', identifier.value);
        }
      }
    } catch (err) {
      console.error('Error loading remembered user data:', err);
    }
  }
});

async function login() {
  error.value = '';
  
  if (!identifier.value || !password.value) {
    error.value = 'Email/username dan password diperlukan';
    return;
  }
  
  loading.value = true;
  
  try {
    const success = await authStore.login(identifier.value, password.value);
    
    if (success) {
      // If login successful and remember me is checked, save user data
      if (process.client && rememberMe.value && authStore.user) {
        const userToRemember = {
          username: authStore.user.username || '',
          email: authStore.user.email || '',
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('remembered_user', JSON.stringify(userToRemember));
        localStorage.setItem('remember_me_enabled', 'true');
        console.log('User data saved for remember me:', userToRemember);
      } else if (process.client && !rememberMe.value) {
        localStorage.removeItem('remembered_user');
        localStorage.removeItem('remember_me_enabled');
      }
      
      // Redirect based on role
      if (authStore.user?.role === 'admin') {
        await router.push('/admin');
      } else {
        await router.push('/');
      }
    } else {
      error.value = 'Login gagal. Periksa email/username dan password Anda.';
    }
  } catch (err) {
    error.value = err?.message || 'Terjadi kesalahan saat login. Silakan coba lagi.';
    console.error('Login error:', err);
  } finally {
    loading.value = false;
  }
}
</script>