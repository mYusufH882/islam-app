<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <p class="text-sm text-gray-600">
        Selamat datang di Panel Admin Pemuda Persis Cimsel
      </p>
      
      <!-- Tombol refresh data -->
      <button 
        @click="refreshDashboard" 
        class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        :disabled="isLoading"
      >
        <svg 
          v-if="isLoading" 
          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            class="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="4"
          ></circle>
          <path 
            class="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <svg 
          v-else 
          class="-ml-1 mr-2 h-4 w-4 text-white" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fill-rule="evenodd" 
            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" 
            clip-rule="evenodd" 
          />
        </svg>
        {{ isLoading ? 'Memuat...' : 'Refresh Data' }}
      </button>
    </div>

    <!-- Tampilkan DashboardSkeleton jika semua data sedang dimuat -->
    <DashboardSkeleton v-if="isLoading" />
    
    <!-- Tampilkan dashboard dengan data asli jika sudah tersedia -->
    <template v-else>
      <!-- Ringkasan Statistik Card -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <!-- Card Statistik Blog -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-12 w-12 bg-primary-100 rounded-md flex items-center justify-center">
                <svg class="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate break-words whitespace-normal">
                    Total Artikel Blog
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900">
                      {{ dashboardStore.blogStats.total }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <NuxtLink to="/admin/blog" class="font-medium text-primary-700 hover:text-primary-900">
                Lihat semua
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Card Statistik Pengguna -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-12 w-12 bg-primary-100 rounded-md flex items-center justify-center">
                <svg class="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 break-words whitespace-normal">
                    Total Pengguna
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900">
                      {{ dashboardStore.userStats.total }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <NuxtLink to="/admin/users" class="font-medium text-primary-700 hover:text-primary-900">
                Lihat semua
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Card Statistik Bookmark -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-12 w-12 bg-primary-100 rounded-md flex items-center justify-center">
                <svg class="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 break-words whitespace-normal">
                    Total Bookmark
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900">
                      {{ dashboardStore.bookmarkStats.total }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a href="/admin/bookmark" class="font-medium text-primary-700 hover:text-primary-900">
                Lihat statistik
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pesan error jika gagal memuat data statistik -->
      <div v-if="dashboardStore.statsError" class="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ dashboardStore.statsError }}</p>
            <button @click="dashboardStore.fetchStats" class="mt-2 text-sm text-red-700 underline">Coba lagi</button>
          </div>
        </div>
      </div>
      
      <!-- Grafik dan Statistik Detail -->
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-8">
        <!-- Grafik Pertumbuhan Blog -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Artikel Blog Bulanan</h2>
          
          <!-- Loading state -->
          <div v-if="dashboardStore.loadingCharts" class="h-64 flex items-center justify-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
          
          <!-- Error state -->
          <div v-else-if="dashboardStore.chartsError" class="h-64 flex items-center justify-center">
            <div class="text-center">
              <p class="text-red-500 mb-2">{{ dashboardStore.chartsError }}</p>
              <button @click="dashboardStore.fetchChartData" class="text-blue-600 underline">Coba lagi</button>
            </div>
          </div>
          
          <!-- Chart -->
          <div v-else class="h-64">
            <canvas ref="blogChart"></canvas>
          </div>
        </div>
        
        <!-- Grafik Pertumbuhan Pengguna -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Pengguna Baru Bulanan</h2>
          
          <!-- Loading state -->
          <div v-if="dashboardStore.loadingCharts" class="h-64 flex items-center justify-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
          
          <!-- Error state -->
          <div v-else-if="dashboardStore.chartsError" class="h-64 flex items-center justify-center">
            <div class="text-center">
              <p class="text-red-500 mb-2">{{ dashboardStore.chartsError }}</p>
              <button @click="dashboardStore.fetchChartData" class="text-blue-600 underline">Coba lagi</button>
            </div>
          </div>
          
          <!-- Chart -->
          <div v-else class="h-64">
            <canvas ref="userChart"></canvas>
          </div>
        </div>
      </div>
      
      <!-- Distribusi Konten Blog -->
      <div class="bg-white p-6 rounded-lg shadow mb-8">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Distribusi Konten Blog</h2>
        
        <!-- Loading state -->
        <div v-if="dashboardStore.loadingCharts" class="h-64 flex items-center justify-center">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
        
        <!-- Error state -->
        <div v-else-if="dashboardStore.chartsError" class="h-64 flex items-center justify-center">
          <div class="text-center">
            <p class="text-red-500 mb-2">{{ dashboardStore.chartsError }}</p>
            <button @click="dashboardStore.fetchChartData" class="text-blue-600 underline">Coba lagi</button>
          </div>
        </div>
        
        <!-- Content -->
        <div v-else class="flex flex-wrap">
          <div class="w-full lg:w-1/3 pr-4">
            <div class="relative h-64">
              <canvas ref="categoryChart"></canvas>
            </div>
          </div>
          <div class="w-full lg:w-2/3 mt-6 lg:mt-0">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Top Kategori</h3>
            <div class="space-y-4">
              <div v-for="(category, index) in dashboardStore.categoryDistribution" :key="index">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-600">{{ category.name }}</span>
                  <span class="text-sm font-medium text-gray-900">{{ category.count }} artikel</span>
                </div>
                <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-primary-600 h-2 rounded-full" :style="{ width: `${category.percentage}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aktivitas Terbaru -->
      <div class="mt-8">
        <h2 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Aktivitas Terbaru
        </h2>
        
        <!-- Loading state -->
        <div v-if="dashboardStore.loadingActivities" class="bg-white p-6 rounded-md shadow text-center">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-2 text-gray-500">Memuat aktivitas terbaru...</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="dashboardStore.activitiesError" class="bg-white p-6 rounded-md shadow text-center">
          <p class="text-red-500 mb-2">{{ dashboardStore.activitiesError }}</p>
          <button @click="dashboardStore.fetchRecentActivities" class="text-blue-600 underline">Coba lagi</button>
        </div>
        
        <!-- Empty state -->
        <div v-else-if="dashboardStore.recentActivities.length === 0" class="bg-white p-6 rounded-md shadow text-center">
          <p class="text-gray-500">Belum ada aktivitas terbaru</p>
        </div>
        
        <!-- Activity list -->
        <div v-else class="bg-white shadow overflow-hidden rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="activity in dashboardStore.recentActivities" :key="activity.id" class="px-6 py-4 relative hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <NuxtLink 
                    :to="activity.link" 
                    class="flex-1 min-w-0 text-sm font-medium text-primary-600 hover:text-primary-800 truncate"
                  >
                    {{ activity.title }}
                  </NuxtLink>
                  <span 
                    class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="activityTypeClasses[activity.type] || 'bg-gray-100 text-gray-800'"
                  >
                    {{ activity.type }}
                  </span>
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <span class="truncate">{{ activity.user }}</span>
                  <span class="mx-1">•</span>
                  <span class="whitespace-nowrap flex items-center">
                    <svg 
                      class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fill-rule="evenodd" 
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" 
                        clip-rule="evenodd" 
                      />
                    </svg>
                    {{ formatDate(activity.date) }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import Chart from 'chart.js/auto'
import { useDashboardStore } from '~/stores/dashboard.store';
import DashboardSkeleton from '@/components/admin/DashboardSkeleton.vue';

// Definisikan layout untuk halaman ini
definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})

// Store
const dashboardStore = useDashboardStore();

// Komputed property untuk menentukan apakah sedang dalam loading state
const isLoading = computed(() => {
  return (
    dashboardStore.loadingStats || 
    dashboardStore.loadingCharts || 
    dashboardStore.loadingActivities
  );
});

// Referensi untuk elemen canvas chart
const blogChart = ref<HTMLCanvasElement | null>(null);
const userChart = ref<HTMLCanvasElement | null>(null);
const categoryChart = ref<HTMLCanvasElement | null>(null);

// Chart instances
let blogChartInstance: Chart | null = null;
let userChartInstance: Chart | null = null;
let categoryChartInstance: Chart | null = null;

// Kelas warna untuk jenis aktivitas
const activityTypeClasses: Record<string, string> = {
  'Blog': 'bg-blue-100 text-blue-800',
  'User': 'bg-green-100 text-green-800',
  'Bookmark': 'bg-yellow-100 text-yellow-800'
};

// Format date helper
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Cek apakah date valid
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

// Fungsi untuk membuat grafik
const createCharts = () => {
  // Hapus chart sebelumnya jika ada
  if (blogChartInstance) blogChartInstance.destroy();
  if (userChartInstance) userChartInstance.destroy();
  if (categoryChartInstance) categoryChartInstance.destroy();
  
  // Grafik Blog
  if (blogChart.value) {
    blogChartInstance = new Chart(blogChart.value, {
      type: 'line',
      data: {
        labels: dashboardStore.blogChartData.labels,
        datasets: [
          {
            label: 'Artikel Blog',
            data: dashboardStore.blogChartData.data,
            borderColor: '#4F46E5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
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
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }
  
  // Grafik User
  if (userChart.value) {
    userChartInstance = new Chart(userChart.value, {
      type: 'bar',
      data: {
        labels: dashboardStore.userChartData.labels,
        datasets: [
          {
            label: 'Pengguna Baru',
            data: dashboardStore.userChartData.data,
            backgroundColor: '#4F46E5'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }
  
  // Grafik Kategori
  if (categoryChart.value && dashboardStore.categoryDistribution.length > 0) {
    categoryChartInstance = new Chart(categoryChart.value, {
      type: 'doughnut',
      data: {
        labels: dashboardStore.categoryDistribution.map(c => c.name),
        datasets: [
          {
            data: dashboardStore.categoryDistribution.map(c => c.count),
            backgroundColor: [
              '#4F46E5', // Ibadah - primary color
              '#3B82F6', // Al-Quran - blue
              '#10B981', // Informasi - green
              '#F59E0B'  // Kisah - yellow
            ],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 15
            }
          }
        },
        cutout: '65%'
      }
    });
  }
};

// Watch untuk chart data
watch(
  () => [
    dashboardStore.blogChartData,
    dashboardStore.userChartData,
    dashboardStore.categoryDistribution
  ],
  () => {
    // Re-render charts when data changes
    setTimeout(() => {
      createCharts();
    }, 0);
  },
  { deep: true }
);

// Fungsi untuk me-refresh data dashboard
const refreshDashboard = async () => {
  await dashboardStore.fetchAllDashboardData();
  // Buat ulang chart setelah data terbaru tersedia
  setTimeout(() => {
    createCharts();
  }, 100);
};

// Ambil semua data dashboard saat komponen dimuat
onMounted(async () => {
  // Fetch semua data dashboard
  await dashboardStore.fetchAllDashboardData();
  
  // Buat charts setelah data tersedia
  createCharts();
});
</script>