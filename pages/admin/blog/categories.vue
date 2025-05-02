<!-- pages/admin/blog/categories.vue -->
<template>
    <div>
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Manajemen Kategori</h1>
          <p class="mt-1 text-sm text-gray-600">
            Kelola kategori untuk artikel blog Islami
          </p>
        </div>
        <NuxtLink
          to="/admin/blog"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Kembali ke Daftar Artikel
        </NuxtLink>
      </div>
  
      <!-- Category Summary Cards -->
      <div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Kategori</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ totalCategories }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Kategori Terpakai</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ usedCategories }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Kategori Terpopuler</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ mostPopularCategory }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Category Manager Component -->
      <CategoryManager />
    </div>
</template>

<script setup lang="ts">
    // Define admin layout
    definePageMeta({
        layout: 'admin'
    });
  
    import { computed, onMounted } from 'vue';
    import { useBlogStore } from '~/stores/blog.store';
    import CategoryManager from '~/components/admin/CategoryManager.vue';
  
    // Initialize blog store
    const blogStore = useBlogStore();
    
    // Computed properties for category statistics
    const totalCategories = computed(() => {
        return blogStore.categories.length;
    });
    
    const usedCategories = computed(() => {
        // Get unique category IDs from blogs
        const usedCategoryIds = new Set(blogStore.blogs.map(blog => blog.categoryId));
        return usedCategoryIds.size;
    });
  
    const mostPopularCategory = computed(() => {
    // Count blogs per category
    const categoryCounts: Record<string, number> = {};
    
    blogStore.blogs.forEach(blog => {
        const categoryId = String(blog.categoryId);
        categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
    });
    
    // Find category with highest count
    let maxCount = 0;
    let popularCategoryId: string | null = null;
    
    Object.entries(categoryCounts).forEach(([categoryId, count]) => {
        if (count > maxCount) {
        maxCount = count;
        popularCategoryId = categoryId;
        }
    });
    
    // Get category name or return placeholder if none found
    if (popularCategoryId === null) return 'Belum ada';
    
    // Now we know popularCategoryId is not null, so it's safe to parse
    const categoryIdNumber = parseInt(popularCategoryId);
    const category = blogStore.categories.find(cat => cat.id === categoryIdNumber);
    return category ? category.name : 'Tidak diketahui';
    });
  
    // Load data
    onMounted(async () => {
        // Fetch both blogs and categories to calculate statistics
        await Promise.all([
        blogStore.fetchBlogs(),
        blogStore.fetchCategories()
    ]);
  });
</script>