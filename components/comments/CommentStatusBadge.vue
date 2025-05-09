<template>
  <span :class="[
    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
    statusClasses
  ]">
    <svg v-if="status === 'pending'" class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <svg v-else-if="status === 'approved'" class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    <svg v-else-if="status === 'rejected'" class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Define props
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value: string) => ['pending', 'approved', 'rejected'].includes(value)
  }
});

// Computed
const statusClasses = computed(() => {
  switch (props.status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
});

const statusLabel = computed(() => {
  switch (props.status) {
    case 'pending':
      return 'Menunggu moderasi';
    case 'approved':
      return 'Disetujui';
    case 'rejected':
      return 'Ditolak';
    default:
      return props.status;
  }
});
</script>