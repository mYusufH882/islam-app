<template>
  <div class="fixed top-0 left-0 right-0 z-10 bg-gray-100">
    <header class="bg-blue-600 text-white py-4 max-w-[640px] mx-auto rounded-b-lg">
      <div class="flex justify-between items-center px-4">
        <h1 class="text-xl font-bold">{{ appName }}</h1>
        
        <!-- Mobile menu button (only visible on mobile) -->
        <button 
          v-if="authStore.isAuthenticated" 
          class="md:hidden flex items-center text-white"
          @click="isSidebarOpen = true"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <!-- Desktop navigation -->
        <nav v-if="authStore.isAuthenticated" class="hidden md:flex space-x-4 items-center">
          <NuxtLink 
            v-if="canAccessAdmin(authStore.user)" 
            to="/admin" 
            class="text-white hover:text-blue-200"
          >
            Admin
          </NuxtLink>
          
          <!-- User Profile Dropdown - only rendered on client side -->
          <ClientOnly>
            <div class="relative inline-block text-left">
              <Menu as="div" class="relative inline-block text-left">
                <div>
                  <MenuButton class="flex items-center text-white hover:text-blue-200">
                    <!-- Avatar Circle with Initials -->
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                      {{ userInitials }}
                    </div>
                    <!-- Dropdown Arrow -->
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </MenuButton>
                </div>

                <!-- Dropdown Menu -->
                <transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <MenuItems class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                    <!-- User Info Section -->
                    <div class="px-4 py-3">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user?.name }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email }}</p>
                    </div>

                    <!-- Menu Items -->
                    <div class="py-1">
                      <!-- Profile Link -->
                      <MenuItem v-slot="{ active }">
                        <a 
                          href="/profile" 
                          :class="[
                            active ? 'bg-blue-50 text-blue-700' : 'text-gray-700',
                            'flex items-center px-4 py-2 text-sm'
                          ]"
                        >
                          <svg class="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profil Saya
                        </a>
                      </MenuItem>

                      <!-- My Comments Link -->
                      <MenuItem v-slot="{ active }">
                        <a 
                          href="/profile/comments" 
                          :class="[
                            active ? 'bg-blue-50 text-blue-700' : 'text-gray-700',
                            'flex items-center px-4 py-2 text-sm'
                          ]"
                        >
                          <svg class="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          Komentar Saya
                        </a>
                      </MenuItem>

                      <!-- Bookmark Link -->
                      <MenuItem v-slot="{ active }">
                        <a 
                          href="/bookmark" 
                          :class="[
                            active ? 'bg-blue-50 text-blue-700' : 'text-gray-700',
                            'flex items-center px-4 py-2 text-sm'
                          ]"
                        >
                          <svg class="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          Bookmark Saya
                        </a>
                      </MenuItem>
                    </div>

                    <!-- Admin Section (if user is admin) -->
                    <div v-if="authStore.user?.role === 'admin'" class="py-1">
                      <MenuItem v-slot="{ active }">
                        <a 
                          href="/admin" 
                          :class="[
                            active ? 'bg-blue-50 text-blue-700' : 'text-gray-700',
                            'flex items-center px-4 py-2 text-sm'
                          ]"
                        >
                          <svg class="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Panel Admin
                        </a>
                      </MenuItem>
                    </div>

                    <!-- Logout Section -->
                    <div class="py-1">
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="initiateLogout"
                          :class="[
                            active ? 'bg-blue-50 text-blue-700' : 'text-gray-700',
                            'flex w-full items-center px-4 py-2 text-sm'
                          ]"
                        >
                          <svg class="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </ClientOnly>
        </nav>
        
        <!-- Show login button for guests -->
        <nav v-else class="flex space-x-4">
          <NuxtLink to="/auth/login" class="text-white hover:text-blue-200 flex items-center">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login
          </NuxtLink>
        </nav>
      </div>
    </header>
    
    <!-- Mobile Sidebar -->
    <Transition
      enter-active-class="transition ease-in-out duration-300 transform"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-300 transform"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="isSidebarOpen && authStore.isAuthenticated" 
        class="fixed inset-0 flex z-40"
      >
        <!-- Overlay -->
        <div 
          class="fixed inset-0 bg-black bg-opacity-50" 
          @click="isSidebarOpen = false"
        ></div>
        
        <!-- Sidebar panel - Posisi di kanan -->
        <div class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white ml-auto transform transition ease-in-out duration-300">
          <div class="absolute top-0 left-0 -ml-12 pt-2">
            <button 
              type="button" 
              class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              @click="isSidebarOpen = false"
            >
              <span class="sr-only">Close sidebar</span>
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- User info -->
          <div class="flex-shrink-0 flex items-center px-4">
            <div v-if="authStore.user" class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {{ userInitials }}
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-gray-800">{{ authStore.user.name }}</div>
                <div class="text-sm font-medium text-gray-500">{{ authStore.user.email }}</div>
              </div>
            </div>
          </div>
          
          <!-- Mobile sidebar navigation -->
          <div class="mt-5 flex-1 h-0 overflow-y-auto">
            <nav class="px-2 space-y-1">
              <!-- Profile link -->
              <a 
                href="/profile" 
                class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                @click="isSidebarOpen = false"
              >
                <svg class="mr-4 h-6 w-6 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil Saya
              </a>
              
              <!-- My Comments link -->
              <a 
                href="/profile/comments" 
                class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                @click="isSidebarOpen = false"
              >
                <svg class="mr-4 h-6 w-6 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Komentar Saya
              </a>
              
              <!-- Bookmark link -->
              <a 
                href="/bookmark" 
                class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                @click="isSidebarOpen = false"
              >
                <svg class="mr-4 h-6 w-6 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Bookmark Saya
              </a>

              <!-- Admin panel (only for admin users) -->
              <a 
                v-if="authStore.user && authStore.user.role === 'admin'"
                href="/admin" 
                class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                @click="isSidebarOpen = false"
              >
                <svg class="mr-4 h-6 w-6 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Panel Admin
              </a>
              
              <!-- Logout -->
              <a 
                href="#" 
                class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50"
                @click.prevent="initiateLogout"
              >
                <svg class="mr-4 h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </a>
            </nav>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Logout confirmation modal (existing) -->
    <LogoutConfirmationModal
      :is-open="showLogoutModal"
      @close="showLogoutModal = false"
      @confirm="handleLogout"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { canAccessAdmin } from '~/utils/permissions';
