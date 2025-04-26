// components/AppHeader.vue
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
          <button @click="authStore.logout" class="text-white hover:text-blue-200">
            Logout
          </button>
        </nav>
        <nav v-else class="flex space-x-4">
          <NuxtLink to="/auth/login" class="text-white hover:text-blue-200">Login</NuxtLink>
        </nav>
      </div>
    </header>
  </div>
</template>

<script setup>
import { canAccessAdmin } from '~/utils/permissions';

const config = useRuntimeConfig();
const appName = config.public.appName;
const authStore = useAuthStore();
</script>