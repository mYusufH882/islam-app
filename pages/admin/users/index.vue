<template>
    <div>
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Manajemen Pengguna</h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Kelola pengguna aplikasi Pemuda Persis Cimsel
          </p>
        </div>
        <button
          @click="openAddUserModal"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-offset-dark-bg-primary"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Tambah Pengguna
        </button>
      </div>

      <!-- Filter dan Pencarian -->
      <div class="mb-6 bg-white dark:bg-dark-bg-secondary p-4 shadow dark:shadow-gray-800 sm:rounded-md">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="search" class="sr-only">Cari pengguna</label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                v-model="searchQuery"
                class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md"
                placeholder="Cari nama, email, atau username"
                type="search"
                @input="onSearchInput"
              />
            </div>
          </div>
          <Listbox v-model="selectedStatus" as="div" class="w-56">
            <!-- <ListboxLabel class="block text-sm font-medium text-gray-700">Status</ListboxLabel> -->
            <div class="mt-1 relative">
              <ListboxButton class="bg-white dark:bg-dark-bg-primary relative w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white">
                <span class="block truncate">{{ selectedStatus.name }}</span>
                <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </span>
              </ListboxButton>

              <Transition
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <ListboxOptions class="absolute z-10 mt-1 w-full bg-white dark:bg-dark-bg-secondary shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  <ListboxOption
                    v-for="status in statuses"
                    :key="status.id"
                    :value="status"
                    v-slot="{ active, selected }"
                  >
                    <div :class="[
                      active ? 'text-white bg-blue-600 dark:bg-blue-800' : 'text-gray-900 dark:text-white',
                      'cursor-default select-none relative py-2 pl-3 pr-9'
                    ]">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                        {{ status.name }}
                      </span>

                      <span
                        v-if="selected"
                        :class="[
                          active ? 'text-white' : 'text-blue-600 dark:text-blue-400',
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

      <!-- State Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin h-8 w-8 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full"></div>
        <p class="mt-2 text-gray-500 dark:text-gray-400">Memuat data pengguna...</p>
      </div>

      <!-- State Error -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-700 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
            <div class="mt-2">
              <button 
                @click="fetchUsers" 
                class="text-sm text-red-700 dark:text-red-400 font-medium underline hover:text-red-600 dark:hover:text-red-300"
              >
                Coba lagi
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Tabel pengguna -->
      <div v-else class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-dark-bg-primary">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Pengguna
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Username
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Bergabung Pada
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-dark-bg-secondary divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-dark-bg-primary">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                            {{ getUserInitials(user.name) }}
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ user.name }}
                          </div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">
                            {{ user.email }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ user.username }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                            :class="getStatusClass(user.status)">
                        {{ user.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(user.createdAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex space-x-2 justify-end">
                        <button @click="openEditUserModal(user)" class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                          Edit
                        </button>
                        <button @click="openDeleteModal(user)" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="users.length === 0">
                    <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      Tidak ada pengguna yang ditemukan
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="users.length > 0" class="mt-4 flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-sm text-gray-700 dark:text-gray-300">
            Menampilkan <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span> hingga 
            <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> dari 
            <span class="font-medium">{{ pagination.total }}</span> pengguna
          </span>
        </div>
        <div class="flex space-x-2">
          <button 
            @click="prevPage" 
            class="px-3 py-1 border rounded-md text-sm text-gray-700 dark:text-gray-300 dark:border-gray-700"
            :disabled="pagination.page === 1"
            :class="[pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-dark-bg-primary']"
          >
            Sebelumnya
          </button>
          <button 
            @click="nextPage" 
            class="px-3 py-1 border rounded-md text-sm text-gray-700 dark:text-gray-300 dark:border-gray-700"
            :disabled="pagination.page === pagination.totalPages"
            :class="[pagination.page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-dark-bg-primary']"
          >
            Berikutnya
          </button>
        </div>
      </div>
  
      <!-- Modal tambah/edit pengguna -->
      <Dialog :open="isUserModalOpen" @close="closeUserModal" class="relative z-50">
        <div class="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="mx-auto max-w-xl w-full rounded-lg bg-white dark:bg-dark-bg-secondary p-6 shadow-xl relative">
              <button
                type="button"
                @click="closeUserModal"
                class="absolute top-3 right-3 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 z-10"
              >
                <span class="sr-only">Tutup</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <DialogTitle class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                {{ editMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru' }}
              </DialogTitle>
              
              <div class="mt-4">
                <div v-if="formErrors.global" class="mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-700 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-red-700 dark:text-red-400">{{ formErrors.global }}</p>
                    </div>
                  </div>
                </div>

                <form @submit.prevent="saveUser">
                  <!-- Error Global -->
                  <div v-if="formErrors.global" class="mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-700 p-4">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-red-700 dark:text-red-400">{{ formErrors.global }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div class="sm:col-span-3">
                      <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                      <div class="mt-1">
                        <input 
                          type="text" 
                          id="name" 
                          v-model="userForm.name" 
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md" 
                          :class="{'border-red-500 dark:border-red-500 ring-red-500': formErrors.name}"
                          required 
                        />
                      </div>
                      <p v-if="formErrors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ formErrors.name }}</p>
                    </div>

                    <div class="sm:col-span-3">
                      <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                      <div class="mt-1">
                        <input 
                          type="text" 
                          id="username" 
                          v-model="userForm.username" 
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md" 
                          :class="{'border-red-500 dark:border-red-500 ring-red-500': formErrors.username}"
                          required 
                        />
                      </div>
                      <p v-if="formErrors.username" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ formErrors.username }}</p>
                    </div>

                    <div class="sm:col-span-6">
                      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <div class="mt-1">
                        <input 
                          type="email" 
                          id="email" 
                          v-model="userForm.email" 
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md" 
                          :class="{'border-red-500 dark:border-red-500 ring-red-500': formErrors.email}"
                          required 
                        />
                      </div>
                      <p v-if="formErrors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ formErrors.email }}</p>
                    </div>

                    <div class="sm:col-span-3" v-if="!editMode">
                      <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                      <div class="mt-1">
                        <input 
                          type="password" 
                          id="password" 
                          v-model="userForm.password" 
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md" 
                          :class="{'border-red-500 dark:border-red-500 ring-red-500': formErrors.password}"
                          :required="!editMode" 
                        />
                      </div>
                      <p v-if="formErrors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ formErrors.password }}</p>
                    </div>

                    <div class="sm:col-span-3" v-if="!editMode">
                      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Konfirmasi Password</label>
                      <div class="mt-1">
                        <input 
                          type="password" 
                          id="confirmPassword" 
                          v-model="userForm.confirmPassword" 
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md" 
                          :class="{'border-red-500 dark:border-red-500 ring-red-500': formErrors.confirmPassword}"
                          :required="!editMode" 
                        />
                      </div>
                      <p v-if="formErrors.confirmPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ formErrors.confirmPassword }}</p>
                    </div>

                    <div class="sm:col-span-3">
                      <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                      <div class="mt-1">
                        <select 
                          id="status" 
                          v-model="userForm.status" 
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md"
                          :class="{'border-red-500 dark:border-red-500 ring-red-500': formErrors.status}"
                        >
                          <option value="active">Aktif</option>
                          <option value="inactive">Nonaktif</option>
                        </select>
                      </div>
                      <p v-if="formErrors.status" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ formErrors.status }}</p>
                    </div>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg-primary px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-dark-bg-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
                      @click="closeUserModal"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 dark:bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
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
        <div class="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="mx-auto max-w-md rounded-lg bg-white dark:bg-dark-bg-secondary p-6 shadow-xl">
              <DialogTitle class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Hapus Pengguna
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Apakah Anda yakin ingin menghapus pengguna "{{ selectedUser?.name }}"? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>

              <div class="mt-4 flex space-x-2 justify-end">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
                  @click="closeDeleteModal"
                >
                  Batal
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-600 dark:bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
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
import { ref, computed, watch, onMounted } from 'vue';
import { useUserManagementStore, type User, type CreateUserData, type UpdateUserData } from '~/stores/user-management';

// Definisikan layout untuk halaman ini
definePageMeta({
  layout: 'admin'
});

// Store
const userManagementStore = useUserManagementStore();

// Computed properties from store
const users = computed(() => userManagementStore.users);
const loading = computed(() => userManagementStore.loading);
const error = computed(() => userManagementStore.error);
const pagination = computed(() => userManagementStore.pagination);

// Local state
const isUserModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const editMode = ref(false);
const selectedUser = ref<User | null>(null);

// State management form
const formErrors = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  status: '',
  global: '' // Untuk error umum yang tidak terkait dengan field tertentu
});

