// stores/user-dashboard.store.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import { usePrayerService } from '~/composables/usePrayerService';
import { ref } from 'vue'; // Gunakan ref standar, bukan shallowRef

// Tetap gunakan interface yang sama untuk tipe data
export interface LastRead {
  surah: {
    number: number;
    name: string;
    nameArab: string;
  };
  ayat: number;
  timestamp: string;
}

export interface Bookmark {
  id: string;
  type: 'quran' | 'blog';
  surah?: {
    number: number;
    name: string;
  };
  ayat?: number;
  text?: string;
  blogId?: number;
  blogTitle?: string;
  timestamp: string;
  notes?: string;
}

export interface PrayerTime {
  name: string;
  time: string;
  isNext: boolean;
  timeRemaining?: string;
}

export interface Location {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  usingDefault?: boolean;
}

export interface UserDashboardState {
  // Prayer times
  todayPrayers: PrayerTime[];
  prayerLocation: Location | null;
  loadingPrayer: boolean;
  prayerError: string | null;
  
  // Cache timestamps
  prayerCacheTimestamp: number;
  bookmarksCacheTimestamp: number;
  articlesCacheTimestamp: number;
  
  // Quran
  lastRead: LastRead | null;
  bookmarks: Bookmark[];
  loadingQuran: boolean;
  quranError: string | null;
  
  // Blog
  latestArticles: any[]; // Sesuaikan dengan Blog model
  loadingArticles: boolean;
  articlesError: string | null;
  
  // Dashboard
  dashboardInitialized: boolean;
  dashboardLoadPriority: number;

  _lastUpdateMinuteKey: string | null;
}

