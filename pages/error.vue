<template>
  <div class="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
    <div class="max-w-max mx-auto">
      <main class="sm:flex">
        <p class="text-4xl font-extrabold text-blue-600 sm:text-5xl">{{ error.statusCode }}</p>
        <div class="sm:ml-6">
          <div class="sm:border-l sm:border-gray-200 sm:pl-6">
            <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              {{ error.statusMessage || 'Terjadi kesalahan' }}
            </h1>
            <p class="mt-1 text-base text-gray-500">{{ getErrorMessage() }}</p>
          </div>
          <div class="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
            <button 
              @click="handleError" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Coba Lagi
            </button>
            <NuxtLink 
              to="/" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Kembali ke Beranda
            </NuxtLink>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
defineProps({
  error: Object
});

const getErrorMessage = () => {
  if (error.value?.statusCode === 404) {
    return 'Halaman yang Anda cari tidak ditemukan.';
  }
  
  if (error.value?.statusCode === 500) {
    return 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
  }
  
  if (error.value?.message && error.value.message.includes('hydration')) {
    return 'Terjadi kesalahan tampilan aplikasi. Silakan refresh halaman untuk memperbaiki.';
  }
  
  return error.value?.message || 'Terjadi kesalahan saat memuat halaman. Silakan coba lagi.';
};

const handleError = () => {
  if (error.value?.message && error.value.message.includes('hydration')) {
    // For hydration errors, refresh the page
    window.location.reload();
  } else {
    // For other errors, use the Nuxt built-in handler
    clearError({ redirect: window.location.pathname });
  }
};
</script>