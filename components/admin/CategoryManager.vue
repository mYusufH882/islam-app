<!-- components/admin/CategoryManager.vue -->
<template>
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Manajemen Kategori</h3>
        <p class="mt-1 text-sm text-gray-500">Kelola kategori untuk artikel blog</p>
      </div>
      
      <div class="p-6">
        <!-- Category list -->
        <div class="mb-6">
          <div class="overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" class="divide-y divide-gray-200">
              <li v-for="category in categories" :key="category.id" class="group hover:bg-gray-50">
                <div class="flex items-center px-4 py-4 sm:px-6">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ category.name }}</p>
                      <div class="ml-2 flex-shrink-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          @click="editCategory(category)"
                          class="mr-2 text-blue-600 hover:text-blue-900"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click="confirmDelete(category)"
                          class="text-red-600 hover:text-red-900"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="mt-1">
                      <p class="text-sm text-gray-500">
                        {{ category.description || 'Tidak ada deskripsi' }}
                      </p>
                    </div>
                  </div>
                  <div class="ml-4 flex-shrink-0">
                    <div class="text-sm text-gray-500">{{ getBlogCount(category.id) }} artikel</div>
                  </div>
                </div>
              </li>
              <li v-if="categories.length === 0" class="px-4 py-6 text-center text-gray-500">
                Belum ada kategori. Tambahkan kategori baru.
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Add category form -->
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3">Tambah Kategori Baru</h4>
          <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-6 sm:gap-x-4">
            <div class="sm:col-span-4">
              <label for="categoryName" class="block text-sm font-medium text-gray-700">Nama Kategori</label>
              <div class="mt-1">
                <input
                  type="text"
                  id="categoryName"
                  v-model="newCategory.name"
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Nama kategori"
                />
              </div>
            </div>
            
            <div class="sm:col-span-6">
              <label for="categoryDescription" class="block text-sm font-medium text-gray-700">Deskripsi (Opsional)</label>
              <div class="mt-1">
                <textarea
                  id="categoryDescription"
                  v-model="newCategory.description"
                  rows="2"
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Deskripsi singkat tentang kategori ini"
                ></textarea>
              </div>
            </div>
          </div>
          
          <div class="mt-4 flex justify-end">
            <button
              type="button"
              @click="addCategory"
              :disabled="!newCategory.name || saving"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ editMode ? 'Perbarui Kategori' : 'Tambah Kategori' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <Dialog :open="deleteModalOpen" @close="cancelDelete" class="relative z-50">
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
            <DialogTitle class="text-lg font-medium leading-6 text-gray-900">
              Konfirmasi Hapus
            </DialogTitle>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus kategori "<span class="font-medium">{{ categoryToDelete?.name }}</span>"?
                <span v-if="getBlogCount(categoryToDelete?.id) > 0" class="text-red-600">
                  Kategori ini digunakan oleh {{ getBlogCount(categoryToDelete?.id) }} artikel.
                </span>
              </p>
            </div>
            
            <div class="mt-6 flex justify-end space-x-2">
              <button
                @click="cancelDelete"
                class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Batal
              </button>
              <button
                @click="deleteCategory"
                class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                :disabled="deleting"
              >
                <svg v-if="deleting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Hapus
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue';
  import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
  import { useBlogStore, type Category } from '~/stores/blog.store';
  
  // Store
  const blogStore = useBlogStore();
  const categories = computed(() => blogStore.categories);
  
  // State
  const newCategory = reactive({
    id: null as number | null,
    name: '',
    description: ''
  });
  const saving = ref(false);
  const editMode = ref(false);
  
  // Delete modal state
  const deleteModalOpen = ref(false);
  const categoryToDelete = ref<Category | null>(null);
  const deleting = ref(false);
  
  // Fetch categories on mount
  onMounted(async () => {
    if (categories.value.length === 0) {
      await blogStore.fetchCategories();
    }
  });
  
  // Get count of blogs in a category
  function getBlogCount(categoryId?: number) {
    if (!categoryId) return 0;
    return blogStore.blogs.filter(blog => blog.categoryId === categoryId).length;
  }
  
  // Edit category
  function editCategory(category: Category) {
    newCategory.id = category.id;
    newCategory.name = category.name;
    newCategory.description = category.description || '';
    editMode.value = true;
  }
  
  // Add/Update category
  async function addCategory() {
    if (!newCategory.name) return;
    
    saving.value = true;
    
    try {
      // In a real app, you would call your API here
      if (editMode.value && newCategory.id) {
        // Update existing category
        const index = categories.value.findIndex(c => c.id === newCategory.id);
        if (index !== -1) {
          categories.value[index] = {
            ...categories.value[index],
            name: newCategory.name,
            description: newCategory.description
          };
        }
      } else {
        // Add new category
        const newCat: Category = {
          id: Math.floor(Math.random() * 1000) + 100, // Temporary ID for demo
          name: newCategory.name,
          description: newCategory.description
        };
        
        categories.value.push(newCat);
      }
      
      // Reset form
      newCategory.id = null;
      newCategory.name = '';
      newCategory.description = '';
      editMode.value = false;
    } catch (err) {
      console.error('Category operation failed:', err);
    } finally {
      saving.value = false;
    }
  }
  
  // Delete category confirmation
  function confirmDelete(category: Category) {
    categoryToDelete.value = category;
    deleteModalOpen.value = true;
  }
  
  function cancelDelete() {
    deleteModalOpen.value = false;
    categoryToDelete.value = null;
  }
  
  async function deleteCategory() {
    if (!categoryToDelete.value) return;
    
    deleting.value = true;
    
    try {
      // In a real app, you would call your API here
      const index = categories.value.findIndex(c => c.id === categoryToDelete.value?.id);
      if (index !== -1) {
        categories.value.splice(index, 1);
      }
      
      deleteModalOpen.value = false;
      categoryToDelete.value = null;
    } catch (err) {
      console.error('Delete category failed:', err);
    } finally {
      deleting.value = false;
    }
  }
</script>