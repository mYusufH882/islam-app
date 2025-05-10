<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Moderasi Komentar</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Kelola dan moderasi komentar pada platform
        </p>
      </div>
      
      <div class="flex space-x-3">
        <NuxtLink
          to="/admin/comment/pending"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-offset-dark-bg-primary"
        >
          <span class="flex items-center">
            Komentar Menunggu
            <span v-if="pendingCount > 0" class="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
              {{ pendingCount }}
            </span>
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
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
          <button @click="fetchData" class="mt-2 text-sm text-red-700 dark:text-red-400 font-medium underline hover:text-red-600 dark:hover:text-red-300">
            Coba lagi
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div v-else>
      <!-- Statistik Komentar -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Total Comments Card -->
        <div class="bg-white dark:bg-dark-bg-secondary shadow dark:shadow-gray-800 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg class="h-6 w-6 text-blue-600 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Komentar</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ commentCounts?.total || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Pending Comments Card -->
        <div class="bg-white dark:bg-dark-bg-secondary shadow dark:shadow-gray-800 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <svg class="h-6 w-6 text-yellow-600 dark:text-yellow-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Menunggu Moderasi</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ commentCounts?.pending || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Approved Comments Card -->
        <div class="bg-white dark:bg-dark-bg-secondary shadow dark:shadow-gray-800 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <svg class="h-6 w-6 text-green-600 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Disetujui</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ commentCounts?.approved || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Rejected/Spam Comments Card -->
        <div class="bg-white dark:bg-dark-bg-secondary shadow dark:shadow-gray-800 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-12 w-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <svg class="h-6 w-6 text-red-600 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Ditolak/Spam</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ (commentCounts?.rejected || 0) + (commentCounts?.spam || 0) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Grafik Statistik -->
      <div class="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Grafik tren komentar -->
        <div class="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow dark:shadow-gray-800">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Tren Komentar (7 Hari Terakhir)</h2>
          <div class="h-64">
            <canvas ref="commentTrendChart"></canvas>
          </div>
        </div>

        <!-- Grafik distribusi komentar -->
        <div class="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow dark:shadow-gray-800">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Distribusi Status Komentar</h2>
          <div class="h-64">
            <canvas ref="commentDistributionChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Komentar Terbaru yang Membutuhkan Moderasi -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Komentar Terbaru yang Membutuhkan Moderasi</h2>
          <NuxtLink to="/admin/comment/pending" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            Lihat Semua
          </NuxtLink>
        </div>

        <!-- Daftar Komentar Pending -->
        <div class="bg-white dark:bg-dark-bg-secondary shadow dark:shadow-gray-800 rounded-lg overflow-hidden">
          <div v-if="pendingComments.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
            Tidak ada komentar yang membutuhkan moderasi saat ini.
          </div>
          <ul v-else role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Loop through first 5 pending comments -->
            <li v-for="comment in pendingComments" :key="comment.id" class="p-4 hover:bg-gray-50 dark:hover:bg-dark-bg-primary">
              <div class="flex space-x-3">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {{ getUserInitials(comment.author?.name) }}
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex justify-between">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ comment.author?.name || 'Unknown User' }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(comment.createdAt) }}
                    </p>
                  </div>
                  <div class="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    {{ comment.content }}
                  </div>
                  <div class="mt-2 flex items-center">
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      Di artikel: <NuxtLink :to="`/admin/blog/${comment.blogId}`" class="text-blue-600 dark:text-blue-400 hover:underline">{{ comment.blog?.title || 'Unknown Blog' }}</NuxtLink>
                    </span>
                  </div>
                </div>
              </div>
              <div class="mt-3 flex justify-end space-x-2">
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
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Pengguna Paling Aktif -->
      <div>
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Pengguna Paling Aktif Berkomentar</h2>
        <div class="bg-white dark:bg-dark-bg-secondary shadow dark:shadow-gray-800 rounded-lg overflow-hidden">
          <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="(user, index) in activeUsers" :key="index" class="px-6 py-4 flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  {{ getUserInitials(user.author?.name) }}
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.author?.name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">@{{ user.author?.username }}</p>
                </div>
              </div>
              <div class="ml-2 flex-shrink-0 flex">
                <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ user.commentCount }} komentar
                </p>
              </div>
            </li>
            <li v-if="!activeUsers.length" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
              Tidak ada data pengguna aktif
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import { useAdminCommentStore } from '~/stores/adminComment.store';
import { useThemeStore } from '~/stores/theme.store';

