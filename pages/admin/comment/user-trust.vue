<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Kepercayaan Pengguna</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Kelola dan pantau level kepercayaan pengguna dalam berkomentar
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
          Kembali ke Moderasi
        </NuxtLink>
      </div>
    </div>
    
    <!-- Statistics Summary -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-5">
      <div class="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow dark:shadow-gray-800">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Pengguna Aktif</h2>
        <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ activeUsers.length }}</div>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Pengguna dengan aktivitas komentar</p>
      </div>
      
      <div class="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow dark:shadow-gray-800">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Tingkat Persetujuan</h2>
        <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ approvalRate }}%</div>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Rata-rata komentar disetujui</p>
      </div>
      
      <div class="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow dark:shadow-gray-800">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Komentar per Pengguna</h2>
        <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ averageCommentsPerUser }}</div>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Rata-rata komentar per pengguna aktif</p>
      </div>
    </div>
    
    <!-- Users Table with Trust Level -->
    <div class="bg-white dark:bg-dark-bg-secondary rounded-lg shadow dark:shadow-gray-800 overflow-hidden mb-6">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Pengguna Paling Aktif</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Pengguna dengan aktivitas komentar tertinggi
          </p>
        </div>
        
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Cari pengguna..."
            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white rounded-md"
            @input="searchUsers"
          />
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-if="loading" class="px-4 py-5 sm:p-6 flex justify-center">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="px-4 py-5 sm:p-6">
        <div class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-700 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
              <button @click="fetchData" class="mt-2 text-sm text-red-700 dark:text-red-400 font-medium underline hover:text-red-600 dark:hover:text-red-300">
                Coba lagi
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Users table -->
      <div v-else-if="activeUsers.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pengguna
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Jumlah Komentar
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Level Kepercayaan
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-dark-bg-secondary divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in filteredUsers" :key="user.userId" class="hover:bg-gray-50 dark:hover:bg-dark-bg-primary">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">
                    {{ getUserInitials(user.author?.name) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.author?.name || 'Unknown User' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      @{{ user.author?.username }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ user.commentCount }} komentar</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getUserTrustClass(user)"
                >
                  {{ getUserTrustLevel(user) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="showUserComments(user)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Lihat Komentar
                </button>
                <span class="mx-2 text-gray-300 dark:text-gray-700">|</span>
                <button 
                  @click="toggleTrustLevel(user)"
                  class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  {{ getUserTrustAction(user) }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty state -->
      <div v-else class="px-4 py-12 sm:p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Tidak ada data pengguna aktif</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Tidak ada pengguna yang telah memberikan komentar.
        </p>
      </div>
    </div>
    
    <!-- User Comments Modal -->
    <Transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
          </div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div 
            class="inline-block align-bottom bg-white dark:bg-dark-bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="modal-headline"
          >
            <div class="bg-white dark:bg-dark-bg-secondary px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <div class="flex justify-between items-center">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-headline">
                      Komentar dari {{ selectedUser?.author?.name || 'Pengguna' }}
                    </h3>
                    <button @click="closeModal" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                      <span class="sr-only">Tutup</span>
                      <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div class="mt-4">
                    <!-- User comment history -->
                    <div v-if="loadingUserComments" class="py-10 flex justify-center">
                      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
                    </div>
                    <div v-else-if="userComments.length === 0" class="py-10 text-center">
                      <p class="text-gray-500 dark:text-gray-400">Tidak ada komentar untuk ditampilkan.</p>
                    </div>
                    <div v-else>
                      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                        <li v-for="comment in userComments" :key="comment.id" class="py-4">
                          <div class="flex space-x-3">
                            <div class="flex-1">
                              <div class="flex items-center justify-between">
                                <p class="text-sm font-medium text-gray-900 dark:text-white">
                                  Pada blog: {{ comment.blog?.title || 'Unknown Blog' }}
                                </p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                  {{ formatDate(comment.createdAt) }}
                                </p>
                              </div>
                              <p class="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                {{ comment.content }}
                              </p>
                              <div class="mt-2 flex items-center">
                                <span 
                                  class="px-2 py-1 text-xs rounded-full"
                                  :class="{
                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': comment.status === 'pending',
                                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': comment.status === 'approved',
                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': comment.status === 'rejected',
                                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200': comment.status === 'spam'
                                  }"
                                >
                                  {{ getStatusLabel(comment.status) }}
                                </span>
                                <span v-if="comment.adminNote" class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                  Note admin: {{ comment.adminNote }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-dark-bg-primary px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                @click="closeModal"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-dark-bg-secondary text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdminCommentStore } from '~/stores/adminComment.store';
import { useApi } from '~/composables/useApi';

// Define page meta
definePageMeta({
  layout: 'admin',
  middleware: ['admin']
});

// Definisi tipe
interface CommentAuthor {
  id: number;
  name: string;
  username: string;
  avatar?: string;
}

interface CommentBlog {
  id: number;
  title: string;
}

interface Comment {
  id: number;
  content: string;
  blogId: number;
  userId: number;
  parentId?: number;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  isRead: boolean;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  author?: CommentAuthor;
  blog?: CommentBlog;
  parent?: Comment;
  replies?: Comment[];
}

// Tipe untuk active user (dari activeUsers di commentStats)
interface ActiveUser {
  userId: number;
  commentCount: number;
  author?: CommentAuthor;
}

// Store and API
const adminCommentStore = useAdminCommentStore();
const { apiFetch } = useApi();

// State
const loading = ref(false);
const error = ref<string | null>(null);
const approvalRate = ref(0);
const searchQuery = ref('');
const showModal = ref(false);
const selectedUser = ref<ActiveUser | null>(null);
const userComments = ref<Comment[]>([]);
const loadingUserComments = ref(false);

// Computed
const activeUsers = computed<ActiveUser[]>(() => {
  if (adminCommentStore.commentStats && adminCommentStore.commentStats.activeUsers) {
    return adminCommentStore.commentStats.activeUsers;
  }
  return [];
});

const filteredUsers = computed<ActiveUser[]>(() => {
  if (!searchQuery.value) return activeUsers.value;
  
  const query = searchQuery.value.toLowerCase();
  return activeUsers.value.filter(user => {
    const name = user.author?.name?.toLowerCase() || '';
    const username = user.author?.username?.toLowerCase() || '';
    return name.includes(query) || username.includes(query);
  });
});

const averageCommentsPerUser = computed(() => {
  if (!activeUsers.value.length) return 0;
  
  const totalComments = activeUsers.value.reduce((sum, user) => sum + (user.commentCount || 0), 0);
  return Math.round(totalComments / activeUsers.value.length);
});

// Methods
const fetchData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    await adminCommentStore.fetchCommentStats();
    
    if (adminCommentStore.commentStats) {
      approvalRate.value = adminCommentStore.commentStats.approvalRate;
    }
  } catch (err) {
    console.error('Error fetching user trust data:', err);
    error.value = 'Terjadi kesalahan saat memuat data pengguna.';
  } finally {
    loading.value = false;
  }
};

const searchUsers = () => {
  // Filtering handled by computed property
};

const getUserInitials = (name?: string): string => {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const getUserTrustLevel = (user: ActiveUser): string => {
  // Ini hanya simulasi, karena tidak ada field trust_level yang jelas di API
  // Implementasi ini bisa disesuaikan dengan data aktual dari backend
  const commentCount = user.commentCount || 0;
  
  if (commentCount >= 10) return 'Trusted';
  if (commentCount >= 5) return 'Regular';
  return 'New';
};

const getUserTrustClass = (user: ActiveUser): string => {
  const level = getUserTrustLevel(user);
  
  if (level === 'Trusted') {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  }
  if (level === 'Regular') {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
};

const getUserTrustAction = (user: ActiveUser): string => {
  const level = getUserTrustLevel(user);
  
  if (level === 'Trusted') return 'Set Regular';
  if (level === 'Regular') return 'Set Trusted';
  return 'Set Trusted';
};

const toggleTrustLevel = (user: ActiveUser) => {
  // Fungsi placeholder untuk toggle level kepercayaan
  // Ini harus diimplementasikan saat endpoint API tersedia
  alert(`Fungsi mengubah level kepercayaan pengguna ${user.author?.name || 'Unknown'} belum diimplementasikan`);
};

const showUserComments = async (user: ActiveUser) => {
  selectedUser.value = user;
  showModal.value = true;
  loadingUserComments.value = true;
  
  try {
    // Mengambil komentar pengguna dari API - gunakan tipe any untuk menghindari error struktur
    const { data, error } = await apiFetch<any>('/api/admin/comments', {
      params: {
        userId: user.userId,
        limit: 10
      }
    });
    
    if (error.value) {
      throw new Error(error.value.message || 'Failed to fetch user comments');
    }
    
    // Log struktur data untuk debugging
    console.log('API Response:', data.value);
    
    // Gunakan type assertion dan akses data dengan pendekatan defensif
    if (data.value && data.value.success) {
      // Pengecekan keberadaan data.value.data.comments dengan operator optional chaining
      const comments = data.value.data?.comments as Comment[] || [];
      userComments.value = comments;
    } else {
      userComments.value = [];
    }
  } catch (err) {
    console.error('Error fetching user comments:', err);
    userComments.value = [];
  } finally {
    loadingUserComments.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedUser.value = null;
  userComments.value = [];
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
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

// On component mount
onMounted(() => {
  fetchData();
});
</script>