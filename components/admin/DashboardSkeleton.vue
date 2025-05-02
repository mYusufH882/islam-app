<template>
    <div>
      <!-- Ringkasan Statistik Card Skeleton -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div v-for="i in 4" :key="i" class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-md animate-pulse"></div>
              <div class="ml-5 w-0 flex-1">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div class="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <!-- Grafik Skeleton -->
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-8">
        <div v-for="i in 2" :key="i" class="bg-white p-6 rounded-lg shadow">
          <div class="h-5 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div class="h-64 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
      
      <!-- Distribusi Konten Skeleton -->
      <div class="bg-white p-6 rounded-lg shadow mb-8">
        <div class="h-5 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-1/3 pr-4">
            <div class="relative h-64 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div class="w-full lg:w-2/3 mt-6 lg:mt-0">
            <div class="h-4 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
            <div class="space-y-6">
              <div v-for="i in 4" :key="i">
                <div class="flex justify-between mb-2">
                  <div class="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
                </div>
                <div class="h-2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Aktivitas Terbaru Skeleton -->
      <div class="mt-8">
        <div class="h-5 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
        <div class="bg-white shadow rounded-md">
          <div v-for="i in 5" :key="i" class="px-6 py-4 border-b border-gray-200 last:border-b-0">
            <div class="flex justify-between">
              <div class="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
// Tidak memerlukan logika khusus karena ini hanya komponen visual statis
</script>