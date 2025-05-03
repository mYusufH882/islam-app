<template>
  <div class="bg-white dark:bg-dark-bg-secondary shadow dark:shadow-gray-800 overflow-hidden sm:rounded-lg">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
        {{ isEdit ? 'Edit Artikel' : 'Artikel Baru' }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ isEdit ? 'Perbarui konten artikel' : 'Buat artikel blog baru' }}
      </p>
    </div>
    
    <div class="p-6">
      <form @submit.prevent="saveBlog">
        <!-- Alert for errors -->
        <div v-if="error" class="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-700 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-6">
          <!-- Title input -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Judul</label>
            <div class="mt-1">
              <input 
                id="title" 
                v-model="formData.title" 
                type="text" 
                required
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md"
                placeholder="Masukkan judul artikel"
              />
            </div>
            <p v-if="titleError" class="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{{ titleError }}</p>
          </div>
          
          <!-- Category selection -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</label>
            <div class="mt-1">
              <!-- Show loading indicator while categories are loading -->
              <div v-if="categoriesLoading" class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memuat kategori...
              </div>
              
              <select 
                v-else
                id="category" 
                v-model="formData.categoryId" 
                required
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md"
              >
                <option disabled value="0">Pilih kategori</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              
              <!-- Debug information -->
              <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Total kategori tersedia: {{ categories.length }}
              </div>
            </div>
            <div class="mt-2 flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Tidak menemukan kategori yang sesuai?</span>
              <button 
                type="button" 
                @click="showCategoryForm = true"
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Tambah Kategori Baru
              </button>
            </div>
          </div>
          
          <!-- Featured image upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Gambar Thumbnail</label>
            <div class="mt-1 flex items-center">
              <div v-if="imagePreview" class="relative flex-shrink-0 h-24 w-24 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                <img :src="imagePreview" class="h-full w-full object-cover" />
                <button 
                  type="button"
                  @click="removeImage"
                  class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 dark:hover:bg-red-700"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div v-else class="flex-shrink-0 h-24 w-24 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-dark-bg-primary">
                <svg class="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <button
                type="button"
                @click="triggerFilePicker"
                class="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg-primary hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
              >
                {{ imagePreview ? 'Ubah Gambar' : 'Unggah Gambar' }}
              </button>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileChange"
              />
            </div>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">JPG, PNG, atau GIF. Ukuran maksimal 2MB.</p>
          </div>
          
          <!-- Content editor -->
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Konten</label>
            <div class="mt-1">
              <!-- Rich Text Editor Toolbar -->
              <div class="border border-b-0 border-gray-300 dark:border-gray-700 rounded-t-md bg-gray-50 dark:bg-dark-bg-primary p-2 flex flex-wrap gap-1">
                <button 
                  type="button" 
                  @click="formatText('bold')"
                  class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" 
                  title="Bold"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  @click="formatText('italic')"
                  class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" 
                  title="Italic"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  @click="formatText('heading')"
                  class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" 
                  title="Heading"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  @click="formatText('link')"
                  class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" 
                  title="Link"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  @click="formatText('quote')"
                  class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" 
                  title="Quote"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  @click="formatText('list')"
                  class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" 
                  title="List"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  @click="clearFormatting"
                  class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" 
                  title="Clear Formatting"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <!-- Text Editor -->
              <textarea
                id="content"
                v-model="formData.content"
                required
                rows="12"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-b-md dark:bg-dark-bg-primary dark:text-white"
                placeholder="Tulis konten artikel disini..."
              ></textarea>
            </div>
            <p v-if="contentError" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ contentError }}</p>
          </div>
          
          <!-- Preview section -->
        <div v-if="showPreview" class="border border-gray-300 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-dark-bg-primary mt-6">
            <div class="flex justify-between items-center mb-4">
                <h4 class="text-lg font-medium text-gray-900 dark:text-white">Preview Artikel</h4>
                <button 
                type="button"
                @click="showPreview = false" 
                class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            <div class="prose dark:prose-invert prose-blue max-w-none" v-html="previewContent"></div>
        </div>
          
          <!-- Status and options -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="status" 
                type="checkbox" 
                v-model="isPublished" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary rounded"
              />
              <label for="status" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Publikasikan sekarang
              </label>
            </div>
            <button 
              type="button"
              @click="showPreview = true" 
              class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg-primary hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
            >
              <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
          </div>
        </div>
        
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
          <NuxtLink 
            to="/admin/blog" 
            class="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg-primary hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
          >
            Batal
          </NuxtLink>
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
            :disabled="saving"
          >
            <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isEdit ? 'Perbarui Artikel' : 'Simpan Artikel' }}
          </button>
        </div>
      </form>
    </div>
    
    <!-- Add Category Modal -->
    <Dialog :open="showCategoryForm" @close="showCategoryForm = false" class="relative z-50">
      <div class="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
      
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="mx-auto max-w-md rounded-lg bg-white dark:bg-dark-bg-secondary p-6 shadow-xl">
          <DialogTitle class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Tambah Kategori Baru
          </DialogTitle>
          
          <div class="mt-4">
            <label for="categoryName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Kategori</label>
            <div class="mt-1">
              <input 
                id="categoryName" 
                v-model="newCategory.name" 
                type="text" 
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md"
                placeholder="Nama kategori"
              />
            </div>
          </div>
          
          <div class="mt-4">
            <label for="categoryDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi (Opsional)</label>
            <div class="mt-1">
              <textarea 
                id="categoryDescription" 
                v-model="newCategory.description" 
                rows="3"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md"
                placeholder="Deskripsi singkat tentang kategori"
              ></textarea>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="showCategoryForm = false"
              class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg-primary px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
            >
              Batal
            </button>
            <button
              @click="addCategory"
              class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 dark:bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
              :disabled="!newCategory.name || addingCategory"
            >
              <svg v-if="addingCategory" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Tambah Kategori
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </div>
</template>
  
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { useBlogStore } from '~/stores/blog.store';
import type { Blog, Category } from '~/types/blog';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