// Fungsi untuk reset form errors
const resetFormErrors = () => {
  formErrors.value = {
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    status: '',
    global: ''
  };
};

// Form state dengan semua field yang diperlukan
const userForm = ref({
  id: null as number | null,
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  status: 'active' as 'active' | 'inactive',
  role: 'user'
});

// Fungsi untuk reset form
const resetUserForm = () => {
  userForm.value = {
    id: null,
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    status: 'active' as 'active' | 'inactive',
    role: 'user'
  };
};

// Watch selectedUser untuk mengisi form saat mode edit
watch(selectedUser, (user) => {
  if (user) {
    userForm.value = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      password: '',
      confirmPassword: '',
      status: user.status === 'inactive' ? 'inactive' : 'active' as 'active' | 'inactive',
      role: user.role || 'user'
    };
  } else {
    resetUserForm();
  }
});

// Opsi filter status
const statuses = [
  { id: 0, name: 'Semua Status', value: '' },
  { id: 1, name: 'Aktif', value: 'active' },
  { id: 2, name: 'Nonaktif', value: 'inactive' }
];

// State untuk filter
const searchQuery = ref('');
const selectedStatus = ref(statuses[0]);

// Set watcher untuk filter status
watch(selectedStatus, (newStatus) => {
  userManagementStore.setStatus(newStatus.value);
});

