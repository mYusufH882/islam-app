import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useApi } from '~/composables/useApi';
import { useLoginModal } from '~/composables/useLoginModal';

// Updated interface for bookmark data structure
interface BookmarkSurah {
  number: number;
  name: string;
  nameArab?: string;
}

interface BookmarkBlog {
  id: number;
  title: string;
  excerpt?: string;
  image?: string;
}

// Main bookmark interface with type discriminator
interface Bookmark {
  id: string;
  type: 'quran' | 'blog';
  timestamp: string;
  // Quran specific fields
  surah?: BookmarkSurah;
  ayat?: number;
  text?: string;
  translation?: string;
  // Blog specific fields
  blog?: BookmarkBlog;
}

// Parameters for adding bookmarks
interface QuranBookmarkParams {
  type: 'quran';
  surahId: number;
  verseId: number;
  surahName?: string;
  surahNameArab?: string;
  text?: string;
  translation?: string;
}

interface BlogBookmarkParams {
  type: 'blog';
  blogId: number;
  blogTitle: string;
  blogExcerpt?: string;
  blogImage?: string;
}

// Union type for bookmark parameters
type BookmarkParams = QuranBookmarkParams | BlogBookmarkParams;

export const useBookmarkService = () => {
  const authStore = useAuthStore();
  const { openLoginModal } = useLoginModal();
  const bookmarks = ref<Bookmark[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  
  // Load bookmarks from localStorage or API
  const loadBookmarks = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    
    try {
      if (process.client) {
        // For authenticated users, try to fetch from API first
        if (authStore.isAuthenticated) {
          await fetchBookmarksFromApi();
        } else {
          // For non-authenticated users, use localStorage only for Quran bookmarks
          const storedBookmarks = localStorage.getItem('quran_bookmarks');
          if (storedBookmarks) {
            const quranBookmarks = JSON.parse(storedBookmarks);
            bookmarks.value = quranBookmarks.map((item: any) => ({
              ...item,
              type: 'quran' // Ensure type field is present
            }));
          }
        }
      }
    } catch (err) {
      console.error('Error loading bookmarks:', err);
      error.value = 'Gagal memuat bookmark. Silakan coba lagi.';
    } finally {
      loading.value = false;
    }
  };
  
  // Fetch bookmarks from API
  const fetchBookmarksFromApi = async (): Promise<void> => {
    try {
      const { apiFetch } = useApi();
      const { data } = await apiFetch('/bookmarks');
      
      if (data.value && data.value.success) {
        bookmarks.value = data.value.data;
      }
    } catch (err) {
      console.error('API fetch error:', err);
      // Fallback to localStorage only for Quran bookmarks
      const storedBookmarks = localStorage.getItem('quran_bookmarks');
      if (storedBookmarks) {
        const quranBookmarks = JSON.parse(storedBookmarks);
        bookmarks.value = quranBookmarks.map((item: any) => ({
          ...item,
          type: 'quran' // Ensure type field is present
        }));
      }
    }
  };
  
  // Add a bookmark
  const addBookmark = async (params: BookmarkParams): Promise<boolean> => {
    // Check authentication first
    if (!authStore.isAuthenticated) {
      // For blog bookmarks, authentication is required
      if (params.type === 'blog') {
        // Open login modal with current path as redirect
        const currentPath = window.location.pathname;
        openLoginModal(currentPath);
        return false;
      }
    }
    
    try {
      let newBookmark: Bookmark;
      
      if (params.type === 'quran') {
        // Create Quran bookmark
        newBookmark = {
          id: `quran:${params.surahId}:${params.verseId}`,
          type: 'quran',
          surah: {
            number: params.surahId,
            name: params.surahName || '',
            nameArab: params.surahNameArab || ''
          },
          ayat: params.verseId,
          text: params.text || '',
          translation: params.translation || '',
          timestamp: new Date().toISOString()
        };
        
        // For Quran bookmarks, store in localStorage even for non-authenticated users
        if (process.client) {
          // Add to local state
          const existingIndex = bookmarks.value.findIndex(b => 
            b.id === newBookmark.id || 
            (b.type === 'quran' && b.surah?.number === params.surahId && b.ayat === params.verseId)
          );
          
          if (existingIndex >= 0) {
            // Update existing bookmark
            bookmarks.value[existingIndex] = newBookmark;
          } else {
            // Add new bookmark
            bookmarks.value.push(newBookmark);
          }
          
          // Filter only Quran bookmarks for localStorage
          const quranBookmarks = bookmarks.value.filter(b => b.type === 'quran');
          localStorage.setItem('quran_bookmarks', JSON.stringify(quranBookmarks));
        }
      } else {
        // Create Blog bookmark - only for authenticated users
        newBookmark = {
          id: `blog:${params.blogId}`,
          type: 'blog',
          blog: {
            id: params.blogId,
            title: params.blogTitle,
            excerpt: params.blogExcerpt || '',
            image: params.blogImage || ''
          },
          timestamp: new Date().toISOString()
        };
        
        // Blog bookmarks are only added to local state
        const existingIndex = bookmarks.value.findIndex(b => 
          b.id === newBookmark.id || 
          (b.type === 'blog' && b.blog?.id === params.blogId)
        );
        
        if (existingIndex >= 0) {
          // Update existing bookmark
          bookmarks.value[existingIndex] = newBookmark;
        } else {
          // Add new bookmark
          bookmarks.value.push(newBookmark);
        }
      }
      
      // If authenticated, sync with API
      if (authStore.isAuthenticated) {
        await syncBookmarkToApi(newBookmark, 'add');
      }
      
      return true;
    } catch (err) {
      console.error('Error adding bookmark:', err);
      return false;
    }
  };
  
  // Remove a bookmark
  const removeBookmark = async (id: string | number): Promise<boolean> => {
    try {
      // Find the bookmark to remove
      let bookmarkId: string;
      let index = -1;
      
      if (typeof id === 'number') {
        // Assume it's a blog ID
        bookmarkId = `blog:${id}`;
        index = bookmarks.value.findIndex(b => b.type === 'blog' && b.blog?.id === id);
      } else {
        // It's already a bookmark ID
        bookmarkId = id;
        index = bookmarks.value.findIndex(b => b.id === id);
      }
      
      if (index >= 0) {
        const removedBookmark = bookmarks.value[index];
        
        // Remove from local state
        bookmarks.value.splice(index, 1);
        
        // For Quran bookmarks, update localStorage
        if (removedBookmark.type === 'quran' && process.client) {
          const quranBookmarks = bookmarks.value.filter(b => b.type === 'quran');
          localStorage.setItem('quran_bookmarks', JSON.stringify(quranBookmarks));
        }
        
        // If authenticated, sync with API
        if (authStore.isAuthenticated) {
          await syncBookmarkToApi(removedBookmark, 'remove');
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error removing bookmark:', err);
      return false;
    }
  };
  
  // Sync bookmark to API
  const syncBookmarkToApi = async (bookmark: Bookmark, action: 'add' | 'remove'): Promise<void> => {
    if (!authStore.isAuthenticated) return;
    
    try {
      const { apiFetch } = useApi();
      
      if (action === 'add') {
        let payload;
        
        if (bookmark.type === 'quran') {
          payload = {
            type: 'quran',
            referenceId: bookmark.id,
            notes: `${bookmark.surah?.name} - ${bookmark.text}`
          };
        } else {
          payload = {
            type: 'blog',
            referenceId: bookmark.id,
            notes: bookmark.blog?.title || ''
          };
        }
        
        const { data, error } = await apiFetch('/bookmarks', {
          method: 'POST',
          body: payload
        });
        
        if (error.value) {
          console.error('API error adding bookmark:', error.value);
          throw new Error(error.value.message || 'Failed to save bookmark to server');
        }
      } else if (action === 'remove') {
        const { data, error } = await apiFetch(`/bookmarks/${bookmark.id}`, {
          method: 'DELETE'
        });
        
        if (error.value) {
          console.error('API error removing bookmark:', error.value);
          throw new Error(error.value.message || 'Failed to remove bookmark from server');
        }
      }
    } catch (err) {
      console.error('Error syncing bookmark to API:', err);
      // We don't re-throw the error as we've already updated local state
      // But in a production app, consider showing a notification to the user
    }
  };
  
  // Filter bookmarks by type
  const quranBookmarks = computed(() => {
    return bookmarks.value.filter(bookmark => bookmark.type === 'quran');
  });
  
  const blogBookmarks = computed(() => {
    return bookmarks.value.filter(bookmark => bookmark.type === 'blog');
  });
  
  // Check if a verse is bookmarked
  const isQuranBookmarked = (surahId: number, verseId: number | null = null): boolean => {
    return bookmarks.value.some(bookmark => 
      bookmark.type === 'quran' &&
      bookmark.surah?.number === surahId && 
      (verseId === null || bookmark.ayat === verseId)
    );
  };
  
  // Check if a blog is bookmarked
  const isBlogBookmarked = (blogId: number): boolean => {
    return bookmarks.value.some(bookmark => 
      bookmark.type === 'blog' && 
      bookmark.blog?.id === blogId
    );
  };
  
  // Initialize bookmarks
  loadBookmarks();
  
  return {
    bookmarks,
    quranBookmarks,
    blogBookmarks,
    loading,
    error,
    loadBookmarks,
    addBookmark,
    removeBookmark,
    isQuranBookmarked,
    isBlogBookmarked
  };
};