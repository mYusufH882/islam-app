<template>
  <div>
    <h3 class="text-lg font-semibold mb-3">Artikel yang Ditandai</h3>
    
    <div v-if="bookmarks.length === 0" class="bg-white p-4 rounded-lg shadow text-center">
      <p class="text-gray-500">Belum ada artikel yang ditandai</p>
      <NuxtLink to="/blog" class="mt-2 inline-block text-blue-600">
        Jelajahi Blog
      </NuxtLink>
    </div>
    
    <div v-else class="space-y-3">
      <div 
        v-for="bookmark in processedBookmarks" 
        :key="bookmark.id"
        class="bg-white p-4 rounded-lg shadow"
      >
        <div class="flex">
          <div class="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 mr-3">
            <img 
              v-if="bookmark.blogImage"
              :src="getImageUrl(bookmark.blogImage)"
              :alt="bookmark.blogTitle"
              class="w-full h-full object-cover rounded-md"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div class="flex-1">
            <h4 class="font-medium">{{ bookmark.blogTitle || 'Artikel' }}</h4>
            
            <p class="text-sm text-gray-600 mt-1 line-clamp-2">
              {{ truncateText(bookmark.blogExcerpt || bookmark.description || '', 120) }}
            </p>
            
            <div class="mt-3 flex justify-between">
              <span class="text-xs text-gray-500">
                {{ formatDate(bookmark.timestamp) }}
              </span>
              
              <div class="flex space-x-2">
                <button 
                  @click="openBookmark(bookmark)" 
                  class="text-sm text-blue-600 flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Buka
                </button>
                
                <button 
                  @click="promptDeleteBookmark(bookmark)"
                  class="text-sm text-red-600 flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal konfirmasi hapus bookmark -->
    <DeleteConfirmationModal
      :is-open="showDeleteModal"
      :is-deleting="isDeleting"
      title="Hapus Bookmark Blog"
      :message="`Apakah Anda yakin ingin menghapus bookmark '${selectedBookmarkTitle}'?`"
      @close="cancelDelete"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getImageUrl } from '~/utils/imageHelper';
import { useBlogStore } from '~/stores/blog.store';
import { useBookmarkService } from '~/composables/useBookmarkService';
import DeleteConfirmationModal from '../DeleteConfirmationModal.vue';

const props = defineProps({
bookmarks: {
  type: Array,
  default: () => []
}
});

const emit = defineEmits(['remove-bookmark', 'bookmark-deleted']);
const router = useRouter();
const blogStore = useBlogStore();
const bookmarkService = useBookmarkService();

// State untuk menyimpan data blog lengkap
const blogData = ref({});

// State untuk modal hapus
const showDeleteModal = ref(false);
const bookmarkToDelete = ref(null);
const isDeleting = ref(false);
const selectedBookmarkTitle = ref('');
const deleteError = ref(null);

// Mengolah bookmark untuk mendapatkan ID blog dan menambahkan data blog
const processedBookmarks = computed(() => {
if (!props.bookmarks || !Array.isArray(props.bookmarks)) {
  console.warn('Bookmarks is not an array or is undefined:', props.bookmarks);
  return [];
}

return props.bookmarks.map(bookmark => {
  if (!bookmark) return null;
  
  // Ekstrak ID blog dari referenceId (format: "blog:4")
  let blogId = null;
  
  if (bookmark.referenceId && typeof bookmark.referenceId === 'string' && bookmark.referenceId.startsWith('blog:')) {
    const parts = bookmark.referenceId.split(':');
    if (parts.length >= 2) {
      blogId = parseInt(parts[1]);
    }
  } else if (bookmark.blog?.id) {
    blogId = bookmark.blog.id;
  } else if (bookmark.blogId) {
    blogId = bookmark.blogId;
  }
  
  // Ambil data blog dari store jika tersedia
  const blog = blogData.value[blogId] || blogStore.blogs.find(b => b.id === blogId);
  
  return {
    ...bookmark,
    blogId,
    blogTitle: bookmark.blog?.title || bookmark.blogTitle || bookmark.notes || 'Artikel',
    blogExcerpt: bookmark.blog?.excerpt || bookmark.blogExcerpt || '',
    description: blog?.content ? truncateText(blog.content, 120) : '',
    blogImage: blog?.image || bookmark.blog?.image || bookmark.blogImage || null
  };
}).filter(bookmark => bookmark !== null);
});