// Props
interface Props {
  isEdit?: boolean;
  blog?: Blog;
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  blog: undefined
});

// Router
const router = useRouter();
const route = useRoute();

// Store
const blogStore = useBlogStore();
const categories = computed(() => blogStore.categories || []);
const categoriesLoading = ref(true);

// File upload refs
const fileInput = ref<HTMLInputElement | null>(null);
const imagePreview = ref<string | null>(null);

// Form data with proper typing
const formData = reactive({
  title: '',
  content: '',
  categoryId: 0,
  image: null as File | null,
  status: 'draft' as 'draft' | 'published' // Properly typed status
});

// State
const isPublished = ref(false);
const error = ref('');
const saving = ref(false);
const showPreview = ref(false);

// Validation errors
const titleError = ref('');
const contentError = ref('');

// Category form
const showCategoryForm = ref(false);
const newCategory = reactive({
  name: '',
  description: ''
});
const addingCategory = ref(false);

// Fill form with existing data for edit mode
onMounted(async () => {
  // Immediately start loading categories to ensure they're available
  loadCategories();
  
  if (props.isEdit) {
    if (props.blog) {
      // If blog is provided as prop
      populateForm(props.blog);
    } else {
      // Get blog from store or fetch it
      const blogId = Number(route.params.id);
      const cachedBlog = blogStore.blogs.find(b => b.id === blogId) || 
                          blogStore.selectedBlog;
      
      if (cachedBlog) {
        populateForm(cachedBlog);
      } else {
        await blogStore.fetchBlogById(blogId);
        if (blogStore.selectedBlog) {
          populateForm(blogStore.selectedBlog);
        }
      }
    }
  }
});

// Dedicated function to load categories
async function loadCategories() {
  categoriesLoading.value = true;
  try {
    console.log('Loading categories...');
    if (!categories.value.length) {
      console.log('Categories not found in store, fetching...');
      await blogStore.fetchCategories();
      console.log('Categories fetched:', categories.value);
    } else {
      console.log('Categories already in store:', categories.value);
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  } finally {
    categoriesLoading.value = false;
  }
}

// Watch for changes in isPublished
watch(isPublished, (newValue) => {
  formData.status = newValue ? 'published' : 'draft';
});

// Helper to populate the form
function populateForm(blog: Blog) {
  formData.title = blog.title;
  formData.content = blog.content;
  formData.categoryId = blog.categoryId;
  formData.status = blog.status as 'draft' | 'published'; // Type assertion
  isPublished.value = blog.status === 'published';
  
  if (blog.image) {
    imagePreview.value = blog.image;
  }
}

// Image upload handling
function triggerFilePicker() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  
  const file = target.files[0];
  
  // Check file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    error.value = 'Ukuran file terlalu besar. Maksimal 2MB.';
    return;
  }
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    error.value = 'File harus berupa gambar.';
    return;
  }
  
  formData.image = file;
  imagePreview.value = URL.createObjectURL(file);
  
  // Reset error if successful
  error.value = '';
}

// Tambahkan di bagian state BlogForm.vue
const imageWasRemoved = ref(false);

