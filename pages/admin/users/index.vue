<template>
    <div>
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Manajemen Pengguna</h1>
          <p class="mt-1 text-sm text-gray-600">
            Kelola pengguna aplikasi Pemuda Persis Cimsel
          </p>
        </div>
        <button
          @click="openAddUserModal"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Tambah Pengguna
        </button>
      </div>
  
      <!-- Filter dan Pencarian -->
      <div class="mb-6 bg-white p-4 shadow sm:rounded-md">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="search" class="sr-only">Cari pengguna</label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                v-model="searchQuery"
                class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Cari nama, email, atau username"
                type="search"
              />
            </div>
          </div>
          <Listbox v-model="selectedRole" as="div" class="w-56">
            <ListboxLabel class="block text-sm font-medium text-gray-700">Peran</ListboxLabel>
            <div class="mt-1 relative">
              <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <span class="block truncate">{{ selectedRole.name }}</span>
                <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </span>
              </ListboxButton>
  
              <Transition
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <ListboxOptions class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  <ListboxOption
                    v-for="role in roles"
                    :key="role.id"
                    :value="role"
                    v-slot="{ active, selected }"
                  >
                    <div :class="[
                      active ? 'text-white bg-blue-600' : 'text-gray-900',
                      'cursor-default select-none relative py-2 pl-3 pr-9'
                    ]">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                        {{ role.name }}
                      </span>
  
                      <span
                        v-if="selected"
                        :class="[
                          active ? 'text-white' : 'text-blue-600',
                          'absolute inset-y-0 right-0 flex items-center pr-4'
                        ]"
                      >
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </ListboxOption>
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
  
      <!-- Tabel pengguna -->
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pengguna
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peran
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bergabung Pada
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in filteredUsers" :key="user.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                            {{ getUserInitials(user.name) }}
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ user.name }}
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ user.email }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ user.username }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="isValidRole(user.role) ? roleClasses[user.role] : ''">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="isValidStatus(user.status) ? statusClasses[user.status] : ''">
                        {{ user.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ user.joinDate }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex space-x-2 justify-end">
                        <button @click="openEditUserModal(user)" class="text-blue-600 hover:text-blue-900">
                          Edit
                        </button>
                        <button @click="openDeleteModal(user)" class="text-red-600 hover:text-red-900">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredUsers.length === 0">
                    <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                      Tidak ada pengguna yang ditemukan
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal tambah/edit pengguna -->
      <Dialog :open="isUserModalOpen" @close="closeUserModal" class="relative z-50">
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
  
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="mx-auto max-w-xl w-full rounded-lg bg-white p-6 shadow-xl">
              <DialogTitle class="text-lg font-medium leading-6 text-gray-900">
                {{ editMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru' }}
              </DialogTitle>
              
              <div class="mt-4">
                <form @submit.prevent="saveUser">
                  <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div class="sm:col-span-3">
                      <label for="name" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                      <div class="mt-1">
                        <input 
                          type="text" 
                          id="name" 
                          v-model="userForm.name" 
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                          required 
                        />
                      </div>
                    </div>
  
                    <div class="sm:col-span-3">
                      <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                      <div class="mt-1">
                        <input 
                          type="text" 
                          id="username" 
                          v-model="userForm.username" 
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                          required 
                        />
                      </div>
                    </div>
  
                    <div class="sm:col-span-6">
                      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                      <div class="mt-1">
                        <input 
                          type="email" 
                          id="email" 
                          v-model="userForm.email" 
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                          required 
                        />
                      </div>
                    </div>
  
                    <div class="sm:col-span-3" v-if="!editMode">
                      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                      <div class="mt-1">
                        <input 
                          type="password" 
                          id="password" 
                          v-model="userForm.password" 
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                          :required="!editMode" 
                        />
                      </div>
                    </div>
  
                    <div class="sm:col-span-3" v-if="!editMode">
                      <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                      <div class="mt-1">
                        <input 
                          type="password" 
                          id="confirmPassword" 
                          v-model="userForm.confirmPassword" 
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                          :required="!editMode" 
                        />
                      </div>
                    </div>
  
                    <div class="sm:col-span-3">
                      <label for="role" class="block text-sm font-medium text-gray-700">Peran</label>
                      <div class="mt-1">
                        <select 
                          id="role" 
                          v-model="userForm.role" 
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="Admin">Admin</option>
                          <option value="User">User</option>
                        </select>
                      </div>
                    </div>
  
                    <div class="sm:col-span-3">
                      <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                      <div class="mt-1">
                        <select 
                          id="status" 
                          v-model="userForm.status" 
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="Aktif">Aktif</option>
                          <option value="Nonaktif">Nonaktif</option>
                        </select>
                      </div>
                    </div>
                  </div>
  
                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      @click="closeUserModal"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {{ editMode ? 'Simpan Perubahan' : 'Tambah Pengguna' }}
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
  
      <!-- Modal konfirmasi hapus -->
      <Dialog :open="isDeleteModalOpen" @close="closeDeleteModal" class="relative z-50">
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
  
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
              <DialogTitle class="text-lg font-medium leading-6 text-gray-900">
                Hapus Pengguna
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus pengguna "{{ selectedUser?.name }}"? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
  
              <div class="mt-4 flex space-x-2 justify-end">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  @click="closeDeleteModal"
                >
                  Batal
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  @click="deleteUser"
                >
                  Hapus
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  
  // Definisikan layout untuk halaman ini
  definePageMeta({
    layout: 'admin'
  })
  
  // Define interfaces for type safety
  interface Role {
    id: number;
    name: string;
  }
  
  interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    status: string;
    joinDate: string;
  }
  
  interface UserForm {
    id: number | null;
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    status: string;
  }
  
  // Data dummy untuk pengguna
  const users = ref<User[]>([
    {
      id: 1,
      name: 'Ahmad Fauzi',
      username: 'ahmadfauzi',
      email: 'ahmad.fauzi@example.com',
      role: 'Admin',
      status: 'Aktif',
      joinDate: '15 Januari 2025'
    },
    {
      id: 2,
      name: 'Rizki Maulana',
      username: 'rizkimaulana',
      email: 'rizki.maulana@example.com',
      role: 'User',
      status: 'Aktif',
      joinDate: '20 Februari 2025'
    },
    {
      id: 3,
      name: 'Siti Khadijah',
      username: 'sitikhadijah',
      email: 'siti.khadijah@example.com',
      role: 'User',
      status: 'Aktif',
      joinDate: '5 Maret 2025'
    },
    {
      id: 4,
      name: 'Muhammad Yusuf',
      username: 'muhammadyusuf',
      email: 'muhammad.yusuf@example.com',
      role: 'Admin',
      status: 'Aktif',
      joinDate: '10 April 2025'
    },
    {
      id: 5,
      name: 'Farah Dilla',
      username: 'farahdilla',
      email: 'farah.dilla@example.com',
      role: 'User',
      status: 'Nonaktif',
      joinDate: '25 Maret 2025'
    }
  ])
  
  // Data peran
  const roles = ref<Role[]>([
    { id: 0, name: 'Semua Peran' },
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' }
  ])
  
  // State untuk filter
  const searchQuery = ref('')
  const selectedRole = ref<Role>(roles.value[0])
  
  // Pengguna yang terfilter berdasarkan pencarian dan peran
  const filteredUsers = computed(() => {
    let result = users.value
  
    // Filter berdasarkan pencarian
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
      )
    }
  
    // Filter berdasarkan peran
    if (selectedRole.value.id !== 0) { // 0 adalah 'Semua Peran'
      const roleName = selectedRole.value.name
      result = result.filter(user => user.role === roleName)
    }
  
    return result
  })
  
  // Kelas warna untuk peran dan status dengan type guards
  const roleClasses = {
    'Admin': 'bg-purple-100 text-purple-800',
    'User': 'bg-blue-100 text-blue-800'
  } as const

  const statusClasses = {
    'Aktif': 'bg-green-100 text-green-800',
    'Nonaktif': 'bg-red-100 text-red-800'
  } as const

  // Type guards untuk validasi peran dan status
  const isValidRole = (role: string): role is keyof typeof roleClasses => {
    return role in roleClasses
  }

  const isValidStatus = (status: string): status is keyof typeof statusClasses => {
    return status in statusClasses
  }
  
  // Mendapatkan inisial nama pengguna
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }
  
  // Modal tambah/edit pengguna
  const isUserModalOpen = ref(false)
  const editMode = ref(false)
  const userForm = ref<UserForm>({
    id: null,
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'User',
    status: 'Aktif'
  })
  
  const openAddUserModal = (): void => {
    editMode.value = false
    userForm.value = {
      id: null,
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'User',
      status: 'Aktif'
    }
    isUserModalOpen.value = true
  }
  
  const openEditUserModal = (user: User): void => {
    editMode.value = true
    userForm.value = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role,
      status: user.status
    }
    isUserModalOpen.value = true
  }
  
  const closeUserModal = (): void => {
    isUserModalOpen.value = false
  }
  
  const saveUser = (): void => {
    if (!editMode.value && userForm.value.password !== userForm.value.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok')
      return
    }
  
    const currentDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  
    if (editMode.value) {
      // Update pengguna yang sudah ada
      const index = users.value.findIndex(user => user.id === userForm.value.id)
      if (index !== -1) {
        users.value[index] = {
          ...users.value[index],
          name: userForm.value.name,
          username: userForm.value.username,
          email: userForm.value.email,
          role: userForm.value.role,
          status: userForm.value.status
        }
      }
    } else {
      // Tambah pengguna baru
      const newId = Math.max(...users.value.map(user => user.id)) + 1
      users.value.push({
        id: newId,
        name: userForm.value.name,
        username: userForm.value.username,
        email: userForm.value.email,
        role: userForm.value.role,
        status: userForm.value.status,
        joinDate: currentDate
      })
    }
  
    closeUserModal()
  }
  
  // Modal konfirmasi hapus
  const isDeleteModalOpen = ref(false)
  const selectedUser = ref<User | null>(null)
  
  const openDeleteModal = (user: User): void => {
    selectedUser.value = user
    isDeleteModalOpen.value = true
  }
  
  const closeDeleteModal = (): void => {
    isDeleteModalOpen.value = false
    selectedUser.value = null
  }
  
  const deleteUser = (): void => {
    if (selectedUser.value) {
      const userId = selectedUser.value.id
      users.value = users.value.filter(user => user.id !== userId)
      closeDeleteModal()
    }
  }
</script>