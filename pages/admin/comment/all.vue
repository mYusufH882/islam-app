<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Manajemen Komentar</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Lihat dan kelola semua komentar pada platform
        </p>
      </div>
      
      <div class="flex space-x-3">
        <NuxtLink
          to="/admin/comment"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg-primary hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
        >
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Kembali ke Dashboard
        </NuxtLink>
      </div>
    </div>
    
    <!-- Filter and Actions -->
    <div class="mb-6 bg-white dark:bg-dark-bg-secondary p-4 rounded-lg shadow dark:shadow-gray-800">
      <div class="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
        <!-- Status filter -->
        <div class="w-full lg:w-1/4">
          <label for="status-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            v-model="statusFilter"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            @change="applyFilters"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu Moderasi</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
            <option value="spam">Spam</option>
          </select>
        </div>
        
        <!-- Blog filter (placeholder for future implementation) -->
        <div class="w-full lg:w-1/4">
          <label for="blog-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Blog
          </label>
          <select
            id="blog-filter"
            v-model="blogFilter"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            @change="applyFilters"
          >
            <option value="">Semua Blog</option>
            <!-- Blog filter options will be filled dynamically -->
          </select>
        </div>
        
        <!-- Search input -->
        <div class="w-full lg:w-2/4">
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cari komentar
          </label>
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
              placeholder="Cari berdasarkan konten atau nama pengguna"
              type="search"
              @input="onSearchInput"
            />
          </div>
        </div>
      </div>
      
      <!-- Bulk action tools (Only visible when comments are selected) -->
      <div v-if="hasSelectedComments" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            {{ selectedComments.length }} komentar dipilih
          </div>
          <div class="flex space-x-2">
            <button
              @click="bulkApprove"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-offset-dark-bg-secondary"
            >
              Setujui Semua
            </button>
            <button
              @click="bulkReject"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-offset-dark-bg-secondary"
            >
              Tolak Semua
            </button>
            <button
              @click="bulkSpam"
              class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg-primary hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
            >
              Tandai Spam
            </button>
            <button
              @click="bulkDelete"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-offset-dark-bg-secondary"
            >
              Hapus Semua
            </button>
            <button
              @click="clearSelection"
              class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg-primary hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
            >
              Batal Pilih
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-700 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
          <button @click="fetchComments" class="mt-2 text-sm text-red-700 dark:text-red-400 font-medium underline hover:text-red-600 dark:hover:text-red-300">
            Coba lagi
          </button>
        </div>
      </div>
    </div>
    
    <!-- Comment table -->
    <div v-else>
      <div class="bg-white dark:bg-dark-bg-secondary rounded-lg shadow dark:shadow-gray-800 overflow-hidden">
        <!-- Empty state -->
        <div v-if="comments.length === 0" class="p-6 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Tidak ada komentar ditemukan</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Cobalah mengubah filter pencarian Anda.
          </p>
        </div>
        
        <!-- Comment table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <input 
                    type="checkbox"
                    :checked="comments.length > 0 && selectedComments.length === comments.length"
                    @change="toggleSelectAll"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary rounded"
                  />
                </th>
                <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pengguna
                </th>
                <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Konten
                </th>
                <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Blog
                </th>
                <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tanggal
                </th>
                <th scope="col" class="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-dark-bg-secondary divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="comment in comments" :key="comment.id" class="hover:bg-gray-50 dark:hover:bg-dark-bg-primary">
                <td class="px-3 py-4 whitespace-nowrap">
                  <input 
                    type="checkbox"
                    :checked="isCommentSelected(comment.id)"
                    @change="toggleCommentSelection(comment.id)"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary rounded"
                  />
                </td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': comment.status === 'pending',
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': comment.status === 'approved',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': comment.status === 'rejected',
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200': comment.status === 'spam'
                    }"
                  >
                    {{ getStatusLabel(comment.status) }}
                  </span>
                </td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                      {{ getUserInitials(comment.author?.name) }}
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ comment.author?.name || 'Unknown User' }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        @{{ comment.author?.username }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-4">
                  <div class="text-sm text-gray-900 dark:text-white line-clamp-2">
                    {{ comment.content }}
                  </div>
                  <div v-if="comment.parentId" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>Balasan ke komentar lain</span>
                  </div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ truncateText(comment.blog?.title || 'Unknown Blog', 20) }}
                  </div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(comment.createdAt) }}
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="viewInContext(comment.blogId)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      title="Lihat Konteks"
                    >
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    
                    <button
                      v-if="comment.status !== 'approved'"
                      @click="approveComment(comment.id)"
                      class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                      title="Setujui"
                    >
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    
                    <button
                      v-if="comment.status !== 'rejected'"
                      @click="rejectComment(comment.id)"
                      class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      title="Tolak"
                    >
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    <button
                      v-if="comment.status !== 'spam'"
                      @click="markAsSpam(comment.id)"
                      class="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300"
                      title="Spam"
                    >
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </button>
                    
                    <button
                      @click="deleteComment(comment.id)"
                      class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                      title="Hapus"
                    >
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg-primary"
            :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800'"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg-primary"
            :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800'"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing
              <span class="font-medium">{{ ((currentPage - 1) * limit) + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(currentPage * limit, totalItems) }}</span>
              of
              <span class="font-medium">{{ totalItems }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg-primary text-sm font-medium text-gray-500 dark:text-gray-400"
                :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800'"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <!-- Page numbers -->
              <button
                v-for="page in paginationRange"
                :key="typeof page === 'number' ? page : `ellipsis-${page}`"
                @click="goToPage(page)"
                :disabled="page === '...'"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === currentPage
                    ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-700 text-blue-600 dark:text-blue-300'
                    : 'bg-white dark:bg-dark-bg-primary border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
                  page === '...' ? 'cursor-default' : ''
                ]"
              >
                {{ page }}
              </button>
              
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg-primary text-sm font-medium text-gray-500 dark:text-gray-400"
                :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800'"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal (basic implementation) -->
    <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <div class="inline-block align-bottom bg-white dark:bg-dark-bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-dark-bg-secondary px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Konfirmasi Hapus
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-dark-bg-primary px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="confirmDelete"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Hapus
            </button>
            <button 
              type="button" 
              @click="cancelDelete"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-dark-bg-secondary text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdminCommentStore } from '~/stores/adminComment.store';
