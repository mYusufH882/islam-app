<template>
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Profile</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Kelola informasi profil Anda
        </p>
      </div>
  
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        <button @click="fetchProfile" class="mt-2 text-blue-600 dark:text-blue-400">Coba lagi</button>
      </div>
  
      <!-- Profil Card -->
      <div v-else class="bg-white dark:bg-dark-bg-secondary shadow dark:shadow-gray-800 overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Informasi Profil
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Detail personal dan informasi akun
            </p>
          </div>
          <button 
            @click="isEditing = !isEditing" 
            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg-primary hover:bg-gray-50 dark:hover:bg-dark-bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
          >
            {{ isEditing ? 'Batal' : 'Edit Profil' }}
          </button>
        </div>
        
        <!-- View Mode -->
        <div v-if="!isEditing" class="border-t border-gray-200 dark:border-gray-700">
          <dl>
            <div class="bg-gray-50 dark:bg-dark-bg-primary px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nama Lengkap
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {{ user.name }}
              </dd>
            </div>
            <div class="bg-white dark:bg-dark-bg-secondary px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Username
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {{ user.username }}
              </dd>
            </div>
            <div class="bg-gray-50 dark:bg-dark-bg-primary px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {{ user.email }}
              </dd>
            </div>
            <div class="bg-white dark:bg-dark-bg-secondary px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Peran
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {{ formatRole(user.role) }}
              </dd>
            </div>
            <div class="bg-gray-50 dark:bg-dark-bg-primary px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Login Terakhir
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {{ formatDate(user.lastLogin) }}
              </dd>
            </div>
          </dl>
        </div>
        
        <!-- Edit Mode -->
        <div v-else class="border-t border-gray-200 dark:border-gray-700 p-4">
          <form @submit.prevent="updateProfile">
            <div class="space-y-4">
              <!-- Nama -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                <div class="mt-1">
                  <input
                    id="name"
                    type="text"
                    v-model="formData.name"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md"
                    required
                  />
                </div>
              </div>
              
              <!-- Username -->
              <div>
                <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <div class="mt-1">
                  <input
                    id="username"
                    type="text"
                    v-model="formData.username"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md"
                    required
                  />
                </div>
              </div>
              
              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <div class="mt-1">
                  <input
                    id="email"
                    type="email"
                    v-model="formData.email"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md"
                    required
                  />
                </div>
              </div>
              
              <!-- Buttons -->
              <div class="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  @click="isEditing = false"
                  class="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg-primary hover:bg-gray-50 dark:hover:bg-dark-bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
                  :disabled="saving"
                >
                  <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <ChangePasswordForm />
    </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useAuthStore } from '~/stores/auth';
  import { useApi } from '~/composables/useApi';
  import ChangePasswordForm from '~/components/admin/ChangePasswordForm.vue';
  
  // Define page meta
  definePageMeta({
    layout: 'admin'
  });
  
  // User interface
  interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    lastLogin?: string;
  }
  
  // State
  const user = ref<User>({
    id: 0,
    name: '',
    username: '',
    email: '',
    role: ''
  });
  const loading = ref(true);
  const error = ref<string | null>(null);
  const isEditing = ref(false);
  const saving = ref(false);
  
  // Form data for editing
  const formData = reactive({
    name: '',
    username: '',
    email: ''
  });
  
  // Auth store
  const authStore = useAuthStore();
  
  // Fetch user profile
  const fetchProfile = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      // First try to get from auth store
      if (authStore.user) {
        user.value = { ...authStore.user };
        initFormData();
        loading.value = false;
        return;
      }
      
      // Otherwise fetch from API
      const { apiFetch } = useApi();
      const { data, error: fetchError } = await apiFetch<User>('/auth/profile');
      
      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Failed to fetch profile');
      }
      
      if (data.value && data.value.success) {
        user.value = data.value.data;
        initFormData();
      } else {
        throw new Error('Invalid API response');
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred while fetching profile';
    } finally {
      loading.value = false;
    }
  };
  
  // Initialize form data from user
  const initFormData = () => {
    formData.name = user.value.name;
    formData.username = user.value.username;
    formData.email = user.value.email;
  };
  
  // Update profile
  const updateProfile = async () => {
    saving.value = true;
    
    try {
      const { apiFetch } = useApi();
      const { data, error: updateError } = await apiFetch<User>('/auth/profile', {
        method: 'PUT',
        body: formData
      });
      
      if (updateError.value) {
        throw new Error(updateError.value.message || 'Failed to update profile');
      }
      
      if (data.value && data.value.success) {
        user.value = data.value.data;
        isEditing.value = false;
        // Update auth store
        if (authStore.user) {
          authStore.user = user.value;
        }
      } else {
        throw new Error('Invalid API response');
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred while updating profile';
    } finally {
      saving.value = false;
    }
  };
  
  // Format role
  const formatRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'user':
        return 'Pengguna';
      default:
        return role;
    }
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Belum pernah login';
    
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Fetch profile on component mount
  onMounted(() => {
    fetchProfile();
  });
</script>