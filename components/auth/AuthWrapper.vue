<template>
  <ClientOnly>
    <div :class="wrapperClass">
      <slot />
    </div>
    
    <template #fallback>
      <div class="min-h-screen flex flex-col justify-center bg-blue-700 p-4">
        <div class="mx-auto w-full max-w-md">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="animate-pulse space-y-4">
              <div class="h-12 w-12 bg-gray-200 rounded-full mx-auto"></div>
              <div class="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div class="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
defineProps({
  wrapperClass: {
    type: String,
    default: 'min-h-screen flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8 bg-blue-700'
  }
});
</script>