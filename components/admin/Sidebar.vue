<template>
  <div class="bg-blue-800 dark:bg-dark-bg-secondary w-64 flex-shrink-0 hidden md:block h-screen">
    <div class="flex items-center h-16 flex-shrink-0 px-4 bg-blue-900 dark:bg-gray-900">
      <h1 class="text-white font-bold text-xl">{{ appName }}</h1>
    </div>
    <div class="flex-1 flex flex-col overflow-y-auto">
      <nav class="flex-1 px-2 py-4 space-y-1">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.path"
          class="group flex items-center px-4 py-3 text-base font-medium rounded-md"
          :class="[
            isExactActivePath(item.path)
              ? 'bg-blue-700 dark:bg-blue-900 text-white'
              : 'text-blue-100 hover:bg-blue-700 dark:hover:bg-dark-bg-primary hover:text-white'
          ]"
        >
          <div
            class="mr-3 flex-shrink-0 h-6 w-6"
            :class="[
              isExactActivePath(item.path) 
                ? 'text-white' 
                : 'text-blue-300 dark:text-gray-400 group-hover:text-white'
            ]"
            v-html="item.icon"
          ></div>
          {{ item.name }}
        </NuxtLink>
      </nav>
    </div>
  </div>

  <!-- Sidebar Mobile (overlay) dengan dark mode support -->
  <Transition
    enter-active-class="transition ease-out duration-100 transform"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition ease-in duration-75 transform"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="sidebarOpen" class="md:hidden fixed inset-0 flex z-40">
      <div class="fixed inset-0" @click="closeSidebar">
        <div class="absolute inset-0 bg-gray-600 dark:bg-gray-900 opacity-75"></div>
      </div>
      <div class="relative flex-1 flex flex-col max-w-xs w-full bg-blue-800 dark:bg-dark-bg-secondary">
        <div class="absolute top-0 right-0 -mr-12 pt-2">
          <button
            @click="closeSidebar"
            class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <span class="sr-only">Tutup sidebar</span>
            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex items-center h-16 flex-shrink-0 px-4 bg-blue-900 dark:bg-gray-900">
          <h1 class="text-white font-bold text-xl">{{ appName }}</h1>
        </div>
        <div class="mt-5 flex-1 h-0 overflow-y-auto">
          <nav class="px-2 space-y-1">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.path"
              class="group flex items-center px-4 py-3 text-base font-medium rounded-md"
              :class="[
                isExactActivePath(item.path)
                  ? 'bg-blue-700 dark:bg-blue-900 text-white'
                  : 'text-blue-100 hover:bg-blue-700 dark:hover:bg-dark-bg-primary hover:text-white'
              ]"
              @click="closeSidebar"
            >
              <div
                class="mr-3 flex-shrink-0 h-6 w-6"
                :class="[
                  isExactActivePath(item.path) 
                    ? 'text-white' 
                    : 'text-blue-300 dark:text-gray-400 group-hover:text-white'
                ]"
                v-html="item.icon"
              ></div>
              {{ item.name }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  
  // Definisi tipe untuk item navigasi
  interface NavigationItem {
    name: string;
    path: string;
    icon: string;
  }
  
  // Props untuk mengontrol tampilan sidebar di mobile
  const props = defineProps({
    sidebarOpen: {
      type: Boolean,
      default: false
    }
  })
  
  // Emit events untuk menutup sidebar
  const emit = defineEmits(['update:sidebarOpen'])
  
  // Fungsi untuk menutup sidebar
  const closeSidebar = () => {
    emit('update:sidebarOpen', false)
  }
  
  // Mengambil nama aplikasi dari konfigurasi runtime
  const { public: { appName } } = useRuntimeConfig()
  
  // Menggunakan composable untuk mendapatkan rute dengan pendekatan SSR-friendly
  const route = useRoute()
  
  // Item navigasi sidebar dengan ikon yang lebih modern
  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>'
    },
    {
      name: 'Blog',
      path: '/admin/blog',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>'
    },
    {
      name: 'Bookmark',
      path: '/admin/bookmark',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>'
    },
    {
      name: 'Pengguna',
      path: '/admin/users',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>'
    }
  ]
  
  // Variabel untuk menyimpan jalur saat ini
  const currentPath = ref<string>('')
  
  // Fungsi untuk memeriksa apakah halaman aktif dengan exact match
  const isExactActivePath = (path: string): boolean => {
    if (process.client) {
      // Client-side
      const currentPathValue = currentPath.value;
      
      // Untuk path "/admin", hanya aktif jika path sama persis
      if (path === '/admin') {
        return currentPathValue === '/admin';
      }
      
      // Untuk path lain (seperti "/admin/blog" atau "/admin/users"), 
      // aktif jika path dimulai dengan path tersebut
      return currentPathValue.startsWith(path);
    } else {
      // Server-side
      const routePath = route.path;
      
      // Untuk path "/admin", hanya aktif jika path sama persis
      if (path === '/admin') {
        return routePath === '/admin';
      }
      
      // Untuk path lain (seperti "/admin/blog" atau "/admin/users"), 
      // aktif jika path dimulai dengan path tersebut
      return routePath.startsWith(path);
    }
  }
  
  // Perbarui jalur saat route berubah
  watch(() => route.path, (newPath) => {
    currentPath.value = newPath
  }, { immediate: true })
  
  // Perbarui jalur saat komponen dimount
  onMounted(() => {
    if (process.client) {
      currentPath.value = window.location.pathname
      
      // Setup event listener untuk perubahan URL
      const handleRouteChange = () => {
        currentPath.value = window.location.pathname
      }
      
      // Tambahkan event listener untuk perubahan URL
      window.addEventListener('popstate', handleRouteChange)
      
      // Cleanup event listener saat komponen unmount
      return () => {
        window.removeEventListener('popstate', handleRouteChange)
      }
    }
  })
</script>