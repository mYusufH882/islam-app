<template>
  <div>
    <p class="mt-1 text-sm text-gray-600 mb-6">
      Selamat datang di Panel Admin Pemuda Persis Cimsel
    </p>

    <!-- Ringkasan Statistik Card -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Artikel Blog
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">
                    {{ blogStats.total }}
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
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Pengguna
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">
                    {{ userStats.total }}
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
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Bookmark
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">
                    {{ bookmarkStats.total }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <a href="#" class="font-medium text-primary-700 hover:text-primary-900">
              Lihat statistik
            </a>
          </div>
        </div>
      </div>

      <!-- Card Statistik Ayat Al-Quran -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-12 w-12 bg-primary-100 rounded-md flex items-center justify-center">
              <svg class="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Ayat Dibaca
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">
                    {{ quranStats.ayatDibaca }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <NuxtLink to="/admin/quran-stats" class="font-medium text-primary-700 hover:text-primary-900">
              Lihat statistik
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Grafik dan Statistik Detail -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-8">
      <!-- Grafik Pertumbuhan Blog -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Artikel Blog Bulanan</h2>
        <div class="h-64">
          <canvas ref="blogChart"></canvas>
        </div>
      </div>
      
      <!-- Grafik Pertumbuhan Pengguna -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Pengguna Baru Bulanan</h2>
        <div class="h-64">
          <canvas ref="userChart"></canvas>
        </div>
      </div>
    </div>
    
    <!-- Distribusi Konten Blog -->
    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Distribusi Konten Blog</h2>
      <div class="flex flex-wrap">
        <div class="w-full lg:w-1/3 pr-4">
          <div class="relative h-64">
            <canvas ref="categoryChart"></canvas>
          </div>
        </div>
        <div class="w-full lg:w-2/3 mt-6 lg:mt-0">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Top Kategori</h3>
          <div class="space-y-4">
            <div v-for="(category, index) in topCategories" :key="index">
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
      <div class="bg-white shadow overflow-hidden rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="(activity, index) in recentActivities" :key="index" class="px-6 py-4 relative hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <NuxtLink 
                  :to="getActivityLink(activity)" 
                  class="flex-1 min-w-0 text-sm font-medium text-primary-600 hover:text-primary-800 truncate"
                >
                  {{ activity.title }}
                </NuxtLink>
                <span 
                  class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="activityTypeClasses[activity.type]"
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
                  {{ activity.date }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

// Definisikan layout untuk halaman ini
definePageMeta({
layout: 'admin'
})

// Definisi tipe untuk data
type ActivityType = 'Blog' | 'User' | 'Bookmark'

interface Activity {
title: string
type: ActivityType
user: string
date: string
link: string
}

interface CategoryData {
name: string
count: number
percentage: number
}

// Referensi untuk elemen canvas chart
const blogChart = ref<HTMLCanvasElement | null>(null)
const userChart = ref<HTMLCanvasElement | null>(null)
const categoryChart = ref<HTMLCanvasElement | null>(null)

// Data statistik
const blogStats = ref({
total: 24,
published: 18,
draft: 6
})

const userStats = ref({
total: 142,
active: 135,
inactive: 7
})

const bookmarkStats = ref({
total: 89,
thisMonth: 12
})

const quranStats = ref({
ayatDibaca: 1254,
surahSelesai: 15
})

// Data untuk chart kategori blog
const topCategories = ref<CategoryData[]>([
{ name: 'Ibadah', count: 9, percentage: 37.5 },
{ name: 'Al-Quran', count: 7, percentage: 29.2 },
{ name: 'Informasi', count: 5, percentage: 20.8 },
{ name: 'Kisah', count: 3, percentage: 12.5 }
])

// Data aktivitas terbaru
const recentActivities = ref<Activity[]>([
{
  title: 'Artikel Baru: "Keutamaan Puasa Senin Kamis"',
  type: 'Blog',
  user: 'Admin',
  date: '20 April 2025',
  link: '/admin/blog/1'
},
{
  title: 'Pendaftaran Pengguna Baru',
  type: 'User',
  user: 'Ahmad Fauzi',
  date: '19 April 2025',
  link: '/admin/users'
},
{
  title: 'Artikel Diperbarui: "Jadwal Kajian Ramadhan"',
  type: 'Blog',
  user: 'Admin',
  date: '18 April 2025',
  link: '/admin/blog/2'
},
{
  title: 'Bookmark Baru pada Surah Al-Kahfi',
  type: 'Bookmark',
  user: 'Rizki Maulana',
  date: '17 April 2025',
  link: '#'
},
{
  title: 'Artikel Baru: "Fadhilah Membaca Al-Quran"',
  type: 'Blog',
  user: 'Admin',
  date: '16 April 2025',
  link: '/admin/blog/3'
}
])

// Kelas warna untuk jenis aktivitas
const activityTypeClasses: Record<ActivityType, string> = {
'Blog': 'bg-blue-100 text-blue-800',
'User': 'bg-green-100 text-green-800',
'Bookmark': 'bg-yellow-100 text-yellow-800'
}

// Fungsi untuk mendapatkan link aktivitas
const getActivityLink = (activity: Activity): string => {
return activity.link || '#'
}

// Setup Chart.js pada mount
onMounted(() => {
// Chart data blog bulanan
if (blogChart.value) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()
  const lastSixMonths = months.slice(currentMonth - 5, currentMonth + 1)
  
  new Chart(blogChart.value, {
    type: 'line',
    data: {
      labels: lastSixMonths,
      datasets: [
        {
          label: 'Artikel Blog',
          data: [3, 5, 2, 4, 6, 4],
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
  })
}

// Chart data pengguna baru
if (userChart.value) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()
  const lastSixMonths = months.slice(currentMonth - 5, currentMonth + 1)
  
  new Chart(userChart.value, {
    type: 'bar',
    data: {
      labels: lastSixMonths,
      datasets: [
        {
          label: 'Pengguna Baru',
          data: [15, 22, 18, 25, 32, 30],
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
  })
}

// Chart distribusi kategori
if (categoryChart.value) {
  new Chart(categoryChart.value, {
    type: 'doughnut',
    data: {
      labels: topCategories.value.map(c => c.name),
      datasets: [
        {
          data: topCategories.value.map(c => c.count),
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
  })
}
})
</script>