import { useAuthStore } from '~/stores/auth';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import LogoutConfirmationModal from './LogoutConfirmationModal.vue';

const config = useRuntimeConfig();
const appName = config.public.appName;
const authStore = useAuthStore();

// State for mobile sidebar
const isSidebarOpen = ref(false);

// State for logout modal
const showLogoutModal = ref(false);

// Compute user initials for avatar
const userInitials = computed(() => {
  if (!authStore.user || !authStore.user.name) return '?';
  return authStore.user.name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

// Initiates the logout process
const initiateLogout = () => {
  // For admin users: logout directly without confirmation
  // For regular users: show confirmation modal
  if (authStore.user && canAccessAdmin(authStore.user)) {
    handleLogout();
  } else {
    showLogoutModal.value = true;
  }
};

// Handle the actual logout after confirmation (or directly for admins)
const handleLogout = async (rememberUser = false) => {
  // Close the sidebar if it's open
  isSidebarOpen.value = false;
  
  try {
    // Pass rememberUser parameter to logout function
    await authStore.logout(rememberUser);
    
    // Close the modal if it was open
    showLogoutModal.value = false;
    
    // Redirect to login page after successful logout
    if (process.client) {
      window.location.href = '/auth/login';
    }
  } catch (error) {
    console.error('Logout error, but continuing with client-side logout:', error);
    
    // If API logout fails, make sure remember me data is still saved if needed
    if (process.client) {
      if (rememberUser && authStore.user) {
        const userToRemember = {
          username: authStore.user.username || '',
          email: authStore.user.email || '',
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('remembered_user', JSON.stringify(userToRemember));
        localStorage.setItem('remember_me_enabled', 'true');
      }
      
      // Reset state
      authStore.$reset();
      
      // Redirect to login
      window.location.href = '/auth/login';
    }
  }
};

// Menangani perubahan sidebar dan mencegah scroll pada body
watch(isSidebarOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      // Prevent scrolling on body when sidebar is open
      document.body.classList.add('overflow-hidden');
    } else {
      // Allow scrolling again when sidebar is closed
      document.body.classList.remove('overflow-hidden');
    }
  }
});

// Check window resize to auto close sidebar on desktop
const handleResize = () => {
  if (process.client) {
    const isDesktop = window.innerWidth >= 768; // 768px is Tailwind's 'md' breakpoint
    if (isDesktop && isSidebarOpen.value) {
      isSidebarOpen.value = false;
    }
  }
};

// Try to get route for auto-closing sidebar on navigation
try {
  const route = useRoute();
  // Close sidebar when route changes
  if (route) {
    watch(() => route.path, () => {
      isSidebarOpen.value = false;
    });
  }
} catch (error) {
  // If useRoute fails, handle gracefully
  console.log('Route not available at this stage');
}

// Setup and cleanup event listeners
onMounted(() => {
  if (process.client) {
    window.addEventListener('resize', handleResize);
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', handleResize);
    document.body.classList.remove('overflow-hidden');
  }
});
</script>