<template>
  <div>
    <!-- Header -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold">Profil Saya</h2>
      <p class="text-gray-600">Kelola informasi profil dan akun Anda</p>
    </div>
    
    <!-- Profile Information -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex items-center mb-4">
        <div v-if="user" class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
          {{ userInitials }}
        </div>
        <div v-if="user">
          <h3 class="text-lg font-medium">{{ user.name }}</h3>
          <p class="text-gray-600">{{ user.email }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ user.username }}</p>
        </div>
        <div v-else class="text-gray-500">
          Loading profile...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

// Get user
const user = computed(() => authStore.user);

// User initials
const userInitials = computed(() => {
  if (!user.value || !user.value.name) return '?';
  return user.value.name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

// Check authentication status on client-side only
onMounted(() => {
  if (process.client && !authStore.isAuthenticated) {
    window.location.href = '/auth/login?redirect=/profile';
  }
});
</script>