<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Moderasi Komentar Pending</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Tinjau dan kelola komentar yang menunggu persetujuan
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
      <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <!-- Search input -->
        <div class="flex-1">
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
        
        <!-- Blog filter (akan diimplementasikan nanti) -->
        <!-- Filter will be implemented here -->
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
    
    <!-- Comment listing -->
    <div v-else>
      <div class="bg-white dark:bg-dark-bg-secondary rounded-lg shadow dark:shadow-gray-800 overflow-hidden">
        <!-- Empty state -->
        <div v-if="comments.length === 0" class="p-6 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Tidak ada komentar pending</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Semua komentar telah dimoderasi.
          </p>
        </div>
        
        <!-- Comment list -->
        <ul v-else role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
          <li v-for="comment in comments" :key="comment.id" class="relative hover:bg-gray-50 dark:hover:bg-dark-bg-primary">
            <!-- Select checkbox -->
            <div class="absolute top-4 left-4">
              <input 
                type="checkbox"
                :id="`select-comment-${comment.id}`"
                :checked="isCommentSelected(comment.id)"
                @change="toggleCommentSelection(comment.id)"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary rounded"
              />
            </div>
            
            <!-- Comment content -->
            <div class="px-4 py-4 sm:px-6 ml-8">
              <div class="flex items-start">
                <div class="flex-shrink-0 mr-3">
                  <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {{ getUserInitials(comment.author?.name) }}
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-center">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ comment.author?.name || 'Unknown User' }}
                    </p>
                    <span 
                      class="px-2 py-1 text-xs rounded-full"
                      :class="comment.isRead ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'"
                    >
                      {{ comment.isRead ? 'Dibaca' : 'Belum dibaca' }}
                    </span>
                  </div>
                  <div class="mt-1 flex items-center">
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(comment.createdAt) }}
                    </p>
                    <span class="mx-2 text-gray-300 dark:text-gray-600">•</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      Artikel: <NuxtLink :to="`/admin/blog/${comment.blogId}`" class="text-blue-600 dark:text-blue-400 hover:underline">{{ comment.blog?.title || 'Unknown Blog' }}</NuxtLink>
                    </span>
                  </div>
                  
                  <!-- Parent comment reference if is a reply -->
                  <div v-if="comment.parentId && comment.parent" class="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Membalas komentar dari {{ comment.parent.author?.name || 'Unknown User' }}:
                    </p>
                    <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      "{{ comment.parent.content }}"
                    </p>
                  </div>
                  
                  <!-- Comment content -->
                  <div class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {{ comment.content }}
                  </div>
                </div>
              </div>
              
              <!-- Action buttons -->
              <div class="mt-3 flex justify-end space-x-2">
                <button
                  @click="viewInContext(comment.blogId)"
                  class="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-700 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg-primary hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
                >
                  Lihat Artikel
                </button>
                <button
                  @click="approveComment(comment.id)"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-offset-dark-bg-secondary"
                >
                  Setujui
                </button>
                <button
                  @click="rejectComment(comment.id)"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-offset-dark-bg-secondary"
                >
                  Tolak
                </button>
                <button
                  @click="markAsSpam(comment.id)"
                  class="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-700 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg-primary hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-bg-secondary"
                >
                  Spam
                </button>
              </div>
            </div>
          </li>
        </ul>
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

    <RejectCommentModal
      :show="showRejectModal"
      :comment-id="commentToReject"
      @confirm="handleRejectConfirm"
      @cancel="cancelReject"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdminCommentStore } from '~/stores/adminComment.store';
import { useRouter } from 'vue-router';
import RejectCommentModal from '~/components/admin/RejectCommentModal.vue';

// Define page meta
definePageMeta({
  layout: 'admin',
});

// Store
const adminCommentStore = useAdminCommentStore();
const router = useRouter();

// Local state
const searchQuery = ref('');
const searchTimeout = ref<number | null>(null);
const showRejectModal = ref(false);
const commentToReject = ref<number | undefined>(undefined);

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

// Generate pagination range (1, 2, ..., 10)
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
  // Set filter to get pending comments
  await adminCommentStore.setFilter({ 
    status: 'pending',
    search: searchQuery.value || undefined
  });
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

// Comment management - update method rejectComment
const approveComment = async (commentId: number) => {
  await adminCommentStore.updateCommentStatus(commentId, 'approved');
};

// Update fungsi rejectComment untuk menampilkan modal
const rejectComment = (commentId: number) => {
  commentToReject.value = commentId;
  showRejectModal.value = true;
};

// Tambahkan fungsi penanganan modal
const handleRejectConfirm = async ({ commentId, reason }: { commentId: number, reason: string }) => {
  await adminCommentStore.updateCommentStatus(commentId, 'rejected', reason);
  showRejectModal.value = false;
  commentToReject.value = undefined;
};

const cancelReject = () => {
  showRejectModal.value = false;
  commentToReject.value = undefined;
};

const markAsSpam = async (commentId: number) => {
  await adminCommentStore.updateCommentStatus(commentId, 'spam');
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

// Selection helpers
const isCommentSelected = (commentId: number) => {
  return selectedComments.value.includes(commentId);
};

const toggleCommentSelection = (commentId: number) => {
  adminCommentStore.toggleCommentSelection(commentId);
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

// On component mount
onMounted(() => {
  fetchComments();
  adminCommentStore.fetchCommentCounts();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>