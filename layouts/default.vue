<template>
  <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <AppHeader />
      
      <!-- Main Content -->
      <div class="pt-20 pb-20">
          <main class="max-w-[640px] mx-auto px-4 balanced-container">
              <slot />
          </main>
      </div>
      
      <!-- Bottom Navigation -->
      <BottomNav />
  </div>
</template>

<script setup>
import AppHeader from '~/components/AppHeader.vue';
import BottomNav from '~/components/BottomNav.vue';
</script>

<style>
/* Global styles */
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  -webkit-tap-highlight-color: transparent;
  background-color: #f3f4f6;
}

.font-arabic {
  font-family: 'Scheherazade New', serif;
}

/* This class ensures balanced margins */
.balanced-container {
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;
}

/* Apply balanced padding to fixed elements */
header, nav {
  padding-left: 16px !important;
  padding-right: 16px !important;
}
</style>