// Mendapatkan inisial nama pengguna
const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Format date
const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get status class
const getStatusClass = (status: string): string => {
  return status === 'active' 
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
};

// Debounce search
let searchTimeout: number | null = null;
const onSearchInput = () => {
  if (searchTimeout !== null) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = window.setTimeout(() => {
    userManagementStore.setSearchQuery(searchQuery.value);
  }, 300);
};

// Pagination methods
const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    userManagementStore.setPage(pagination.value.page + 1);
  }
};

const prevPage = () => {
  if (pagination.value.page > 1) {
    userManagementStore.setPage(pagination.value.page - 1);
  }
};

// Modal functions
const openAddUserModal = () => {
  editMode.value = false;
  selectedUser.value = null;
  resetUserForm();
  isUserModalOpen.value = true;
};

const openEditUserModal = (user: User) => {
  editMode.value = true;
  selectedUser.value = user;
  isUserModalOpen.value = true;
};

const closeUserModal = () => {
  isUserModalOpen.value = false;
  resetUserForm();
  resetFormErrors(); // Reset form errors saat modal ditutup
  editMode.value = false;
  selectedUser.value = null;
};

const openDeleteModal = (user: User) => {
  selectedUser.value = user;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedUser.value = null;
};

// Fetch users pada saat mount komponen
const fetchUsers = () => {
  userManagementStore.fetchUsers();
};

