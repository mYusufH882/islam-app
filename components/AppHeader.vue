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
            class="text-white hover:text-blue-200"
          >
            Logout
          </button>
        </nav>
        <nav v-else class="flex space-x-4">
          <NuxtLink to="/auth/login" class="text-white hover:text-blue-200">Login</NuxtLink>
        </nav>
      </div>
    </header>
    
    <!-- Logout confirmation modal (only for regular users) -->
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
import LogoutConfirmationModal from '~/components/LogoutConfirmationModal.vue';

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
const handleLogout = async () => {
  try {
    await authStore.logout();
    
    // Close the modal if it was open
    showLogoutModal.value = false;
    
    // Redirect to login page after successful logout
    router.push('/auth/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>