// Format date to be more readable
const formatDate = (dateString) => {
if (!dateString) return '';

const date = new Date(dateString);
return date.toLocaleDateString('id-ID', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
};

// Fungsi untuk memotong teks
const truncateText = (text, maxLength) => {
if (!text) return '';

// Strip HTML tags if present
const strippedText = text.replace(/<[^>]*>/g, '');

// If the text is already shorter than maxLength, return it as is
if (strippedText.length <= maxLength) {
  return strippedText;
}

// Find the last space before maxLength to avoid cutting words
const lastSpace = strippedText.substring(0, maxLength).lastIndexOf(' ');

// If no space found, just cut at maxLength
return strippedText.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
};

// Open blog article
const openBookmark = (bookmark) => {
if (!bookmark.blogId && bookmark.referenceId && typeof bookmark.referenceId === 'string') {
  const parts = bookmark.referenceId.split(':');
  if (parts.length >= 2) {
    const blogId = parseInt(parts[1]);
    router.push(`/blog/${blogId}`);
    return;
  }
}

const blogId = bookmark.blogId || bookmark.blog?.id;
if (blogId) {
  router.push(`/blog/${blogId}`);
} else {
  console.error('Unable to determine blog ID from bookmark:', bookmark);
}
};

// Prompt user to delete bookmark with modal
const promptDeleteBookmark = (bookmark) => {
bookmarkToDelete.value = bookmark;
// Set title for display in modal
selectedBookmarkTitle.value = bookmark.blogTitle || bookmark.blog?.title || 'Artikel';
showDeleteModal.value = true;
deleteError.value = null;
};

// Cancel delete action
const cancelDelete = () => {
bookmarkToDelete.value = null;
selectedBookmarkTitle.value = '';
showDeleteModal.value = false;
deleteError.value = null;
};

// Confirm delete action
const confirmDelete = async () => {
if (!bookmarkToDelete.value) return;

isDeleting.value = true;
deleteError.value = null;

try {
  const bookmarkId = getBookmarkId(bookmarkToDelete.value);
  
  if (!bookmarkId) {
    throw new Error('ID bookmark tidak ditemukan');
  }
  
  console.log('Menghapus bookmark dengan ID:', bookmarkId, 'Data bookmark:', bookmarkToDelete.value);
  
  // Panggil metode penghapusan bookmark langsung dari service
  const success = await bookmarkService.removeBookmark(bookmarkId);
  
  if (success) {
    // Emit event bahwa bookmark telah dihapus
    emit('bookmark-deleted', bookmarkId);
    
    // Emitkan juga event yang sama dengan yang sebelumnya untuk kompatibilitas
    emit('remove-bookmark', bookmarkToDelete.value);
    
    console.log('Bookmark berhasil dihapus:', bookmarkId);
    
    // Tutup modal setelah berhasil
    showDeleteModal.value = false;
    bookmarkToDelete.value = null;
    selectedBookmarkTitle.value = '';
  } else {
    throw new Error('Gagal menghapus bookmark');
  }
} catch (error) {
  console.error('Error saat menghapus bookmark:', error);
  deleteError.value = error.message || 'Gagal menghapus bookmark. Silakan coba lagi.';
} finally {
  isDeleting.value = false;
}
};

// Helper function to get bookmark ID
const getBookmarkId = (bookmark) => {
// Try different possible ID locations
console.log('Getting bookmark ID for:', bookmark);

// If original ID exists (from database)
if (bookmark.id !== undefined) {
  if (typeof bookmark.id === 'number') {
    console.log(`Using numeric ID: ${bookmark.id}`);
    return bookmark.id;
  }
  
  if (typeof bookmark.id === 'string' && bookmark.id.includes(':')) {
    console.log(`Using composite ID: ${bookmark.id}`);
    return bookmark.id;
  }
  
  // Other ID types (string without : or number)
  console.log(`Using ID: ${bookmark.id}`);
  return bookmark.id;
}

// If ID is in referenceId format "blog:4"
if (bookmark.referenceId && typeof bookmark.referenceId === 'string' && bookmark.referenceId.includes(':')) {
  console.log(`Using referenceId: ${bookmark.referenceId}`);
  return bookmark.referenceId;
}

// If bookmark has alternative format (reconstruct ID from components)
if (bookmark.blogId) {
  const compositeId = `blog:${bookmark.blogId}`;
  console.log(`Reconstructed ID: ${compositeId}`);
  return compositeId;
}

// If bookmark has blog object
if (bookmark.blog?.id) {
  const compositeId = `blog:${bookmark.blog.id}`;
  console.log(`Reconstructed ID from blog object: ${compositeId}`);
  return compositeId;
}

console.warn('Tidak dapat menentukan ID bookmark:', bookmark);
return null;
};

// Fetch blog data for bookmarks
const fetchBlogData = async () => {
// Ensure bookmarks exist
if (!props.bookmarks || !props.bookmarks.length) return;

// Collect all blog IDs from bookmarks
const blogIds = props.bookmarks
  .map(bookmark => {
    if (bookmark.referenceId && bookmark.referenceId.startsWith('blog:')) {
      return parseInt(bookmark.referenceId.split(':')[1]);
    }
    return bookmark.blog?.id || bookmark.blogId;
  })
  .filter(id => id);

// If blog data already exists in store, use it
if (blogStore.blogs.length) {
  blogIds.forEach(id => {
    const blog = blogStore.blogs.find(b => b.id === id);
    if (blog) {
      blogData.value[id] = blog;
    }
  });
} else {
  // If no blog data exists, fetch from API
  await blogStore.fetchBlogs();
  
  // After fetch, update blogData
  blogIds.forEach(id => {
    const blog = blogStore.blogs.find(b => b.id === id);
    if (blog) {
      blogData.value[id] = blog;
    }
  });
}
};

// Initialize blog data when component is mounted
onMounted(() => {
fetchBlogData();
});

// Watch for changes in bookmarks to update blog data
watch(() => props.bookmarks, () => {
fetchBlogData();
}, { deep: true });
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>