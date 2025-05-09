<template>
  <div :id="`comment-${comment.id}`" :class="[
    'comment-item p-4 bg-white rounded-lg border border-gray-100',
    isReply ? 'comment-reply' : '',
    isPending ? 'bg-yellow-50 border-yellow-100' : ''
  ]">
    <div class="flex items-start">
      <!-- Avatar -->
      <div class="flex-shrink-0 mr-3">
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span class="text-blue-600 font-medium">{{ authorInitials }}</span>
        </div>
      </div>
      
      <!-- Comment content -->
      <div class="flex-1">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center">
            <span class="font-medium text-gray-800">{{ comment.author.name }}</span>
            
            <!-- Status badge -->
            <CommentStatusBadge 
              v-if="isPending || comment.status === 'pending'" 
              status="pending" 
              class="ml-2" 
            />
          </div>
          
          <!-- Comment date -->
          <span class="text-sm text-gray-500">{{ formattedDate }}</span>
        </div>
        
        <!-- Edit mode -->
        <div v-if="isEditing" class="mt-2">
          <textarea
            v-model="editContent"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          ></textarea>
          <div class="flex justify-end space-x-2 mt-2">
            <button
              @click="cancelEdit"
              class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Batal
            </button>
            <button
              @click="saveEdit"
              class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              :disabled="isUpdateLoading"
            >
              <span v-if="isUpdateLoading">Menyimpan...</span>
              <span v-else>Simpan</span>
            </button>
          </div>
        </div>
        
        <!-- Normal display mode -->
        <div v-else>
          <p class="text-gray-700 whitespace-pre-line">{{ comment.content }}</p>
          
          <!-- Action buttons -->
          <div v-if="canPerformActions" class="mt-2 flex space-x-4">
            <button
              v-if="!isReply"
              @click="toggleReplyForm"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              Balas
            </button>
            <button
              v-if="canEdit"
              @click="startEdit"
              class="text-sm text-gray-600 hover:text-gray-800"
            >
              Edit
            </button>
            <button
              v-if="canDelete"
              @click="confirmDelete"
              class="text-sm text-red-600 hover:text-red-800"
            >
              Hapus
            </button>
          </div>
          
          <!-- Reply form -->
          <div v-if="showReplyForm" class="mt-4">
            <ReplyForm
              :parent-comment-id="comment.id"
              :blog-id="comment.blogId"
              @reply-submitted="onReplySubmitted"
              @cancel="showReplyForm = false"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Reply container -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useCommentStore } from '~/stores/comment.store';
import CommentStatusBadge from './CommentStatusBadge.vue';
import ReplyForm from './ReplyForm.vue';

// Define props
const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  isReply: {
    type: Boolean,
    default: false
  },
  isPending: {
    type: Boolean,
    default: false
  }
});

// Define emits
const emit = defineEmits(['reply', 'edit', 'delete']);

// Setup stores
const authStore = useAuthStore();
const commentStore = useCommentStore();

// State
const showReplyForm = ref(false);
const isEditing = ref(false);
const editContent = ref('');

// Computed properties
const authorInitials = computed(() => {
  const name = props.comment.author.name || '';
  return name.split(' ')
    .map((part: string) => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

const formattedDate = computed(() => {
  const date = new Date(props.comment.createdAt);
  
  // Jika kurang dari 24 jam, tampilkan format relatif
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return `${minutes} menit yang lalu`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours} jam yang lalu`;
  } else {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
});

const canPerformActions = computed(() => authStore.isAuthenticated);

const canEdit = computed(() => {
  if (!authStore.user) return false;
  return props.comment.author.id === authStore.user.id;
});

const canDelete = computed(() => {
  if (!authStore.user) return false;
  return props.comment.author.id === authStore.user.id;
});

const isUpdateLoading = computed(() => {
  return commentStore.loadingStates.update === props.comment.id;
});

// Methods
const toggleReplyForm = () => {
  showReplyForm.value = !showReplyForm.value;
  emit('reply', props.comment.id);
};

const startEdit = () => {
  editContent.value = props.comment.content;
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  editContent.value = '';
};

const saveEdit = async () => {
  if (editContent.value.trim() === props.comment.content) {
    cancelEdit();
    return;
  }
  
  const success = await commentStore.updateComment(props.comment.id, editContent.value);
  
  if (success) {
    isEditing.value = false;
    editContent.value = '';
  }
};

const confirmDelete = () => {
  if (confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
    emit('delete', props.comment.id);
  }
};

const onReplySubmitted = () => {
  showReplyForm.value = false;
};
</script>