// Update function removeImage
function removeImage() {
  formData.image = null;
  imagePreview.value = null;
  imageWasRemoved.value = true;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

// Text formatting
function formatText(type: string) {
  const textarea = document.getElementById('content') as HTMLTextAreaElement;
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = formData.content.substring(start, end);
  
  let replacement = '';
  
  switch (type) {
    case 'bold':
      replacement = `**${selectedText}**`;
      break;
    case 'italic':
      replacement = `*${selectedText}*`;
      break;
    case 'heading':
      replacement = `\n## ${selectedText}\n`;
      break;
    case 'link':
      const url = prompt('Enter URL:', 'https://');
      if (url) {
        replacement = `[${selectedText || 'Link text'}](${url})`;
      } else {
        return;
      }
      break;
    case 'quote':
      replacement = `\n> ${selectedText}\n`;
      break;
    case 'list':
      replacement = selectedText.split('\n').map(line => `- ${line}`).join('\n');
      break;
  }
  
  formData.content = 
    formData.content.substring(0, start) + 
    replacement + 
    formData.content.substring(end);
  
  // Set focus back to textarea
  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(start + replacement.length, start + replacement.length);
  }, 0);
}

function clearFormatting() {
  const textarea = document.getElementById('content') as HTMLTextAreaElement;
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = formData.content.substring(start, end);
  
  // Simple regex to remove markdown formatting
  const plainText = selectedText
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1')     // Italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/^#{1,6}\s+/gm, '')     // Headings
    .replace(/^>\s+/gm, '')          // Blockquotes
    .replace(/^-\s+/gm, '');         // Lists
  
  formData.content = 
    formData.content.substring(0, start) + 
    plainText + 
    formData.content.substring(end);
  
  // Set focus back to textarea
  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(start, start + plainText.length);
  }, 0);
}

// In your script section
const previewContent = computed(() => {
  try {
    // Safely parse markdown to HTML
    let html;
    try {
      html = marked.parse(formData.content);
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return '<p>Error parsing markdown</p>';
    }
    
    // Safely sanitize HTML
    if (typeof window !== 'undefined' && DOMPurify) {
      return DOMPurify.sanitize(html);
    }
    return html;
  } catch (error) {
    console.error('Error in preview generation:', error);
    return '<p>Error generating preview</p>';
  }
});

// Category management
async function addCategory() {
  if (!newCategory.name) return;
  
  addingCategory.value = true;
  
  try {
    // Create the new category object
    const newCat: Category = {
      id: Math.floor(Math.random() * 1000) + 100, // Temporary ID for demonstration
      name: newCategory.name,
      description: newCategory.description
    };
    
    // Instead of using addCategory (which doesn't exist), 
    // directly add to the categories array in the store
    // This is a temporary solution - in a real app, you'd have a proper API call
    blogStore.categories.push(newCat);
    
    // Update form data to select the new category
    formData.categoryId = newCat.id;
    
    // Reset new category form
    newCategory.name = '';
    newCategory.description = '';
    
    // Close the modal
    showCategoryForm.value = false;
  } catch (err: any) {
    error.value = err.message || 'Failed to add category';
  } finally {
    addingCategory.value = false;
  }
}

// Form submission
async function saveBlog() {
  // Reset errors
  error.value = '';
  titleError.value = '';
  contentError.value = '';
  
  // Validate
  if (formData.title.trim().length < 3) {
    titleError.value = 'Judul harus minimal 3 karakter';
    return;
  }
  
  if (formData.content.trim().length < 10) {
    contentError.value = 'Konten terlalu pendek';
    return;
  }
  
  if (!formData.categoryId) {
    error.value = 'Silakan pilih kategori';
    return;
  }
  
  saving.value = true;
  
  try {
    // Extract excerpt from content (first 150 chars)
    const excerpt = formData.content.replace(/<[^>]*>?/gm, '').substring(0, 150);
    
    // Gunakan FormData untuk upload file
    const form = new FormData();
    form.append('title', formData.title);
    form.append('content', formData.content);
    form.append('excerpt', excerpt);
    form.append('categoryId', formData.categoryId.toString());
    form.append('status', formData.status);
    
    // Tambahkan file gambar jika ada
    if (formData.image) {
      form.append('image', formData.image);
    }
    
    // Tambahkan flag untuk menghapus gambar jika diperlukan
    if (props.isEdit && imagePreview.value === null && imageWasRemoved.value) {
      form.append('removeImage', 'true');
    }
    
    let success = false;
    
    if (props.isEdit) {
      // Update existing blog
      const blogId = Number(route.params.id);
      success = await blogStore.updateBlog(blogId, form);
    } else {
      // Create new blog
      success = await blogStore.createBlog(form);
    }
    
    if (success) {
      router.push('/admin/blog');
    } else {
      error.value = 'Gagal menyimpan artikel. Silakan coba lagi.';
    }
  } catch (err) {
    console.error('Update blog error:', err);
  } finally {
    saving.value = false;
  }
}
</script>