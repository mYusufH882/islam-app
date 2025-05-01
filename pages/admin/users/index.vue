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
                v-model="filters.search"
                class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Cari nama, email, atau username"
                type="search"
              />
            </div>
          </div>
          <Listbox v-model="filters.role" as="div" class="w-56">
            <div class="mt-1 relative">
              <ListboxButton class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <span class="block truncate">{{ filters.role.name }}</span>
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
                    v-for="role in roleOptions"
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
                  <tr v-if="loading">
                    <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                      <div class="flex justify-center">
                        <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    </td>
                  </tr>
                  <tr v-else-if="error">
                    <td colspan="6" class="px-6 py-4 text-center text-sm text-red-500">
                      {{ error }}
                      <button @click="fetchUsers" class="ml-2 text-blue-600 hover:text-blue-800 underline">
                        Coba lagi
                      </button>
                    </td>
                  </tr>
                  <tr v-else-if="users.length === 0">
                    <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                      Tidak ada pengguna yang ditemukan
                    </td>
                  </tr>
                  <tr v-for="user in users" :key="user.id" v-else>
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
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getRoleClass(user.role)">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(user.status)">
                        {{ user.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(user.createdAt) }}
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
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
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
                          <option value="active">Aktif</option>
                          <option value="inactive">Nonaktif</option>
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
  import { ref, computed, onMounted, watch } from 'vue'
  import { userService, type UserListParams } from '~/services/userService'
  
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
    createdAt: string;
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
  
  interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
  
  interface Filters {
    search: string;
    role: Role;
    status?: string;
  }
  
  // State untuk pengguna
  const users = ref<User[]>([]);
  const loading = ref(true);

  const error = ref<string | null>(null);

  // State untuk paginasi
  const pagination = ref<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  // State untuk filter
  const roleOptions = ref<Role[]>([
    { id: 0, name: 'Semua Peran' },
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' }
  ]);
  
  const filters = ref({
    search: '',
    role: roleOptions.value[0],
    status: '',
  });
  
  // Modal tambah/edit pengguna
  const isUserModalOpen = ref(false);
  const editMode = ref(false);
  const userForm = ref<UserForm>({
    id: null,
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    status: 'active'
  });
  
  // Modal konfirmasi hapus
  const isDeleteModalOpen = ref(false);
  const selectedUser = ref<User | null>(null);
  
  // Helper Functions
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getRoleClass = (role: string): string => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };
  
  const getStatusClass = (status: string): string => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Event Handlers for User Management
  const openAddUserModal = (): void => {
    editMode.value = false;
    userForm.value = {
      id: null,
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      status: 'active'
    };
    isUserModalOpen.value = true;
  };
  
  const openEditUserModal = (user: User): void => {
    editMode.value = true;
    userForm.value = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role,
      status: user.status
    };
    isUserModalOpen.value = true;
  };
  
  const closeUserModal = (): void => {
    isUserModalOpen.value = false;
  };
  
  const openDeleteModal = (user: User): void => {
    selectedUser.value = user;
    isDeleteModalOpen.value = true;
  };
  
  const closeDeleteModal = (): void => {
    isDeleteModalOpen.value = false;
    selectedUser.value = null;
  };
  
  const fetchUsers = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    
    try {
      // Membuat parameter untuk request
      const params: UserListParams = {
        page: pagination.value.page,
        limit: pagination.value.limit
      };
      
      // Menambahkan filter jika ada
      if (filters.value.search) {
        params.search = filters.value.search;
      }
      
      if (filters.value.role && filters.value.role.id !== 0) { // 0 adalah 'Semua Peran'
        params.role = filters.value.role.name === 'Admin' ? 'admin' : 'user';
      }
      
      if (filters.value.status) {
        params.status = filters.value.status;
      }
      
      // Memanggil service untuk mendapatkan data pengguna
      const { data, error: fetchError } = await userService.getUsers(params);
      
      if (fetchError.value) {
        throw new Error(fetchError.value.data?.message || 'Gagal mengambil data pengguna');
      }
      
      if (data.value && data.value.success) {
        const responseData = data.value.data;
        users.value = responseData.users;
        
        // Update pagination info
        pagination.value = {
          page: responseData.pagination.page,
          limit: responseData.pagination.limit,
          total: responseData.pagination.total,
          totalPages: responseData.pagination.totalPages
        };
      } else {
        throw new Error('Gagal mengambil data pengguna');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      error.value = err?.message || 'Terjadi kesalahan saat mengambil data pengguna';
      users.value = [];
    } finally {
      loading.value = false;
    }
  };
  
  const saveUser = async (): Promise<void> => {
    // Validate password match for new users
    if (!editMode.value && userForm.value.password !== userForm.value.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok');
      return;
    }
    
    try {
      // API call akan ditambahkan nanti
      
      // Close modal after success
      closeUserModal();
      
      // Refresh user list
      await fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };
  
  const deleteUser = async (): Promise<void> => {
    if (!selectedUser.value) return;
    
    try {
      // API call akan ditambahkan nanti
      
      // Close modal after success
      closeDeleteModal();
      
      // Refresh user list
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Tambahkan watcher untuk filter dan pagination
  watch([() => filters.value.search, () => filters.value.role, () => filters.value.status], () => {
    // Reset halaman ke 1 ketika filter berubah
    pagination.value.page = 1;
    fetchUsers();
  }, { deep: true });

  // Tambahkan watcher untuk pagination page
  watch(() => pagination.value.page, () => {
    fetchUsers();
  });
  
  // Load users saat komponen dimount
  onMounted(() => {
    fetchUsers();
  });
</script>