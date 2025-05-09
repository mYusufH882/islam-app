<template>
  <div class="relative">
    <Menu as="div" class="relative inline-block text-left">
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
            <p class="text-sm font-medium text-gray-900 truncate">{{ user.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
          </div>

          <!-- Menu Items -->
          <div class="py-1">
            <!-- Profile Link -->
            <MenuItem v-slot="{ active }">
              <button
                @click="navigateTo('/profile')"
                :class="[
                  active ? 'bg-blue-50 text-blue-700' : 'text-gray-700',
                  'flex w-full items-center px-4 py-2 text-sm'
                ]"
              >
                <svg class="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil Saya
              </button>
            </MenuItem>

            <!-- My Comments Link -->
            <MenuItem v-slot="{ active }">
              <button
                @click="navigateTo('/profile/comments')"
                :class="[
                  active ? 'bg-blue-50 text-blue-700' : 'text-gray-700',
                  'flex w-full items-center px-4 py-2 text-sm'
                ]"
              >
                <svg class="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Komentar Saya
              </button>
            </MenuItem>

            <!-- Bookmark Link -->
            <MenuItem v-slot="{ active }">
              <button
                @click="navigateTo('/bookmark')"
                :class="[
                  active ? 'bg-blue-50 text-blue-700' : 'text-gray-700',
                  'flex w-full items-center px-4 py-2 text-sm'
                ]"
              >
                <svg class="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Bookmark Saya
              </button>
            </MenuItem>
          </div>

          <!-- Admin Section (if user is admin) -->
          <div v-if="isAdmin" class="py-1">
            <MenuItem v-slot="{ active }">
              <button
                @click="navigateTo('/admin')"
                :class="[
                  active ? 'bg-blue-50 text-blue-700' : 'text-gray-700',
                  'flex w-full items-center px-4 py-2 text-sm'
                ]"
              >
                <svg class="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Panel Admin
              </button>
            </MenuItem>
          </div>

          <!-- Logout Section -->
          <div class="py-1">
            <MenuItem v-slot="{ active }">
              <button
                @click="logout"
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
</template>

<script setup>
import { computed } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

// Get user
const user = computed(() => authStore.user || {});

// User initials
const userInitials = computed(() => {
  if (!user.value.name) return '?';
  return user.value.name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

// Check if user is admin
const isAdmin = computed(() => {
  return user.value && user.value.role === 'admin';
});

// Standard Nuxt navigation - this is safer than using router directly
function navigateTo(path) {
  // Using normal DOM navigation avoids router issues
  window.location.href = path;
}

// Logout handler using standard approach
function logout() {
  authStore.logout().then(() => {
    window.location.href = '/auth/login';
  });
}
</script>