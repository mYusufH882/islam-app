<template>
  <div :class="containerClasses">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  classes: {
    type: String,
    default: ''
  },
  darkMode: {
    type: Boolean,
    default: false
  }
});

const containerClasses = computed(() => {
  return `${props.classes} ${props.darkMode ? 'dark' : ''}`;
});
</script>