export const useUserDashboardStore = defineStore('userDashboard', {
  state: (): UserDashboardState => ({
    // Property yang sudah ada
    todayPrayers: [
      { name: 'Subuh', time: '00:00', isNext: false },
      { name: 'Dzuhur', time: '00:00', isNext: false },
      { name: 'Ashar', time: '00:00', isNext: false },
      { name: 'Maghrib', time: '00:00', isNext: false },
      { name: 'Isya', time: '00:00', isNext: false }
    ],
    prayerLocation: null,
    loadingPrayer: false,
    prayerError: null,
    
    // Cache timestamps
    prayerCacheTimestamp: 0,
    bookmarksCacheTimestamp: 0,
    articlesCacheTimestamp: 0,
    
    // Quran
    lastRead: null,
    bookmarks: [],
    loadingQuran: false,
    quranError: null,
    
    // Blog
    latestArticles: [],
    loadingArticles: false,
    articlesError: null,
    
    // Dashboard
    dashboardInitialized: false,
    dashboardLoadPriority: 0,
    
    // Tambahkan properti internal cache dengan nilai awal
    _lastUpdateMinuteKey: null
  }),
  
  actions: {
    // Prayer times actions
    async fetchPrayerTimes(lat: number | undefined, lng: number | undefined, forceRefresh: boolean = false) {
      // Jika tidak forced refresh, periksa cache validity
      if (!forceRefresh) {
        const now = Date.now();
        // Gunakan data cache jika masih valid (15 menit)
        if (now - this.prayerCacheTimestamp < 15 * 60 * 1000 && 
            this.todayPrayers.length > 0 && 
            this.prayerLocation !== null) {
          this.updateNextPrayer();
          return true;
        }
      }
      
      this.loadingPrayer = true;
      this.prayerError = null;
      
      try {
        // Jika lat dan lng diberikan langsung, gunakan nilai tersebut
        if (lat !== undefined && lng !== undefined) {
          await this.fetchPrayerTimesWithCoords(lat, lng);
          return true;
        }
        
        // Jika tidak ada koordinat yang diberikan, coba dapatkan dari geolocation
        if (process.client && navigator.geolocation) {
          try {
            // Gunakan Promise untuk geolocation
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(
                position => resolve(position),
                error => reject(error),
                {
                  enableHighAccuracy: true,
                  timeout: 10000, // Tambah timeout menjadi 10 detik
                  maximumAge: 0
                }
              );
            });
            
            // Gunakan koordinat dari geolocation
            await this.fetchPrayerTimesWithCoords(
              position.coords.latitude,
              position.coords.longitude
            );
          } catch (geoError) {
            console.error('Geolocation error:', geoError);
            // Log error code untuk debug
            if (geoError instanceof GeolocationPositionError) {
              console.error('Geolocation error code:', geoError.code);
              // 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
            }
            
            // Fallback ke Bandung jika gagal mendapatkan lokasi
            await this.fetchPrayerTimesWithCoords(-6.9175, 107.6191);
            // Set flag lokasi default
            if (this.prayerLocation) {
              this.prayerLocation.usingDefault = true;
            }
          }
        } else {
          // Fallback jika geolocation tidak tersedia
          await this.fetchPrayerTimesWithCoords(-6.9175, 107.6191);
        }
        
        // Update cache timestamp
        this.prayerCacheTimestamp = Date.now();
        return true;
      } catch (error) {
        console.error('Error in fetchPrayerTimes:', error);
        this.prayerError = 'Gagal memuat jadwal salat. Silakan coba lagi.';
        return false;
      } finally {
        this.loadingPrayer = false;
      }
    },

    async fetchPrayerTimesWithCoords(latitude: number, longitude: number) {
      try {
        const prayerService = usePrayerService();
        const result = await prayerService.getTodayPrayerTimes(latitude, longitude);
        
        // Periksa apakah respons valid
        if (!result.data) {
          this.prayerError = 'Gagal memuat jadwal salat: Data tidak tersedia';
          return;
        }
        
        const responseData = result.data;
        
        if (responseData.success && responseData.data && responseData.data.prayerTimes) {
          // Ekstrak data prayer times
          const prayerTimesData = responseData.data.prayerTimes;
          
          // Ekstrak data lokasi
          const locationData = responseData.data.location;
          
          // Pastikan timings ada
          if (prayerTimesData.timings) {
            // Update prayer times dengan efisien
            const newPrayers = [
              { name: 'Subuh', time: prayerTimesData.timings.Fajr, isNext: false },
              { name: 'Dzuhur', time: prayerTimesData.timings.Dhuhr, isNext: false },
              { name: 'Ashar', time: prayerTimesData.timings.Asr, isNext: false },
              { name: 'Maghrib', time: prayerTimesData.timings.Maghrib, isNext: false },
              { name: 'Isya', time: prayerTimesData.timings.Isha, isNext: false }
            ];
            
            this.todayPrayers = newPrayers;
            
            // Calculate which prayer is next
            this.updateNextPrayer();
            
            // Deteksi apakah ini adalah lokasi default
            const isDefaultLocation = 
              Math.abs(latitude - (-6.9175)) < 0.01 && 
              Math.abs(longitude - 107.6191) < 0.01;
            
            // Update location data dengan efisien
            if (locationData) {
              // Format data lokasi dengan konsisten
              this.prayerLocation = {
                city: locationData.city === "Unknown" ? 'Bandung' : locationData.city,
                country: locationData.country === "Unknown" ? 'Indonesia' : locationData.country,
                latitude: locationData.latitude || latitude,
                longitude: locationData.longitude || longitude,
                usingDefault: isDefaultLocation
              };
            } else {
              // Fallback ke default
              this.prayerLocation = {
                city: 'Bandung',
                country: 'Indonesia',
                latitude,
                longitude,
                usingDefault: isDefaultLocation
              };
            }
          } else {
            this.prayerError = 'Waktu salat tidak ditemukan dalam data';
          }
        } else {
          this.prayerError = 'Format data jadwal salat tidak valid';
        }
      } catch (error) {
        console.error('Error in fetchPrayerTimesWithCoords:', error);
        this.prayerError = 'Gagal memuat jadwal salat dari koordinat';
      }
    },
    
    // Optimasi updateNextPrayer untuk mengurangi perhitungan
    updateNextPrayer() {
      // Jangan lakukan apa-apa jika tidak ada data
      if (!this.todayPrayers || this.todayPrayers.length === 0) return;
      
      // Cek apakah perlu update - hanya update setiap menit
      const now = new Date();
      const minuteKey = `${now.getHours()}:${now.getMinutes()}`;
      
      // Gunakan memoized key untuk mencegah perhitungan berulang
      if (this._lastUpdateMinuteKey === minuteKey) return;
      this._lastUpdateMinuteKey = minuteKey;
      
      // Buat salinan lokal untuk menghindari mutasi langsung pada state
      const prayers = [...this.todayPrayers];
      
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
      let nextPrayerIndex = -1;
      let minDifference = Infinity;
      
      // Hitung properti isNext & timeRemaining sekali saja
      prayers.forEach((prayer, index) => {
        // Reset flags
        prayer.isNext = false;
        prayer.timeRemaining = undefined;
        
        // Parse prayer time hanya sekali
        const [hour, minute] = prayer.time.split(':').map(Number);
        const prayerTimeInMinutes = hour * 60 + minute;
        const difference = prayerTimeInMinutes - currentTimeInMinutes;
        
        if (difference > 0 && difference < minDifference) {
          minDifference = difference;
          nextPrayerIndex = index;
        }
      });
      
      // Set next prayer
      if (nextPrayerIndex !== -1) {
        const prayer = prayers[nextPrayerIndex];
        prayer.isNext = true;
        
        // Format time remaining - gunakan template string untuk performa
        const hours = Math.floor(minDifference / 60);
        const minutes = minDifference % 60;
        
        let remainingText = '';
        if (hours > 0) {
          remainingText = `${hours} jam ${minutes} menit lagi`;
        } else {
          remainingText = `${minutes} menit lagi`;
        }
        
        prayer.timeRemaining = remainingText;
      }
      
      // Update state dengan efisien
      this.todayPrayers = prayers;
    },
    
    // Quran actions
    loadLastRead() {
      if (process.client) {
        const lastReadJson = localStorage.getItem('lastRead');
        if (lastReadJson) {
          try {
            // Parse data dari localStorage
            const rawData = JSON.parse(lastReadJson);
            
            // Transform data ke format yang diharapkan, hanya jika berbeda
            const newLastRead: LastRead = {
              surah: {
                number: rawData.surah,
                name: rawData.name,
                nameArab: rawData.nameArab || ''
              },
              ayat: rawData.ayat || rawData.page || 1,
              timestamp: rawData.timestamp
            };
            
            this.lastRead = newLastRead;
          } catch (error) {
            console.error('Error parsing last read data:', error);
            this.lastRead = null;
          }
        }
      }
    },

    async fetchUserLastRead() {
      // Skip jika tidak login
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return;
      
      try {
        const { apiFetch } = useApi();
        const { data } = await apiFetch('/user/last-read');
        
        if (data.value && data.value.success && data.value.data) {
          // Jika ada data dari API, gunakan data tersebut
          this.lastRead = {
            surah: {
              number: data.value.data.surahNumber,
              name: data.value.data.surahName,
              nameArab: data.value.data.surahNameArab || ''
            },
            ayat: data.value.data.ayatNumber,
            timestamp: data.value.data.timestamp
          };
        } else {
          // Jika tidak ada data dari API, gunakan localStorage
          this.loadLastRead();
        }
      } catch (error) {
        console.error('Error fetching user last read:', error);
        // Fallback ke localStorage
        this.loadLastRead();
      }
    },
    
    loadBookmarks() {
      if (process.client) {
        // Jika ada cache recency check
        const now = Date.now();
        if (now - this.bookmarksCacheTimestamp < 5 * 60 * 1000 && 
            this.bookmarks.length > 0) {
          return;
        }
        
        // Load bookmarks from localStorage for non-logged in users
        const bookmarksJson = localStorage.getItem('quran_bookmarks');
        if (bookmarksJson) {
          try {
            this.bookmarks = JSON.parse(bookmarksJson);
            this.bookmarksCacheTimestamp = now;
          } catch (error) {
            console.error('Error parsing bookmarks data:', error);
            this.bookmarks = [];
          }
        }
        
        // If user is logged in, fetch bookmarks from API
        const authStore = useAuthStore();
        if (authStore.isAuthenticated) {
          // Schedule this to run after a short delay for better loading sequence
          setTimeout(() => {
            this.fetchUserBookmarks();
          }, 500);
        }
      }
    },
    
    async fetchUserBookmarks() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return;
      
      this.loadingQuran = true;
      
      try {
        const { apiFetch } = useApi();
        const { data } = await apiFetch('/bookmarks', {
          params: {
            type: 'quran'
          }
        });
        
        if (data.value && data.value.success) {
          // Transform API bookmarks to match our format
          this.bookmarks = data.value.data.map((bookmark: any) => ({
            id: bookmark.id,
            type: 'quran',
            surah: {
              number: parseInt(bookmark.referenceId.split(':')[0]),
              name: bookmark.notes?.split(' - ')[0] || 'Surah'
            },
            ayat: parseInt(bookmark.referenceId.split(':')[1]),
            text: bookmark.notes?.split(' - ')[1] || '',
            timestamp: bookmark.createdAt,
            notes: bookmark.notes
          }));
          
          // Update cache timestamp
          this.bookmarksCacheTimestamp = Date.now();
        }
      } catch (error) {
        console.error('Error fetching user bookmarks:', error);
        this.quranError = 'Gagal memuat bookmark';
      } finally {
        this.loadingQuran = false;
      }
    },
    
    // Blog actions
    async fetchLatestArticles() {
      // Jika data sudah ada dan relatif baru (15 menit), gunakan cache
      if (!this.loadingArticles && this.latestArticles.length > 0) {
        const now = Date.now();
        if (now - this.articlesCacheTimestamp < 15 * 60 * 1000) {
          return true;
        }
      }
      
      this.loadingArticles = true;
      this.articlesError = null;
      
      try {
        const { apiFetch } = useApi();
        
        const { data } = await apiFetch('/blogs', {
          params: {
            limit: 3,
            status: 'published',
            sort: 'publishedAt:desc'
          }
        });
        
        if (data.value && data.value.success) {
          this.latestArticles = data.value.data.blogs;
          this.articlesCacheTimestamp = Date.now();
          return true;
        } else {
          this.latestArticles = [];
          this.articlesError = 'Tidak ada artikel yang tersedia saat ini.';
          return false;
        }
      } catch (error) {
        console.error('Error fetching latest articles:', error);
        this.articlesError = 'Gagal memuat artikel terbaru.';
        this.latestArticles = [];
        return false;
      } finally {
        this.loadingArticles = false;
      }
    },

    // Mengoptimasi refreshLatestArticles untuk mendukung mode "check only"
    async refreshLatestArticles(checkOnly: boolean = false) {
      if (!checkOnly) {
        // Don't show loading state on checks to avoid UI flicker
        this.articlesError = null;
      }
      
      try {
        const { apiFetch } = useApi();
        
        const { data } = await apiFetch('/blogs', {
          params: {
            limit: 4,
            status: 'published',
            sort: 'publishedAt:desc',
            forceRefresh: true // Parameter untuk melewati cache
          }
        });
        
        if (data.value && data.value.success) {
          // Jika mode check only, bandingkan dan return apakah ada perubahan
          if (checkOnly) {
            // Compare dengan data existing
            if (this.latestArticles.length === 0 && data.value.data.blogs.length > 0) {
              return true; // Ada artikel baru
            }
            
            // Periksa apakah ada perubahan ID
            const currentIds = this.latestArticles.map((a: any) => a.id).sort();
            const newIds = data.value.data.blogs.map((a: any) => a.id).sort();
            
            if (currentIds.length !== newIds.length) {
              return true; // Jumlah artikel berubah
            }
            
            // Bandingkan array ID
            for (let i = 0; i < currentIds.length; i++) {
              if (currentIds[i] !== newIds[i]) {
                return true; // Ada perubahan ID
              }
            }
            
            // Periksa timestamp update
            for (const newArticle of data.value.data.blogs) {
              const existingArticle = this.latestArticles.find((a: any) => a.id === newArticle.id);
              if (existingArticle && newArticle.updatedAt && existingArticle.updatedAt &&
                  new Date(newArticle.updatedAt) > new Date(existingArticle.updatedAt)) {
                return true; // Ada artikel yang diupdate
              }
            }
            
            return false; // Tidak ada perubahan
          }
          
          // Mode normal, update state
          this.latestArticles = data.value.data.blogs;
          this.articlesCacheTimestamp = Date.now();
          return true;
        } else {
          if (!checkOnly) {
            this.articlesError = 'Tidak ada artikel yang tersedia saat ini.';
          }
          return false;
        }
      } catch (error) {
        console.error('Error refreshing latest articles:', error);
        if (!checkOnly) {
          this.articlesError = 'Gagal memperbarui artikel terbaru.';
        }
        return false;
      } finally {
        if (!checkOnly) {
          this.loadingArticles = false;
        }
      }
    },

    // Optimize dashboard initialization
    async initDashboard(forceRefresh: boolean = false) {
      if (this.dashboardInitialized && !forceRefresh) return;
      
      this.dashboardLoadPriority = 0;
      
      // Load initial data that's quick (from localStorage)
      this.loadLastRead();
      
      // Start prayer times request immediately (most important)
      this.dashboardLoadPriority = 1;
      // Berikan nilai default pada parameter fetchPrayerTimes
      const prayerPromise = this.fetchPrayerTimes(undefined, undefined);
      
      // Update next prayer time initially
      this.updateNextPrayer();
      
      // Load bookmarks with a slight delay
      setTimeout(() => {
        this.dashboardLoadPriority = 2;
        this.loadBookmarks();
      }, 300);
      
      // Fetch articles with a longer delay
      setTimeout(() => {
        this.dashboardLoadPriority = 3;
        this.fetchLatestArticles();
      }, 1000);
      
      // Setup a timer untuk update next prayer time setiap menit
      if (process.client) {
        setInterval(() => {
          this.updateNextPrayer();
        }, 60000); // Every minute
      }
      
      this.dashboardInitialized = true;
    },
    
    // Fungsi untuk me-refresh lastRead state
    refreshLastRead() {
      this.loadLastRead();
    }
  }
});

// Tambahkan import untuk useAuthStore
import { useAuthStore } from '~/stores/auth';