<!-- components/admin/Header.vue (dengan dark mode toggle) -->
<template>
  <!-- Admin Header with responsive design -->
  <div class="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-dark-bg-secondary shadow dark:shadow-gray-800">
    <!-- Mobile sidebar toggle button -->
    <button
      @click="openSidebar"
      class="px-4 border-r border-gray-200 dark:border-dark-border text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
      aria-label="Buka sidebar"
    >
      <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    </button>
    
    <!-- Main header content -->
    <div class="flex-1 px-4 flex justify-between">
      <!-- Page title -->
      <div class="flex-1 flex items-center">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-dark-text-primary">{{ pageTitle }}</h1>
      </div>
      
      <!-- Controls: Dark mode toggle & user profile -->
      <div class="ml-4 flex items-center md:ml-6 space-x-3">
        <!-- Dark Mode Toggle -->
        <DarkModeToggle />
        
        <!-- User profile and dropdown menu -->
        <Menu as="div" class="relative">
          <!-- User avatar button -->
          <div>
            <MenuButton class="max-w-xs bg-white dark:bg-dark-bg-secondary flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span class="sr-only">Buka menu pengguna</span>
              <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {{ userInitials }}
              </div>
            </MenuButton>
          </div>
          
          <!-- Dropdown menu with transition -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-dark-bg-secondary ring-1 ring-black ring-opacity-5 focus:outline-none">
              <MenuItem v-slot="{ active }">
                <NuxtLink
                  to="/admin/profile"
                  :class="[
                    active ? 'bg-gray-100 dark:bg-dark-bg-primary' : '', 
                    'block px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary'
                  ]"
                >
                  Profil Anda
                </NuxtLink>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <NuxtLink
                  to="/admin/settings"
                  :class="[
                    active ? 'bg-gray-100 dark:bg-dark-bg-primary' : '', 
                    'block px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary'
                  ]"
                >
                  Pengaturan
                </NuxtLink>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active ? 'bg-gray-100 dark:bg-dark-bg-primary' : '', 
                    'w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary'
                  ]"
                  @click="handleLogout"
                >
                  Keluar
                </button>
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import DarkModeToggle from './DarkModeToggle.vue'

// Props for page title
const props = defineProps({
  pageTitle: {
    type: String,
    default: 'Dashboard Admin'
  }
})

// Events for sidebar control
const emit = defineEmits(['update:sidebarOpen'])

// Router and auth store
const router = useRouter()
const authStore = useAuthStore()

// Compute user initials for avatar
const userInitials = computed(() => {
  const user = authStore.user
  
  if (!user || !user.name) return 'A'
  
  const nameParts = user.name.split(' ')
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase()
  }
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
})

// Open sidebar function
const openSidebar = () => {
  emit('update:sidebarOpen', true)
}

// Improved logout function with auth store integration
const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/auth/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>