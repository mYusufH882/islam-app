<template>
  <div class="bg-white dark:bg-dark-bg-secondary shadow dark:shadow-gray-800 overflow-hidden sm:rounded-lg mt-6">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
        Ubah Password
      </h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
        Update password akun Anda
      </p>
    </div>
    
    <div class="border-t border-gray-200 dark:border-gray-700 p-4">
      <form @submit.prevent="changePassword">
        <!-- Alert for errors -->
        <div v-if="error" class="mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-700 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
            </div>
          </div>
        </div>
        
        <!-- Success message -->
        <div v-if="success" class="mb-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-700 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400 dark:text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700 dark:text-green-400">{{ success }}</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-4">
          <!-- Current Password -->
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password Saat Ini</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                :type="showCurrentPassword ? 'text' : 'password'"
                id="currentPassword"
                v-model="formData.currentPassword"
                class="pr-12 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md"
                required
              />
              <button
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
              >
                <!-- Eye icon when password is hidden -->
                <svg v-if="!showCurrentPassword" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <!-- Eye-off icon when password is visible -->
                <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- New Password -->
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password Baru</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                :type="showNewPassword ? 'text' : 'password'"
                id="newPassword"
                v-model="formData.newPassword"
                class="pr-12 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md"
                required
                minlength="8"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
              >
                <!-- Eye icon when password is hidden -->
                <svg v-if="!showNewPassword" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <!-- Eye-off icon when password is visible -->
                <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Password harus minimal 8 karakter
            </p>
          </div>
          
          <!-- Confirm New Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Konfirmasi Password Baru</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="formData.confirmPassword"
                class="pr-12 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
              >
                <!-- Eye icon when password is hidden -->
                <svg v-if="!showConfirmPassword" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <!-- Eye-off icon when password is visible -->
                <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="passwordMismatch" class="mt-1 text-xs text-red-500 dark:text-red-400">
              Password baru dan konfirmasi password tidak cocok
            </p>
          </div>
          
          <!-- Submit button -->
          <div class="flex justify-end pt-3">
              <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
                :disabled="saving || passwordMismatch"
              >
                <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ubah Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch } from 'vue';
  import { useApi } from '~/composables/useApi';
  
  // State
  const formData = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const showCurrentPassword = ref(false);
  const showNewPassword = ref(false);
  const showConfirmPassword = ref(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  const saving = ref(false);
  
  // Computed for password validation
  const passwordMismatch = computed(() => {
    return formData.newPassword !== '' && 
           formData.confirmPassword !== '' && 
           formData.newPassword !== formData.confirmPassword;
  });
  
  // Reset form after success
  watch(success, (value) => {
    if (value) {
      formData.currentPassword = '';
      formData.newPassword = '';
      formData.confirmPassword = '';
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        success.value = null;
      }, 5000);
    }
  });
  
  // Change password function
  const changePassword = async () => {
    // Reset messages
    error.value = null;
    success.value = null;
    
    // Validate passwords match
    if (passwordMismatch.value) {
      error.value = 'Password baru dan konfirmasi password tidak cocok';
      return;
    }
    
    // Validate password length
    if (formData.newPassword.length < 8) {
      error.value = 'Password baru harus minimal 8 karakter';
      return;
    }
    
    saving.value = true;
    
    try {
      const { apiFetch } = useApi();
      const { data, error: apiError } = await apiFetch('/auth/change-password', {
        method: 'PUT',
        body: {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }
      });
      
      if (apiError.value) {
        throw new Error(apiError.value.message || 'Failed to change password');
      }
      
      if (data.value && data.value.success) {
        success.value = 'Password berhasil diubah';
      } else {
        throw new Error('Invalid API response');
      }
    } catch (err: any) {
      error.value = err.message || 'Terjadi kesalahan saat mengubah password';
    } finally {
      saving.value = false;
    }
  };
</script>