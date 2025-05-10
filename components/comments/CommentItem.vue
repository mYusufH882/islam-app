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
  
  <teleport to="body">
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="cancelDelete"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Hapus Komentar
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" 
                    @click="proceedWithDelete"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
              Hapus
            </button>
            <button type="button" 
                    @click="cancelDelete"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
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

const showDeleteModal = ref(false);

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
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
};

const proceedWithDelete = () => {
  emit('delete', props.comment.id);
  showDeleteModal.value = false;
};


const onReplySubmitted = () => {
  showReplyForm.value = false;
};
</script>