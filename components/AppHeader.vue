<template>
    <div class="fixed top-0 left-0 right-0 z-10 bg-gray-100">
        <header class="bg-blue-600 text-white py-4 max-w-[640px] mx-auto rounded-b-lg">
            <h1 class="text-xl font-bold text-center">{{ appName }}</h1>
        </header>
    </div>
</template>

<script setup>
const config = useRuntimeConfig()
const appName = config.public.appName
</script>