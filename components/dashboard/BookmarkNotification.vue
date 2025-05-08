<template>
    <div 
      class="fixed top-20 right-4 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg z-50 transition-opacity duration-300"
      :class="{'opacity-100': show, 'opacity-0': !show}"
    >
      <div class="flex items-center">
        <span>{{ message }}</span>
        <button @click="close" class="ml-2 text-white hover:text-blue-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
</template>

<script setup>
  import { ref, watch, onMounted, onUnmounted } from 'vue';
  
  const props = defineProps({
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 3000
    }
  });
  
  const emit = defineEmits(['close']);
  const show = ref(false);
  let timer = null;
  
  const close = () => {
    show.value = false;
    setTimeout(() => {
      emit('close');
    }, 300); // Tunggu transisi selesai
  };
  
  // Animasi masuk ketika komponen dimount
  onMounted(() => {
    // Gunakan animasi yang lebih efisien, dengan delay minimal
    setTimeout(() => {
      show.value = true;
    }, 10);
    
    // Auto-close setelah duration
    timer = setTimeout(close, props.duration);
  });
  
  // Bersihkan timer jika komponen di-unmount
  onUnmounted(() => {
    if (timer) clearTimeout(timer);
  });
  
  // Reset timer jika message berubah
  watch(() => props.message, () => {
    if (timer) clearTimeout(timer);
    show.value = true;
    timer = setTimeout(close, props.duration);
  });
</script>