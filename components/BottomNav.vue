<template>
    <div class="fixed bottom-0 left-0 right-0 z-10 bg-gray-100">
        <nav class="max-w-[640px] mx-auto bg-white border-t border-gray-200 py-2">
            <div class="grid grid-cols-4">
                <NuxtLink to="/" class="flex flex-col items-center" :class="{ 'text-blue-600': isActive('/'), 'text-gray-500': !isActive('/') }">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span class="text-xs mt-1">Beranda</span>
                </NuxtLink>
                
                <NuxtLink to="/quran" class="flex flex-col items-center" :class="{ 'text-blue-600': isActive('/quran'), 'text-gray-500': !isActive('/quran') }">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span class="text-xs mt-1">Quran</span>
                </NuxtLink>
                
                <NuxtLink to="/prayer-times" class="flex flex-col items-center" :class="{ 'text-blue-600': isActive('/prayer-times'), 'text-gray-500': !isActive('/prayer-times') }">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-xs mt-1">Salat</span>
                </NuxtLink>
                
                <NuxtLink to="/blog" class="flex flex-col items-center" :class="{ 'text-blue-600': isActive('/blog'), 'text-gray-500': !isActive('/blog') }">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <span class="text-xs mt-1">Blog</span>
                </NuxtLink>
            </div>
        </nav>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

// Fungsi untuk memeriksa apakah rute saat ini aktif
const isActive = (path) => {
  return route.path === path;
};
</script>