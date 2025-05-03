<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

// Inisialisasi auth hanya di client-side
if (process.client) {
  onMounted(async () => {
    const authStore = useAuthStore();
    await authStore.init();
  });
}
</script>