// Fungsi save user dengan tipe data yang sesuai
const saveUser = async () => {
  // Reset errors sebelum validasi baru
  resetFormErrors();
  
  // Validasi client-side
  let hasError = false;
  
  // Validasi nama
  if (!userForm.value.name.trim()) {
    formErrors.value.name = 'Nama lengkap harus diisi';
    hasError = true;
  }
  
  // Validasi username
  if (!userForm.value.username.trim()) {
    formErrors.value.username = 'Username harus diisi';
    hasError = true;
  } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(userForm.value.username)) {
    formErrors.value.username = 'Username harus 3-20 karakter (huruf, angka, underscore)';
    hasError = true;
  }
  
  // Validasi email
  if (!userForm.value.email.trim()) {
    formErrors.value.email = 'Email harus diisi';
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.value.email)) {
    formErrors.value.email = 'Format email tidak valid';
    hasError = true;
  }
  
  // Validasi password untuk user baru
  if (!editMode.value) {
    if (!userForm.value.password) {
      formErrors.value.password = 'Password harus diisi';
      hasError = true;
    } else if (userForm.value.password.length < 8) {
      formErrors.value.password = 'Password minimal 8 karakter';
      hasError = true;
    }
    
    if (userForm.value.password !== userForm.value.confirmPassword) {
      formErrors.value.confirmPassword = 'Konfirmasi password tidak cocok';
      hasError = true;
    }
  }
  
  // Jika ada error client-side, hentikan proses
  if (hasError) {
    return;
  }

  try {
    if (editMode.value && userForm.value.id) {
      // Update user
      const userData: UpdateUserData = {
        name: userForm.value.name,
        username: userForm.value.username,
        email: userForm.value.email,
        status: userForm.value.status
      };
      
      // Hanya tambahkan password jika diisi
      if (userForm.value.password) {
        userData.password = userForm.value.password;
      }
      
      const result = await userManagementStore.updateUser(userForm.value.id, userData);
      
      if (result.success) {
        closeUserModal();
        selectedStatus.value = statuses[0];
        userManagementStore.setStatus('');
        await userManagementStore.fetchUsers();
      } else if (result.errors) {
        // Tampilkan error dari server
        Object.entries(result.errors).forEach(([field, message]) => {
          if (field in formErrors.value) {
            formErrors.value[field as keyof typeof formErrors.value] = message as string;
          } else {
            formErrors.value.global = message as string;
          }
        });
      }
    } else {
      // Create user
      const userData: CreateUserData = {
        name: userForm.value.name,
        username: userForm.value.username,
        email: userForm.value.email,
        password: userForm.value.password,
        status: userForm.value.status
      };
      
      console.log('Sending user data:', userData);
      
      const result = await userManagementStore.createUser(userData);
      
      console.log('Create user result:', result);
      
      if (result.success) {
        closeUserModal();
        selectedStatus.value = statuses[0];
        userManagementStore.setStatus('');
        await userManagementStore.fetchUsers();
      } else if (result.errors) {
        // Tampilkan error dari server
        Object.entries(result.errors).forEach(([field, message]) => {
          if (field in formErrors.value) {
            formErrors.value[field as keyof typeof formErrors.value] = message as string;
          } else {
            formErrors.value.global = message as string;
          }
        });
      }
    }
  } catch (err: any) {
    console.error('Save user error:', err);
    formErrors.value.global = err.message || 'Terjadi kesalahan. Silakan coba lagi.';
  }
};

// Fungsi untuk menghapus pengguna
const deleteUser = async () => {
  if (!selectedUser.value) return;
  
  try {
    const success = await userManagementStore.deleteUser(selectedUser.value.id);
    
    if (success) {
      closeDeleteModal();
    }
  } catch (err: any) {
    alert(err.message || 'Terjadi kesalahan saat menghapus pengguna. Silakan coba lagi.');
    console.error('Delete user error:', err);
  }
};

// Panggil fetchUsers pada saat mount komponen
onMounted(() => {
  fetchUsers();
});
</script>