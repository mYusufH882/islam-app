import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useApi } from '~/composables/useApi';

// Define interface for bookmark data structure
interface BookmarkSurah {
  number: number;
  name: string;
  nameArab?: string;
}

interface QuranBookmark {
  id: string;
  surah: BookmarkSurah;
  ayat: number;
  text?: string;
  translation?: string;
  timestamp: string;
}

// Define interface for bookmark parameters
interface BookmarkParams {
  surahId: number;
  verseId?: number | null;
  surahName?: string;
  surahNameArab?: string;
  text?: string;
  translation?: string;
}

export const useBookmarkService = () => {
  const authStore = useAuthStore();
  const bookmarks = ref<QuranBookmark[]>([]);
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
          // For non-authenticated users, use localStorage
          const storedBookmarks = localStorage.getItem('quran_bookmarks');
          if (storedBookmarks) {
            bookmarks.value = JSON.parse(storedBookmarks);
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
      const { data } = await apiFetch('/bookmarks', {
        params: { type: 'quran' }
      });
      
      if (data.value && data.value.success) {
        bookmarks.value = data.value.data;
      }
    } catch (err) {
      console.error('API fetch error:', err);
      // Fallback to localStorage if API fails
      const storedBookmarks = localStorage.getItem('quran_bookmarks');
      if (storedBookmarks) {
        bookmarks.value = JSON.parse(storedBookmarks);
      }
    }
  };
  
  // Add a bookmark
  const addBookmark = async (bookmark: BookmarkParams): Promise<boolean> => {
    try {
      // Format the bookmark object
      const newBookmark: QuranBookmark = {
        id: `${bookmark.surahId}:${bookmark.verseId || 0}`,
        surah: {
          number: bookmark.surahId,
          name: bookmark.surahName || '',
          nameArab: bookmark.surahNameArab || ''
        },
        ayat: bookmark.verseId || 0,
        text: bookmark.text || '',
        translation: bookmark.translation || '',
        timestamp: new Date().toISOString()
      };
      
      // Add to local state
      const existingIndex = bookmarks.value.findIndex(b => 
        b.id === newBookmark.id || 
        (b.surah.number === newBookmark.surah.number && b.ayat === newBookmark.ayat)
      );
      
      if (existingIndex >= 0) {
        // Update existing bookmark
        bookmarks.value[existingIndex] = newBookmark;
      } else {
        // Add new bookmark
        bookmarks.value.push(newBookmark);
      }
      
      // Save to localStorage
      if (process.client) {
        localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarks.value));
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
  const removeBookmark = async (bookmarkId: string | BookmarkParams): Promise<boolean> => {
    try {
      // Find the bookmark to remove
      let index = -1;
      
      if (typeof bookmarkId === 'string') {
        index = bookmarks.value.findIndex(b => b.id === bookmarkId);
      } else {
        index = bookmarks.value.findIndex(b => 
          (b.surah.number === bookmarkId.surahId && b.ayat === bookmarkId.verseId)
        );
      }
      
      if (index >= 0) {
        const removedBookmark = bookmarks.value[index];
        
        // Remove from local state
        bookmarks.value.splice(index, 1);
        
        // Save to localStorage
        if (process.client) {
          localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarks.value));
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
  const syncBookmarkToApi = async (bookmark: QuranBookmark, action: 'add' | 'remove'): Promise<void> => {
    if (!authStore.isAuthenticated) return;
    
    try {
      const { apiFetch } = useApi();
      
      if (action === 'add') {
        await apiFetch('/bookmarks', {
          method: 'POST',
          body: {
            type: 'quran',
            referenceId: bookmark.id,
            notes: `${bookmark.surah.name} - ${bookmark.text}`
          }
        });
      } else if (action === 'remove') {
        await apiFetch(`/bookmarks/${bookmark.id}`, {
          method: 'DELETE'
        });
      }
    } catch (err) {
      console.error('Error syncing bookmark to API:', err);
      // Continue without failing - we've already updated localStorage
    }
  };
  
  // Check if a verse is bookmarked
  const isBookmarked = (surahId: number, verseId: number | null = null): boolean => {
    return bookmarks.value.some(bookmark => 
      bookmark.surah.number === surahId && 
      (verseId === null || bookmark.ayat === verseId)
    );
  };
  
  // Initialize bookmarks
  loadBookmarks();
  
  return {
    bookmarks,
    loading,
    error,
    loadBookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked
  };
};