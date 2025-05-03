// layouts/admin.vue (updated)
<template>
  <ClientOnly>
    <FlexContainer>
      <ClientSidebar :sidebarOpen="sidebarOpen" @update:sidebarOpen="sidebarOpen = $event" />
      
      <div class="flex flex-col w-0 flex-1 overflow-hidden">
        <!-- Admin Header -->
        <AdminHeader 
          :pageTitle="pageTitle" 
          @update:sidebarOpen="sidebarOpen = true"
        />

        <!-- Main content -->
        <main class="flex-1 relative overflow-y-auto focus:outline-none dark:bg-dark-bg-primary">
          <div class="py-6">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <!-- Page content -->
              <slot />
            </div>
          </div>
        </main>
      </div>
    </FlexContainer>
    
    <template #fallback>
      <!-- Fallback content for SSR -->
      <div class="min-h-screen flex">
        <div class="bg-blue-800 w-64 hidden md:block"></div>
        <div class="flex-1 bg-gray-100">
          <div class="h-16 bg-white shadow"></div>
          <div class="p-6">
            <div class="animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div class="h-8 bg-gray-200 rounded mb-6"></div>
              <div class="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeStore } from '~/stores/theme.store';
import AdminHeader from '~/components/admin/Header.vue';
import ClientSidebar from '~/components/admin/ClientSidebar.client.vue';
import FlexContainer from '~/components/layout/FlexContainer.client.vue';

const route = useRoute();
const sidebarOpen = ref(false);
const themeStore = useThemeStore();

// Page title computation
const pageTitle = computed(() => {
  if (route.path === '/admin') return 'Dashboard Admin';
  if (route.path.startsWith('/admin/blog')) return 'Manajemen Blog';
  if (route.path.startsWith('/admin/users')) return 'Manajemen Pengguna';
  return 'Admin Panel';
});

// Initialize theme when component is mounted
onMounted(() => {
  themeStore.initTheme();
});

watch(() => route.path, () => {
  sidebarOpen.value = false;
});
</script>