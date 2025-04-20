<template>
    <!-- Header -->
    <div class="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        @click="openSidebar"
        class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
      >
        <span class="sr-only">Buka sidebar</span>
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>
      <div class="flex-1 px-4 flex justify-between">
        <div class="flex-1 flex items-center">
          <h1 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h1>
        </div>
        <div class="ml-4 flex items-center md:ml-6">
          <!-- Profile dropdown -->
          <Menu as="div" class="ml-3 relative">
            <div>
              <MenuButton class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <span class="sr-only">Buka menu pengguna</span>
                <div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  A
                </div>
              </MenuButton>
            </div>
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                  >
                    Profil Anda
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                  >
                    Pengaturan
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                    @click="logout"
                  >
                    Keluar
                  </a>
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  
  // Props untuk judul halaman
  const props = defineProps({
    pageTitle: {
      type: String,
      default: 'Dashboard Admin'
    }
  })
  
  // Emit events untuk membuka sidebar di mobile
  const emit = defineEmits(['update:sidebarOpen'])
  
  // Fungsi untuk membuka sidebar
  const openSidebar = () => {
    emit('update:sidebarOpen', true)
  }
  
  // Fungsi untuk logout
  const logout = () => {
    // Implementasi logout di sini
    console.log('Logout')
  }
</script>