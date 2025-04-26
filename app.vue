<template>
  <div class="min-h-screen bg-gray-100">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { onMounted } from 'vue';

// Fungsi untuk inisialisasi autentikasi
const initializeAuth = async () => {
  const authStore = useAuthStore();
  
  try {
    // Lakukan inisialisasi auth store
    await authStore.init();
  } catch (error) {
    
    // Tangani kesalahan inisialisasi jika perlu
    const authStore = useAuthStore();
    authStore.logout(); // Pastikan state direset jika terjadi kesalahan
  }
};

// Gunakan onMounted untuk memastikan inisialisasi dilakukan setelah aplikasi dimuat
onMounted(initializeAuth);
</script>