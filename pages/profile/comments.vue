<template>
  <div>
    <!-- Header -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold">Komentar Saya</h2>
      <p class="text-gray-600">Kelola komentar yang telah Anda kirim</p>
    </div>
    
    <!-- Filter status komentar -->
    <div class="bg-white p-4 rounded-lg shadow mb-4">
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          @click="handleFilterChange(filter.value)"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium',
            currentFilter === filter.value 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ filter.label }} 
          <span class="ml-1 bg-white text-blue-500 rounded-full px-1.5 py-0.5 text-xs" 
                v-if="currentFilter === filter.value && commentsCount > 0">
            {{ commentsCount }}
          </span>
        </button>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-center">
        <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p class="text-center mt-2 text-gray-600">Memuat komentar...</p>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!comments.length" class="bg-white p-6 rounded-lg shadow text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">Belum ada komentar</h3>
      <p class="mt-1 text-gray-500">
        Anda belum memiliki komentar {{ currentFilter !== 'all' ? `dengan status "${getStatusLabel(currentFilter)}"` : '' }}.
      </p>
    </div>
    
    <!-- Comment list -->
    <div v-else class="space-y-4">
      <div v-for="comment in comments" :key="comment.id" class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between mb-2">
          <div class="text-sm text-gray-500">
            <span class="font-medium text-gray-700">{{ formatDate(comment.createdAt) }}</span>
            <!-- Status badge -->
            <span 
              :class="[
                'ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                comment.status === 'approved' ? 'bg-green-100 text-green-800' : 
                comment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              ]"
            >
              {{ getStatusLabel(comment.status) }}
            </span>
          </div>
          
          <!-- Action buttons -->
          <div class="flex space-x-2">
            <button 
              @click="editComment(comment)"
              class="text-blue-500 hover:text-blue-700"
              title="Edit komentar"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button 
              @click="deleteComment(comment.id)"
              class="text-red-500 hover:text-red-700"
              title="Hapus komentar"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Blog link -->
        <a 
          :href="`/blogs/${comment.blogId}`"
          class="text-sm font-medium text-blue-600 hover:text-blue-800 mb-2 inline-block"
        >
          Lihat artikel
        </a>
        
        <!-- Comment content -->
        <div class="text-gray-800 mt-2 break-words">
          {{ comment.content }}
        </div>
        
        <!-- Parent comment reference (jika ini balasan) -->
        <div v-if="comment.parentId" class="mt-3 pl-3 border-l-2 border-gray-200 text-sm text-gray-600">
          <p class="italic">Balasan untuk komentar lain</p>
        </div>
      </div>
    </div>
    
    <!-- Edit comment modal -->
    <div v-if="editModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Edit Komentar</h3>
        <textarea 
          v-model="editedContent" 
          class="w-full border border-gray-300 rounded-md p-2 mb-4 h-32"
        ></textarea>
        <div class="flex justify-end space-x-2">
          <button 
            @click="cancelEdit"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button 
            @click="saveEdit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
    
    <!-- Delete confirmation modal -->
    <div v-if="deleteModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Hapus Komentar</h3>
        <p class="text-gray-600 mb-4">Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini tidak dapat dibatalkan.</p>
        <div class="flex justify-end space-x-2">
          <button 
            @click="deleteModalOpen = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button 
            @click="confirmDelete"
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCommentStore } from '~/stores/comment.store';
import { useAuthStore } from '~/stores/auth';
import { useApi } from '~/composables/useApi'; // Import useApi langsung

// Stores
const commentStore = useCommentStore();
const authStore = useAuthStore();
const { apiFetch } = useApi(); // Gunakan composable useApi langsung

// State
const comments = ref([]);
const loading = ref(true);
const currentFilter = ref('all');
const editModalOpen = ref(false);
const deleteModalOpen = ref(false);
const currentCommentId = ref(null);
const editedContent = ref('');

// Filter options
const filters = [
  { label: 'Semua', value: 'all' },
  { label: 'Menunggu', value: 'pending' },
  { label: 'Disetujui', value: 'approved' },
  { label: 'Ditolak', value: 'rejected' }
];

// Computed
const commentsCount = computed(() => comments.value.length);

// Fungsi untuk langsung memanggil API komentar
const fetchUserComments = async (status = 'all') => {
  loading.value = true;
  try {
    console.log(`Memanggil API ke /user/comments dengan status: ${status}`);
    
    // Panggil API langsung untuk mendapatkan komentar
    const endpoint = status === 'all' 
      ? '/user/comments' 
      : `/user/comments?status=${status}`;
    
    const { data, error } = await apiFetch(endpoint);
    
    if (error.value) {
      console.error('Error fetching comments:', error.value);
      return [];
    }
    
    if (data.value && data.value.success) {
      console.log('Komentar berhasil didapatkan:', data.value.data.comments.length);
      return data.value.data.comments;
    }
    
    return [];
  } catch (err) {
    console.error('Error fetching comments:', err);
    return [];
  } finally {
    loading.value = false;
  }
};

// Method untuk memuat komentar
const loadComments = async (filterValue = currentFilter.value) => {
  try {
    console.log(`Loading comments dengan filter: ${filterValue}`);
    const fetchedComments = await fetchUserComments(filterValue);
    comments.value = fetchedComments || [];
  } catch (error) {
    console.error('Failed to load comments:', error);
    comments.value = [];
  }
};

// Handler untuk perubahan filter
const handleFilterChange = (newFilter) => {
  currentFilter.value = newFilter;
  loadComments(newFilter);
};

// Format date untuk tampilan user-friendly
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const options = { 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('id-ID', options);
};

// Mendapatkan label status user-friendly
const getStatusLabel = (status) => {
  switch (status) {
    case 'approved': return 'Disetujui';
    case 'pending': return 'Menunggu';
    case 'rejected': return 'Ditolak';
    default: return status;
  }
};

// Edit komentar
const editComment = (comment) => {
  currentCommentId.value = comment.id;
  editedContent.value = comment.content;
  editModalOpen.value = true;
};

// Cancel edit
const cancelEdit = () => {
  editModalOpen.value = false;
  currentCommentId.value = null;
  editedContent.value = '';
};

// Save edit
const saveEdit = async () => {
  if (currentCommentId.value && editedContent.value.trim()) {
    try {
      const success = await commentStore.updateComment(currentCommentId.value, editedContent.value);
      if (success) {
        // Refresh komentar setelah update berhasil
        await loadComments();
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
    } finally {
      editModalOpen.value = false;
      currentCommentId.value = null;
      editedContent.value = '';
    }
  }
};

// Delete komentar
const deleteComment = (commentId) => {
  currentCommentId.value = commentId;
  deleteModalOpen.value = true;
};

// Confirm delete
const confirmDelete = async () => {
  if (currentCommentId.value) {
    try {
      const success = await commentStore.deleteComment(currentCommentId.value);
      if (success) {
        // Refresh komentar setelah delete berhasil
        await loadComments();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      deleteModalOpen.value = false;
      currentCommentId.value = null;
    }
  }
};

// Check authentication dan load komentar saat mount
onMounted(() => {
  if (process.client) {
    console.log("Halaman Komentar Saya dimount");
    
    if (!authStore.isAuthenticated) {
      window.location.href = '/auth/login?redirect=/profile/comments';
      return;
    }
    
    // Gunakan setTimeout untuk memastikan semua hooks lain selesai
    setTimeout(() => {
      console.log("Memuat komentar setelah delay...");
      loadComments();
    }, 100);
  }
});
</script>