// Definisikan layout untuk halaman ini
definePageMeta({
  layout: 'admin',
  middleware: ['admin']
});

// Store
const adminCommentStore = useAdminCommentStore();
const themeStore = useThemeStore();
const isDarkMode = computed(() => themeStore.darkMode);

// State
const commentTrendChart = ref<HTMLCanvasElement | null>(null);
const commentDistributionChart = ref<HTMLCanvasElement | null>(null);
let trendChartInstance: Chart | null = null;
let distributionChartInstance: Chart | null = null;

// Computed properties
const commentCounts = computed(() => adminCommentStore.commentCounts);
const commentStats = computed(() => adminCommentStore.commentStats);
const pendingCount = computed(() => adminCommentStore.pendingCount);
const loading = computed(() => 
  adminCommentStore.loading.stats || 
  adminCommentStore.loading.counts || 
  adminCommentStore.loading.list
);
const error = computed(() => adminCommentStore.error);

// Dapatkan 5 komentar pending teratas
const pendingComments = computed(() => {
  // Filter komentar dengan status pending dan ambil 5
  return adminCommentStore.comments
    .filter(comment => comment.status === 'pending')
    .slice(0, 5);
});

// Dapatkan pengguna aktif
const activeUsers = computed(() => {
  if (!commentStats.value || !commentStats.value.activeUsers) return [];
  return commentStats.value.activeUsers;
});

// Methods
const fetchData = async () => {
  try {
    // Set filter untuk mendapatkan komentar pending
    adminCommentStore.setFilter({ status: 'pending', limit: 5 });
    
    // Fetch data
    await Promise.all([
      adminCommentStore.fetchCommentCounts(),
      adminCommentStore.fetchCommentStats()
    ]);
    
    // Render chart setelah data tersedia
    renderCharts();
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
  }
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

// Aksi komentar
const approveComment = async (commentId: number) => {
  const success = await adminCommentStore.updateCommentStatus(commentId, 'approved');
  if (success) {
    await fetchData();
  }
};

const rejectComment = async (commentId: number) => {
  const success = await adminCommentStore.updateCommentStatus(commentId, 'rejected');
  if (success) {
    await fetchData();
  }
};

// Render charts
const renderCharts = () => {
  // Destroy charts if they exist
  if (trendChartInstance) trendChartInstance.destroy();
  if (distributionChartInstance) distributionChartInstance.destroy();

  // Style berdasarkan mode (light/dark)
  const textColor = isDarkMode.value ? '#f3f4f6' : '#374151';
  const gridColor = isDarkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  
  // Render trend chart
  if (commentTrendChart.value && commentStats.value && commentStats.value.commentsByDate) {
    const ctx = commentTrendChart.value.getContext('2d');
    if (ctx) {
      // Transform data
      const labels = commentStats.value.commentsByDate.map(item => item.date);
      const data = commentStats.value.commentsByDate.map(item => item.commentCount);
      
      trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Komentar',
              data,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                color: textColor
              },
              grid: {
                color: gridColor
              }
            },
            x: {
              ticks: {
                color: textColor
              },
              grid: {
                color: gridColor
              }
            }
          }
        }
      });
    }
  }
  
  // Render distribution chart
  if (commentDistributionChart.value && commentStats.value && commentStats.value.statusCounts) {
    const ctx = commentDistributionChart.value.getContext('2d');
    if (ctx) {
      const { pending, approved, rejected, spam } = commentStats.value.statusCounts;
      
      distributionChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Menunggu', 'Disetujui', 'Ditolak', 'Spam'],
          datasets: [
            {
              data: [pending, approved, rejected, spam],
              backgroundColor: [
                '#FBBF24', // Yellow for pending
                '#10B981', // Green for approved
                '#EF4444', // Red for rejected
                '#6B7280'  // Gray for spam
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: textColor
              }
            }
          }
        }
      });
    }
  }
};

// Watch for theme changes to update charts
watch(isDarkMode, () => {
  renderCharts();
});

// On component mount
onMounted(() => {
  fetchData();
});
</script>