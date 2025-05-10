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
            isActivePath(item.path)
              ? 'bg-blue-700 dark:bg-blue-900 text-white'
              : 'text-blue-100 hover:bg-blue-700 dark:hover:bg-dark-bg-primary hover:text-white'
          ]"
        >
          <div
            class="mr-3 flex-shrink-0 h-6 w-6"
            :class="[
              isActivePath(item.path) 
                ? 'text-white' 
                : 'text-blue-300 dark:text-gray-400 group-hover:text-white'
            ]"
            v-html="item.icon"
          ></div>
          <div class="flex items-center">
            {{ item.name }}
            <!-- Badge untuk menu Komentar -->
            <span 
              v-if="item.path === '/admin/comment' && pendingCount > 0" 
              class="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full"
            >
              {{ pendingCount }}
            </span>
          </div>
        </NuxtLink>
      </nav>
    </div>
  </div>

  <!-- Sidebar Mobile (overlay) -->
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
                isActivePath(item.path)
                  ? 'bg-blue-700 dark:bg-blue-900 text-white'
                  : 'text-blue-100 hover:bg-blue-700 dark:hover:bg-dark-bg-primary hover:text-white'
              ]"
              @click="closeSidebar"
            >
              <div
                class="mr-3 flex-shrink-0 h-6 w-6"
                :class="[
                  isActivePath(item.path) 
                    ? 'text-white' 
                    : 'text-blue-300 dark:text-gray-400 group-hover:text-white'
                ]"
                v-html="item.icon"
              ></div>
              <div class="flex items-center">
                {{ item.name }}
                <!-- Badge untuk menu Komentar (mobile) -->
                <span 
                  v-if="item.path === '/admin/comment' && pendingCount > 0" 
                  class="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full"
                >
                  {{ pendingCount }}
                </span>
              </div>
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAdminCommentStore } from '~/stores/adminComment.store';

// Props for controlling the sidebar state
const props = defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false
  }
});

// Emit events for sidebar control
const emit = defineEmits(['update:sidebarOpen']);

// Close sidebar function
const closeSidebar = () => {
  emit('update:sidebarOpen', false);
};

// Get app name from runtime config
const { public: { appName } } = useRuntimeConfig();

// Current route
const route = useRoute();

// Admin comment store untuk notifikasi
const adminCommentStore = useAdminCommentStore();
const pendingCount = computed(() => adminCommentStore.pendingCount);

// Timer untuk refresh notifikasi
let notificationTimer = null;

// Navigation items with icons
const navigation = [
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
    name: 'Komentar',
    path: '/admin/comment',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>'
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
];

// Function to check if path is active
const isActivePath = (path) => {
  if (path === '/admin') {
    return route.path === '/admin';
  }
  return route.path.startsWith(path);
};

// Cek jumlah komentar pending pada saat komponen dimuat
onMounted(() => {
  // Ambil data komentar pending
  adminCommentStore.fetchCommentCounts();
  
  // Set timer untuk mengecek komentar pending setiap 1 menit
  notificationTimer = setInterval(() => {
    adminCommentStore.fetchCommentCounts();
  }, 60000); // 60000 ms = 1 menit
});

// Bersihkan timer ketika komponen dihapus
onUnmounted(() => {
  if (notificationTimer) {
    clearInterval(notificationTimer);
  }
});
</script>