<template>
  <div class="fixed top-0 left-0 right-0 z-10 bg-gray-100">
    <header class="bg-blue-600 text-white py-4 max-w-[640px] mx-auto rounded-b-lg">
      <div class="flex justify-between items-center px-4">
        <h1 class="text-xl font-bold">{{ appName }}</h1>
        
        <!-- Show admin link only for admin users -->
        <nav v-if="authStore.isAuthenticated" class="flex space-x-4">
          <NuxtLink 
            v-if="canAccessAdmin(authStore.user)" 
            to="/admin" 
            class="text-white hover:text-blue-200"
          >
            Admin
          </NuxtLink>
          <!-- Updated logout button with different behavior based on user role -->
          <button 
            @click="initiateLogout" 
            class="text-white hover:text-blue-200 flex items-center"
          >
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </nav>
        <nav v-else class="flex space-x-4">
          <NuxtLink to="/auth/login" class="text-white hover:text-blue-200 flex items-center">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login
          </NuxtLink>
        </nav>
      </div>
    </header>
    
    <!-- Logout confirmation modal (enhanced version) -->
    <LogoutConfirmationModal
      :is-open="showLogoutModal"
      @close="showLogoutModal = false"
      @confirm="handleLogout"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { canAccessAdmin } from '~/utils/permissions';
import { useAuthStore } from '~/stores/auth';
import LogoutConfirmationModal from './LogoutConfirmationModal.vue';

const router = useRouter();
const config = useRuntimeConfig();
const appName = config.public.appName;
const authStore = useAuthStore();

// State for logout modal
const showLogoutModal = ref(false);

// Initiates the logout process
const initiateLogout = () => {
  // For admin users: logout directly without confirmation
  // For regular users: show confirmation modal
  if (authStore.user && canAccessAdmin(authStore.user)) {
    handleLogout();
  } else {
    showLogoutModal.value = true;
  }
};

// Handle the actual logout after confirmation (or directly for admins)
const handleLogout = async (rememberUser = false) => {
  try {
    console.log('Logging out with remember user flag:', rememberUser);
    
    // Eksplisit meneruskan parameter rememberUser ke fungsi logout
    await authStore.logout(rememberUser);
    
    // Close the modal if it was open
    showLogoutModal.value = false;
    
    // Redirect to login page after successful logout
    router.push('/auth/login');
  } catch (error) {
    console.error('Logout error, but continuing with client-side logout:', error);
    
    // Jika API logout gagal, pastikan data remember me tetap disimpan jika diperlukan
    if (process.client) {
      if (rememberUser && authStore.user) {
        const userToRemember = {
          username: authStore.user.username || '',
          email: authStore.user.email || '',
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('remembered_user', JSON.stringify(userToRemember));
        localStorage.setItem('remember_me_enabled', 'true');
      }
      
      // Reset state
      authStore.$reset();
      router.push('/auth/login');
    }
  }
};
</script>