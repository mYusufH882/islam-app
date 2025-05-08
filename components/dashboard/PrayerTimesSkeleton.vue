<template>
    <div class="mb-6">
      <div class="flex justify-between items-center mb-3">
        <div class="h-6 bg-gray-200 rounded w-1/3"></div>
        <div class="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-3 bg-blue-100 border-b border-gray-200">
          <div class="flex justify-between">
            <div class="h-6 bg-gray-200 rounded w-20"></div>
            <div class="h-5 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div class="divide-y divide-gray-200">
          <div class="flex justify-between p-3 bg-blue-50">
            <div class="h-5 bg-gray-200 rounded w-24"></div>
            <div class="h-5 bg-gray-200 rounded w-16"></div>
          </div>
          <div v-for="i in 5" :key="i" class="flex justify-between p-3">
            <div class="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
            <div class="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        </div>
      </div>
    </div>
</template>