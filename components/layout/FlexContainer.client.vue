// components/layout/FlexContainer.client.vue
<template>
  <div 
    class="flex overflow-hidden" 
    :class="[
      darkMode ? 'dark bg-dark-bg-primary' : 'bg-gray-100',
      isMobile ? 'min-h-screen' : 'h-screen'
    ]"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useThemeStore } from '~/stores/theme.store';

const themeStore = useThemeStore();
const isMobile = ref(false);

// Dark mode state from store
const darkMode = computed(() => themeStore.darkMode);

// Check if the device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  // Check on mount
  checkMobile();
  
  // Add resize listener
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  // Remove resize listener
  window.removeEventListener('resize', checkMobile);
});
</script>