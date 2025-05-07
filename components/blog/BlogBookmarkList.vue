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
                    @click="removeBookmark(bookmark)" 
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
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { getImageUrl } from '~/utils/imageHelper';
  import { useBlogStore } from '~/stores/blog.store';
  
  const props = defineProps({
    bookmarks: {
      type: Array,
      default: () => []
    }
  });
  
  const emit = defineEmits(['remove-bookmark']);
  const router = useRouter();
  const blogStore = useBlogStore();
  
  // State untuk menyimpan data blog lengkap
  const blogData = ref({});
  
  // Mengolah bookmark untuk mendapatkan ID blog dan menambahkan data blog
  const processedBookmarks = computed(() => {
    return props.bookmarks.map(bookmark => {
      // Ekstrak ID blog dari referenceId (format: "blog:4")
      const blogId = bookmark.referenceId ? 
        parseInt(bookmark.referenceId.split(':')[1]) : 
        (bookmark.blog?.id || bookmark.blogId);
      
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
    });
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
    const blogId = bookmark.blogId || parseInt(bookmark.referenceId.split(':')[1]);
    router.push(`/blog/${blogId}`);
  };
  
  // Remove bookmark
  const removeBookmark = (bookmark) => {
    if (confirm('Hapus bookmark ini?')) {
      emit('remove-bookmark', bookmark);
    }
  };
  
  // Ambil data blog untuk bookmark
  const fetchBlogData = async () => {
    // Pastikan ada bookmark
    if (!props.bookmarks.length) return;
    
    // Kumpulkan semua ID blog dari bookmark
    const blogIds = props.bookmarks
      .map(bookmark => {
        if (bookmark.referenceId && bookmark.referenceId.startsWith('blog:')) {
          return parseInt(bookmark.referenceId.split(':')[1]);
        }
        return bookmark.blog?.id || bookmark.blogId;
      })
      .filter(id => id);
    
    // Jika sudah ada data blog di store, gunakan itu
    if (blogStore.blogs.length) {
      blogIds.forEach(id => {
        const blog = blogStore.blogs.find(b => b.id === id);
        if (blog) {
          blogData.value[id] = blog;
        }
      });
    } else {
      // Jika belum ada data blog, fetch dari API
      await blogStore.fetchBlogs();
      
      // Setelah fetch, update blogData
      blogIds.forEach(id => {
        const blog = blogStore.blogs.find(b => b.id === id);
        if (blog) {
          blogData.value[id] = blog;
        }
      });
    }
  };
  
  // Inisialisasi data blog saat komponen dimount
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