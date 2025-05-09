<template>
  <div class="comment-list">
    <!-- Empty state -->
    <div v-if="comments.length === 0 && pendingComments.length === 0" class="py-6 text-center">
      <p class="text-gray-500">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
    </div>
    
    <!-- Pending comments section -->
    <div v-if="pendingComments.length > 0" class="mb-6">
      <div class="mb-3 text-sm text-yellow-800 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Komentar dalam moderasi
      </div>
      <div class="space-y-4">
        <CommentItem
          v-for="comment in pendingComments"
          :key="`pending-${comment.id}`"
          :comment="comment"
          is-pending
          @reply="$emit('reply', comment.id)"
          @edit="$emit('edit', comment.id)"
          @delete="$emit('delete', comment.id)"
        />
      </div>
    </div>
    
    <!-- Main comments -->
    <div class="space-y-4">
      <div v-for="comment in comments" :key="comment.id" class="comment-thread">
        <!-- Parent comment -->
        <CommentItem
          :comment="comment"
          @reply="$emit('reply', comment.id)"
          @edit="$emit('edit', comment.id)"
          @delete="$emit('delete', comment.id)"
        >
          <!-- Replies -->
          <div v-if="comment.replies && comment.replies.length > 0" class="ml-6 mt-4 space-y-4 pl-4 border-l-2 border-gray-100">
            <CommentItem
              v-for="reply in comment.replies"
              :key="reply.id"
              :comment="reply"
              is-reply
              @edit="$emit('edit', reply.id)"
              @delete="$emit('delete', reply.id)"
            />
          </div>
        </CommentItem>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommentItem from './CommentItem.vue';

// Define Comment interface
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

// Define props dengan tipe yang spesifik
const props = defineProps({
  comments: {
    type: Array as () => Comment[],
    default: () => []
  },
  pendingComments: {
    type: Array as () => Comment[],
    default: () => []
  }
});

// Define emits
defineEmits(['reply', 'edit', 'delete']);
</script>