import { useBlogStore } from '~/stores/blog.store';
import { useRouter } from 'vue-router';

// Define page meta
definePageMeta({
  layout: 'admin',
});

// Store
const adminCommentStore = useAdminCommentStore();
const blogStore = useBlogStore();
const router = useRouter();

// Local state
const searchQuery = ref('');
const searchTimeout = ref<number | null>(null);
const statusFilter = ref('');
const blogFilter = ref('');
const showDeleteModal = ref(false);
const commentToDelete = ref<number | null>(null);

// Computed properties
const comments = computed(() => adminCommentStore.comments);
const loading = computed(() => adminCommentStore.loading.list || adminCommentStore.loading.action);
const error = computed(() => adminCommentStore.error);
const currentPage = computed(() => adminCommentStore.pagination.page);
const totalPages = computed(() => adminCommentStore.pagination.totalPages);
const totalItems = computed(() => adminCommentStore.pagination.total);
const limit = computed(() => adminCommentStore.pagination.limit);
const selectedComments = computed(() => adminCommentStore.selectedComments);
const hasSelectedComments = computed(() => adminCommentStore.hasSelectedComments);

// Generate pagination range with proper typings
const paginationRange = computed<(number | string)[]>(() => {
  const totalPageCount = totalPages.value;
  const currentPageVal = currentPage.value;
  const pageSize = 5; // Show 5 page numbers at a time
  
  if (totalPageCount <= pageSize) {
    return Array.from({ length: totalPageCount }, (_, i) => i + 1);
  }
  
  // Always show first page
  const pages: (number | string)[] = [1];
  
  // Show dots if not on first few pages
  if (currentPageVal > 3) {
    pages.push('...');
  }
  
  // Calculate middle pages
  const startPage = Math.max(2, currentPageVal - 1);
  const endPage = Math.min(totalPageCount - 1, currentPageVal + 1);
  
  // Add middle pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  // Show dots if not on last few pages
  if (currentPageVal < totalPageCount - 2) {
    pages.push('...');
  }
  
  // Always show last page if not already added
  if (totalPageCount > 1 && !pages.includes(totalPageCount)) {
    pages.push(totalPageCount);
  }
  
  return pages;
});

