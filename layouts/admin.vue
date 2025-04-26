<template>
  <div class="h-screen flex overflow-hidden bg-gray-100">
    <!-- Sidebar Component -->
    <AdminSidebar :sidebarOpen="sidebarOpen" @update:sidebarOpen="sidebarOpen = $event" />
    
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <!-- Use existing admin Header component -->
      <AdminHeader 
        :pageTitle="pageTitle" 
        @update:sidebarOpen="sidebarOpen = true"
      />

      <!-- Main content -->
      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Page content -->
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminHeader from '~/components/admin/Header.vue'

const route = useRoute()
const sidebarOpen = ref(false)

const pageTitle = computed(() => {
  if (route.path === '/admin') return 'Dashboard Admin'
  if (route.path.startsWith('/admin/blog')) return 'Manajemen Blog'
  if (route.path.startsWith('/admin/users')) return 'Manajemen Pengguna'
  return 'Admin Panel'
})

watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>