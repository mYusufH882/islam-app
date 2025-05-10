<template>
  <div class="comment-section mt-6 bg-white p-4 rounded-lg shadow">
    <h3 class="text-xl font-semibold flex items-center">
      Komentar
      <span v-if="!loadingComments" class="ml-2 text-sm text-gray-500">
        ({{ commentCount }})
      </span>
    </h3>
    
    <!-- Loading state -->
    <div v-if="loadingComments" class="py-4">
      <div class="animate-pulse space-y-4">
        <div v-for="i in 3" :key="i" class="flex items-start space-x-3">
          <div class="rounded-full bg-gray-200 h-10 w-10"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/6 mb-3"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="py-4 text-center">
      <p class="text-red-500 mb-2">{{ error }}</p>
      <button 
        @click="fetchComments" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Coba lagi
      </button>
    </div>
    
    <!-- Main content -->
    <div v-else>
      <!-- Comment form -->
      <div v-if="isAuthenticated" class="mb-6 mt-4">
        <h4 class="text-sm font-medium mb-2">Tambah Komentar</h4>
        <CommentForm 
            :blog-id="blogId" 
            @comment-added="onCommentAdded"
            :is-loading="isCreatingComment"
        />
      </div>
      
      <!-- Login prompt -->
      <div v-else class="my-4 p-3 bg-blue-50 text-sm text-blue-800 rounded-md">
        Silakan <NuxtLink to="/auth/login" class="font-medium underline">login</NuxtLink>
        untuk meninggalkan komentar.
      </div>
      
      <!-- Comments list -->
      <CommentList 
        :comments="approvedComments" 
        :pending-comments="pendingComments"
        @reply="onReply"
        @edit="onEdit"
        @delete="onDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useCommentStore } from '~/stores/comment.store';
import { useAuthStore } from '~/stores/auth';
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';

// Define Comment interface untuk digunakan dalam komponen ini
interface CommentAuthor {
  id: number;
  name: string;
  username: string;
  avatar?: string;
}

interface Comment {
  id: number;
  blogId: number;
  userId: number;
  parentId?: number | null;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
  replies?: Comment[];
}

// Define props
const props = defineProps({
  blogId: {
    type: Number,
    required: true
  }
});

console.log("CommentSection received blogId:", props.blogId);

// Setup stores
const commentStore = useCommentStore();
const authStore = useAuthStore();

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated);
const approvedComments = computed(() => {
  // Tambahkan null check untuk menghindari error
  const comments = commentStore.getApprovedComments;
  return Array.isArray(comments) ? comments : [];
});
const pendingComments = computed(() => {
  if (!authStore.isAuthenticated) return [] as Comment[];
  return commentStore.pendingComments as Comment[];
});
const loadingComments = computed(() => commentStore.loadingStates.fetch);
const isCreatingComment = computed(() => commentStore.loadingStates.create);
const error = computed(() => commentStore.error);
const commentCount = computed(() => {
  // Periksa apakah commentStore.comments adalah array sebelum menggunakan filter
  return Array.isArray(commentStore.comments) 
    ? commentStore.comments.filter(c => c.status === 'approved').length 
    : 0;
});

// Methods
const fetchComments = async () => {
  await commentStore.fetchComments(props.blogId);
};

const onCommentAdded = (comment?: Comment) => {
  // Fungsi ini akan dipanggil ketika komentar berhasil dibuat
  // Kita bisa menampilkan pesan sukses atau scroll ke posisi komentar baru
  if (comment) {
    console.log('Komentar berhasil ditambahkan:', comment);
  }
};

const onReply = (commentId: number) => {
  // Fungsi ini akan dipanggil ketika user ingin membalas komentar
  // Bisa menggunakan untuk scroll ke form reply
  console.log('Membalas komentar ID:', commentId);
};

const onEdit = (commentId: number) => {
  // Fungsi ini akan dipanggil ketika user ingin mengedit komentar
  console.log('Mengedit komentar ID:', commentId);
};

const onDelete = async (commentId: number) => {
  // Fungsi ini akan dipanggil ketika user menghapus komentar
  console.log('Menghapus komentar ID:', commentId);
  await commentStore.deleteComment(commentId);
};

// Lifecycle hooks
onMounted(async () => {
  // PERBAIKAN: Jika ada pendingComments yang sudah disimpan untuk blog ini, tampilkan
  const existingPendingComments = computed(() => {
    return Array.isArray(commentStore.pendingComments) 
      ? commentStore.pendingComments.filter(c => c.blogId === props.blogId)
      : [];
  });
  
  if (existingPendingComments.value.length > 0) {
    console.log('Menampilkan komentar pending yang sudah disimpan:', existingPendingComments.value);
  }
  
  await fetchComments();
});

onUnmounted(() => {
  commentStore.resetState();
});
</script>