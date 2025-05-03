<template>
  <ClientOnly>
    <slot />
    <template #fallback>
      <div class="min-h-screen flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8 bg-blue-700">
        <div class="mx-auto w-full max-w-md">
          <div class="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow rounded-lg">
            <div class="animate-pulse flex flex-col items-center">
              <div class="rounded-full bg-slate-200 h-16 w-16 mb-4"></div>
              <div class="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
              <div class="h-10 bg-slate-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>