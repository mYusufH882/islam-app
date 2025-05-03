<template>
  <div :class="wrapperClass">
    <slot></slot>
  </div>
</template>

<script setup>
    const props = defineProps({
    classes: {
        type: String,
        default: 'h-screen flex overflow-hidden bg-gray-100'
    }
    });

    const wrapperClass = computed(() => props.classes);
</script>