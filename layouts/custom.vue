// layouts/custom.vue
<template>
  <div>
    <!-- Gunakan div sebagai wrapper untuk memastikan konsistensi antara server dan client -->
    <ClientOnly>
      <slot />
      <template #fallback>
        <div class="min-h-screen flex flex-col justify-center bg-blue-700">
          <div class="mx-auto w-full max-w-md p-6">
            <div class="bg-white p-8 rounded-lg shadow-lg animate-pulse">
              <div class="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div class="h-6 bg-gray-200 rounded mb-4 w-3/4 mx-auto"></div>
              <div class="h-4 bg-gray-200 rounded mb-8 w-1/2 mx-auto"></div>
              <div class="h-10 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
// Tidak ada logika khusus di layout custom
</script>