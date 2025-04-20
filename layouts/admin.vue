<template>
    <div class="h-screen flex overflow-hidden bg-gray-100">
      <!-- Sidebar Component -->
      <AdminSidebar :sidebarOpen="sidebarOpen" @update:sidebarOpen="sidebarOpen = $event" />
      
      <div class="flex flex-col w-0 flex-1 overflow-hidden">
        <!-- Header -->
        <header class="bg-white shadow-sm z-10">
          <div class="flex justify-between items-center px-4 py-4 sm:px-6 lg:px-8">
            <div class="flex items-center">
              <!-- Mobile menu button -->
              <button
                @click="sidebarOpen = true"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
              >
                <span class="sr-only">Buka menu</span>
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
              <h1 class="text-2xl font-semibold text-gray-900 ml-2 md:ml-0">{{ pageTitle }}</h1>
            </div>
  
            <!-- Profile dropdown -->
            <Menu as="div" class="ml-3 relative">
              <div>
                <MenuButton class="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span class="sr-only">Buka menu pengguna</span>
                  <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
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
        </header>
  
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
  
  // State untuk kontrol sidebar mobile
  const sidebarOpen = ref(false)
  
  // Mengambil rute untuk menentukan judul halaman
  const route = useRoute()
  
  // Menentukan judul halaman berdasarkan rute
  const pageTitle = computed(() => {
    // Mengembalikan judul berdasarkan path
    if (route.path === '/admin') return 'Dashboard Admin'
    if (route.path.startsWith('/admin/blog')) return 'Manajemen Blog'
    if (route.path.startsWith('/admin/users')) return 'Manajemen Pengguna'
    
    // Default title
    return 'Admin Panel'
  })
  
  // Update sidebar state ketika route berubah (tutup sidebar di mobile saat navigasi)
  watch(() => route.path, () => {
    sidebarOpen.value = false
  })
  
  // Fungsi untuk logout
  const logout = () => {
    // Implementasi logout di sini
    console.log('Logout')
  }
</script>