// Methods
const fetchComments = async () => {
  // Set filter based on current state
  await adminCommentStore.setFilter({ 
    status: statusFilter.value || undefined,
    blogId: blogFilter.value ? Number(blogFilter.value) : undefined,
    search: searchQuery.value || undefined
  });
};

const applyFilters = () => {
  fetchComments();
};

const onSearchInput = () => {
  // Debounce search input
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  searchTimeout.value = window.setTimeout(() => {
    fetchComments();
  }, 300);
};

const prevPage = () => {
  if (currentPage.value > 1) {
    adminCommentStore.setPage(currentPage.value - 1);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    adminCommentStore.setPage(currentPage.value + 1);
  }
};

const goToPage = (page: number | string) => {
  if (typeof page === 'number') {
    adminCommentStore.setPage(page);
  }
};

// Comment management
const approveComment = async (commentId: number) => {
  await adminCommentStore.updateCommentStatus(commentId, 'approved');
};

const rejectComment = async (commentId: number) => {
  await adminCommentStore.updateCommentStatus(commentId, 'rejected');
};

const markAsSpam = async (commentId: number) => {
  await adminCommentStore.updateCommentStatus(commentId, 'spam');
};

const deleteComment = (commentId: number) => {
  commentToDelete.value = commentId;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (commentToDelete.value) {
    await adminCommentStore.deleteComment(commentToDelete.value);
    showDeleteModal.value = false;
    commentToDelete.value = null;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  commentToDelete.value = null;
};

const viewInContext = (blogId: number) => {
  router.push(`/admin/blog/${blogId}`);
};

// Bulk actions
const bulkApprove = async () => {
  await adminCommentStore.bulkAction('approve');
};

const bulkReject = async () => {
  await adminCommentStore.bulkAction('reject');
};

const bulkSpam = async () => {
  await adminCommentStore.bulkAction('spam');
};

const bulkDelete = async () => {
  if (confirm('Apakah Anda yakin ingin menghapus semua komentar yang dipilih? Tindakan ini tidak dapat dibatalkan.')) {
    await adminCommentStore.bulkAction('delete');
  }
};

// Selection helpers
const isCommentSelected = (commentId: number) => {
  return selectedComments.value.includes(commentId);
};

const toggleCommentSelection = (commentId: number) => {
  adminCommentStore.toggleCommentSelection(commentId);
};

const toggleSelectAll = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    adminCommentStore.selectAllComments();
  } else {
    adminCommentStore.clearSelection();
  }
};

const clearSelection = () => {
  adminCommentStore.clearSelection();
};

// Helper methods
const getUserInitials = (name?: string): string => {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  // Tampilkan relatif jika kurang dari 24 jam
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return `${minutes} menit yang lalu`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours} jam yang lalu`;
  } else {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending': return 'Menunggu';
    case 'approved': return 'Disetujui';
    case 'rejected': return 'Ditolak';
    case 'spam': return 'Spam';
    default: return 'Unknown';
  }
};

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// On component mount
onMounted(async () => {
  fetchComments();
  adminCommentStore.fetchCommentCounts();
  
  // Fetch blogs for filter dropdown
  // blogStore.fetchBlogs({ limit: 100 });
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>