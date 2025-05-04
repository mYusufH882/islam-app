<template>
    <div>
      <!-- Back button and actions bar -->
      <div class="mb-6 flex justify-between items-center">
        <NuxtLink
          to="/admin/blog"
          class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg-primary hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
        >
          <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </NuxtLink>
        
        <div class="flex space-x-3">
          <NuxtLink
            :to="`/admin/blog/${blogId}/edit`"
            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg-primary hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
          >
            <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Artikel
          </NuxtLink>
          
          <button
            @click="openPublishModal"
            v-if="blog && blog.status === 'draft'"
            class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-dark-bg-secondary"
          >
            <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Publikasikan
          </button>
          
          <button
            @click="openDeleteModal"
            class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-dark-bg-secondary"
          >
            <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Hapus
          </button>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        <button @click="fetchBlog" class="mt-2 text-blue-600 dark:text-blue-400">Coba lagi</button>
      </div>
      
      <!-- Blog details -->
      <div v-else-if="blog" class="space-y-6">
        <!-- Blog header -->
        <div class="bg-white dark:bg-dark-bg-secondary shadow dark:shadow-gray-800 rounded-lg overflow-hidden">
          <!-- Featured image -->
          <div v-if="blog.image" class="h-64 bg-gray-200 dark:bg-gray-800">
            <img 
              :src="blog.image" 
              :alt="blog.title"
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- Blog info -->
          <div class="p-6">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-3">
                <span 
                  class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium"
                  :class="getStatusClass(blog.status)"
                >
                  {{ getStatusLabel(blog.status) }}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(blog.publishedAt || blog.createdAt) }}
                </span>
              </div>
              <span 
                class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {{ blog.category?.name || 'Tidak ada kategori' }}
              </span>
            </div>
            
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ blog.title }}</h1>
            
            <div class="flex items-center mb-4">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {{ getAuthorInitials(blog.author) }}
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ blog.author?.name || 'Penulis tidak diketahui' }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ blog.author?.username || '' }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Blog content -->
        <div class="bg-white dark:bg-dark-bg-secondary shadow dark:shadow-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Konten Artikel</h2>
          
          <!-- Content preview in prose format for Markdown -->
          <div 
            class="prose dark:prose-invert prose-blue max-w-none"
            v-html="formattedContent"
          ></div>
        </div>
        
        <!-- Blog meta info -->
        <div class="bg-white dark:bg-dark-bg-secondary shadow dark:shadow-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Metadata</h2>
          
          <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">ID</h3>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ blog.id }}</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Dibuat Pada</h3>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDateTime(blog.createdAt) }}</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Terakhir Diupdate</h3>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDateTime(blog.updatedAt) }}</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Dipublikasikan Pada</h3>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ blog.publishedAt ? formatDateTime(blog.publishedAt) : 'Belum dipublikasikan' }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- "Not found" state -->
      <div v-else class="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow dark:shadow-gray-800 text-center">
        <svg class="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Artikel tidak ditemukan</h3>
        <p class="mt-2 text-gray-500 dark:text-gray-400">Artikel yang Anda cari tidak ditemukan atau mungkin telah dihapus.</p>
        <NuxtLink to="/admin/blog" class="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">Kembali ke daftar artikel</NuxtLink>
      </div>
      
      <!-- Publish confirmation modal -->
      <Dialog :open="isPublishModalOpen" @close="closePublishModal" class="relative z-50">
        <div class="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
        
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="mx-auto max-w-md rounded-lg bg-white dark:bg-dark-bg-secondary p-6 shadow-xl">
            <DialogTitle class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Publikasikan Artikel
            </DialogTitle>
            <div class="mt-2">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Apakah Anda yakin ingin mempublikasikan artikel "{{ blog?.title }}"? Artikel akan terlihat oleh publik setelah dipublikasikan.
              </p>
            </div>
            
            <div class="mt-6 flex justify-end space-x-2">
              <button
                @click="closePublishModal"
                class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg-primary px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
              >
                Batal
              </button>
              <button
                @click="publishBlog"
                class="inline-flex justify-center rounded-md border border-transparent bg-green-600 dark:bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
                :disabled="publishing"
              >
                <svg v-if="publishing" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publikasikan
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      
      <!-- Delete confirmation modal -->
      <Dialog :open="isDeleteModalOpen" @close="closeDeleteModal" class="relative z-50">
        <div class="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
        
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="mx-auto max-w-md rounded-lg bg-white dark:bg-dark-bg-secondary p-6 shadow-xl">
            <DialogTitle class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Hapus Artikel
            </DialogTitle>
            <div class="mt-2">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Apakah Anda yakin ingin menghapus artikel "{{ blog?.title }}"? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            
            <div class="mt-6 flex justify-end space-x-2">
              <button
                @click="closeDeleteModal"
                class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg-primary px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
              >
                Batal
              </button>
              <button
                @click="deleteBlog"
                class="inline-flex justify-center rounded-md border border-transparent bg-red-600 dark:bg-red-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
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
  import { ref, computed } from 'vue';
  import { useBlogStore } from '~/stores/blog.store';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  
  // Define layout for this page
  definePageMeta({
    layout: 'admin'
  });
  
  // Initialize variables
  const route = useRoute();
  const router = useRouter();
  const blogStore = useBlogStore();
  const blogId = computed(() => Number(route.params.id));
  
  // State
  const loading = ref(false);
  const error = ref(null);
  const blog = ref(null);
  
  // Modal states
  const isPublishModalOpen = ref(false);
  const isDeleteModalOpen = ref(false);
  const publishing = ref(false);
  const deleting = ref(false);
  
  // Format the blog content as HTML
  const formattedContent = computed(() => {
    if (!blog.value?.content) return '';
    
    try {
      // Parse markdown to HTML
      const html = marked.parse(blog.value.content);
      
      // Sanitize HTML to prevent XSS
      if (typeof window !== 'undefined' && DOMPurify) {
        return DOMPurify.sanitize(html);
      }
      return html;
    } catch (error) {
      console.error('Error formatting content:', error);
      return '<p>Error rendering content</p>';
    }
  });
  
  // Fetch blog data using lazy async data to avoid hydration issues
  const { pending } = useLazyAsyncData(
    `blog-${blogId.value}`,
    async () => {
      loading.value = true;
      error.value = null;
      
      try {
        // Try to get from store first
        const cachedBlog = blogStore.blogs.find(b => b.id === blogId.value) || 
                             blogStore.selectedBlog;
        
        if (cachedBlog) {
          blog.value = cachedBlog;
        } else {
          // Fetch from API if not in store
          await blogStore.fetchBlogById(blogId.value);
          blog.value = blogStore.selectedBlog;
        }
        
        if (!blog.value) {
          error.value = 'Artikel tidak ditemukan';
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        error.value = err.message || 'Terjadi kesalahan saat mengambil data artikel';
      } finally {
        loading.value = false;
      }
      
      return blog.value;
    }
  );
  
  // Methods for modals
  const openPublishModal = () => {
    isPublishModalOpen.value = true;
  };
  
  const closePublishModal = () => {
    isPublishModalOpen.value = false;
  };
  
  const openDeleteModal = () => {
    isDeleteModalOpen.value = true;
  };
  
  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
  };
  
  // Methods for blog actions
  const publishBlog = async () => {
    if (!blog.value) return;
    
    publishing.value = true;
    
    try {
      // Change status to published
      const success = await blogStore.updateBlog(blog.value.id, {
        status: 'published',
        publishedAt: new Date().toISOString()
      });
      
      if (success) {
        // Update local blog data
        blog.value.status = 'published';
        blog.value.publishedAt = new Date().toISOString();
        closePublishModal();
      }
    } catch (err) {
      console.error('Error publishing blog:', err);
      error.value = err.message || 'Terjadi kesalahan saat mempublikasikan artikel';
    } finally {
      publishing.value = false;
    }
  };
  
  const deleteBlog = async () => {
    if (!blog.value) return;
    
    deleting.value = true;
    
    try {
      const success = await blogStore.deleteBlog(blog.value.id);
      
      if (success) {
        // Redirect to blog list page
        router.push('/admin/blog');
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      error.value = err.message || 'Terjadi kesalahan saat menghapus artikel';
    } finally {
      deleting.value = false;
      closeDeleteModal();
    }
  };
  
  // Helper for manual fetch if needed
  const fetchBlog = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      await blogStore.fetchBlogById(blogId.value);
      blog.value = blogStore.selectedBlog;
      
      if (!blog.value) {
        error.value = 'Artikel tidak ditemukan';
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      error.value = err.message || 'Terjadi kesalahan saat mengambil data artikel';
    } finally {
      loading.value = false;
    }
  };
  
  // Helper functions
  const getStatusClass = (status) => {
    return status === 'published'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  };
  
  const getStatusLabel = (status) => {
    return status === 'published' ? 'Dipublikasikan' : 'Draft';
  };
  
  const getAuthorInitials = (author) => {
    if (!author || !author.name) return 'U';
    
    return author.name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Belum dipublikasikan';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (err) {
      return 'Tanggal tidak valid';
    }
  };
  
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Tanggal tidak valid';
    }
  };
</script>