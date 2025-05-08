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
  id: string | number;
  type: 'quran' | 'blog';
  timestamp: string;
  // Quran specific fields
  surah?: BookmarkSurah;
  ayat?: number;
  text?: string;
  translation?: string;
  // Blog specific fields
  blog?: BookmarkBlog;
  // Backend specific fields that might be present
  referenceId?: string;
  userId?: number;
  notes?: string;
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
        // Process bookmarks returned from API
        bookmarks.value = data.value.data.map((bookmark: any) => {
          // Normalize bookmark format based on API response
          if (bookmark.type === 'quran') {
            let surahNumber = 0;
            let verseNumber = 0;
            
            // Extract surah and verse numbers from referenceId if present
            if (bookmark.referenceId && typeof bookmark.referenceId === 'string' && bookmark.referenceId.startsWith('quran:')) {
              const parts = bookmark.referenceId.split(':');
              if (parts.length >= 3) {
                surahNumber = parseInt(parts[1]);
                verseNumber = parseInt(parts[2]);
              }
            }
            
            return {
              id: bookmark.id,
              type: 'quran',
              referenceId: bookmark.referenceId,
              surah: {
                number: surahNumber,
                name: bookmark.notes?.split(' - ')?.[0] || 'Surah'
              },
              ayat: verseNumber,
              text: bookmark.notes?.split(' - ')?.[1] || '',
              timestamp: bookmark.createdAt || bookmark.timestamp || new Date().toISOString(),
              userId: bookmark.userId,
              notes: bookmark.notes
            };
          } else if (bookmark.type === 'blog') {
            let blogId = 0;
            
            // Extract blog id from referenceId if present
            if (bookmark.referenceId && typeof bookmark.referenceId === 'string' && bookmark.referenceId.startsWith('blog:')) {
              const parts = bookmark.referenceId.split(':');
              if (parts.length >= 2) {
                blogId = parseInt(parts[1]);
              }
            }
            
            return {
              id: bookmark.id,
              type: 'blog',
              referenceId: bookmark.referenceId,
              blog: {
                id: blogId,
                title: bookmark.notes || 'Blog Article'
              },
              timestamp: bookmark.createdAt || bookmark.timestamp || new Date().toISOString(),
              userId: bookmark.userId,
              notes: bookmark.notes
            };
          }
          
          // Fallback for unknown types
          return {
            ...bookmark,
            id: bookmark.id || `unknown:${Date.now()}`,
            timestamp: bookmark.createdAt || bookmark.timestamp || new Date().toISOString()
          };
        });
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
      console.log(`Starting to remove bookmark with ID: ${id} (${typeof id})`);
      // Find the bookmark to remove
      let bookmarkId: string | number = id;
      let index = -1;
      
      if (typeof id === 'number') {
        // First try direct number match
        index = bookmarks.value.findIndex(b => b.id === id);
        
        if (index === -1) {
          // Try as blog ID
          const blogRefId = `blog:${id}`;
          index = bookmarks.value.findIndex(b => 
            b.type === 'blog' && b.blog?.id === id || 
            b.referenceId === blogRefId
          );
        }
      } else {
        // String ID - direct match
        index = bookmarks.value.findIndex(b => b.id === id);
        
        // Try reference ID
        if (index === -1) {
          index = bookmarks.value.findIndex(b => b.referenceId === id);
        }
        
        // Try parsing quran IDs
        if (index === -1 && id.startsWith('quran:')) {
          const parts = id.split(':');
          if (parts.length >= 3) {
            const surahId = parseInt(parts[1]);
            const verseId = parseInt(parts[2]);
            
            index = bookmarks.value.findIndex(b => 
              b.type === 'quran' && 
              b.surah?.number === surahId && 
              b.ayat === verseId
            );
          }
        }
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
        
        // If authenticated, sync with API - use the ID directly
        if (authStore.isAuthenticated) {
          // Use the database ID (numerical) if available
          const apiId = typeof removedBookmark.id === 'number' ? 
            removedBookmark.id : 
            (removedBookmark.referenceId || bookmarkId);
            
          const { apiFetch } = useApi();
          
          try {
            const { data, error } = await apiFetch(`/bookmarks/${apiId}`, {
              method: 'DELETE'
            });
            
            if (error.value) {
              // Jika error 404 (Not Found), artinya bookmark sudah tidak ada di database
              // Ini bukan masalah, jadi kita bisa abaikan
              if (error.value.statusCode === 404) {
                // console.log(`Bookmark dengan ID ${apiId} sudah tidak ada di database atau sudah dihapus`);
              } else {
                // Untuk error lain, tampilkan pesan error tetapi jangan throw exception
                // console.error('API error removing bookmark:', error.value);
              }
            } else {
              console.log('Successfully deleted bookmark from API');
            }
          } catch (err) {
            // Tangkap semua error lainnya tapi jangan sampai gagal fungsi removeBookmark
            console.error('Error saat menghapus bookmark dari API:', err);
            // Kita tidak return false karena state lokal sudah diperbarui
          }
        }
      } else {
        console.warn(`Bookmark with ID ${bookmarkId} not found in local state`);
        
        // If authenticated, try direct API deletion
        if (authStore.isAuthenticated) {
          const { apiFetch } = useApi();
          console.log(`Attempting direct API deletion for ID: ${id}`);
          
          try {
            const { data, error } = await apiFetch(`/bookmarks/${id}`, {
              method: 'DELETE'
            });
            
            if (error.value) {
              // Jika error 404 (Not Found), artinya bookmark sudah tidak ada di database
              // Ini bukan masalah, jadi kita bisa abaikan
              if (error.value.statusCode === 404) {
                // console.log(`Bookmark dengan ID ${id} sudah tidak ada di database atau sudah dihapus`);
              } else {
                // Untuk error lain, tampilkan pesan error
                // console.error('API error removing bookmark:', error.value);
              }
            } else {
              console.log('Successfully deleted bookmark from API via direct deletion');
              // Refresh bookmarks from API after deletion
              await fetchBookmarksFromApi();
            }
          } catch (err) {
            console.error('Error attempting direct API deletion:', err);
            // Tidak perlu return false karena ini adalah upaya terakhir
          }
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
            referenceId: typeof bookmark.id === 'string' ? bookmark.id : String(bookmark.id),
            notes: `${bookmark.surah?.name || ''} - ${bookmark.text || ''}`
          };
        } else {
          payload = {
            type: 'blog',
            referenceId: typeof bookmark.id === 'string' ? bookmark.id : String(bookmark.id),
            notes: bookmark.blog?.title || ''
          };
        }
        
        console.log('Syncing bookmark to API (add):', payload);
        
        const { data, error } = await apiFetch('/bookmarks', {
          method: 'POST',
          body: payload
        });
        
        if (error.value) {
          // Hanya log error tanpa throw exception
          console.error('API error adding bookmark:', error.value);
          // Tidak perlu menampilkan UI error
        } else {
          console.log('Bookmark added to API successfully:', data.value);
        }
      }
    } catch (err) {
      console.error('Error syncing bookmark to API:', err);
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