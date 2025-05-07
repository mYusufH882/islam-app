import { defineStore } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useApi } from '~/composables/useApi';
import { usePrayerService } from '~/composables/usePrayerService';

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
}

export interface UserDashboardState {
  // Prayer times
  todayPrayers: PrayerTime[];
  prayerLocation: Location | null;
  loadingPrayer: boolean;
  prayerError: string | null;
  
  // Quran
  lastRead: LastRead | null;
  bookmarks: Bookmark[];
  loadingQuran: boolean;
  quranError: string | null;
  
  // Blog
  latestArticles: any[]; // Tipe sesuaikan dengan Blog model
  loadingArticles: boolean;
  articlesError: string | null;
  
  // Dashboard
  dashboardInitialized: boolean;
}

export const useUserDashboardStore = defineStore('userDashboard', {
  state: (): UserDashboardState => ({
    // Prayer times
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
    dashboardInitialized: false
  }),
  
  actions: {
    // Prayer actions
    async fetchPrayerTimes() {
      this.loadingPrayer = true;
      this.prayerError = null;
      
      try {
        if (process.client && navigator.geolocation) {
          // Menggunakan Promise untuk menangani geolocation dengan tipe yang benar
          const getPosition = (): Promise<GeolocationPosition> => {
            return new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(
                position => resolve(position),
                error => {
                  console.error('Geolocation error:', error);
                  reject(error);
                },
                {
                  enableHighAccuracy: true,
                  timeout: 5000,
                  maximumAge: 0
                }
              );
            });
          };
          
          try {
            // Coba dapatkan posisi pengguna
            const position = await getPosition();
            const { latitude, longitude } = position.coords;
            await this.fetchPrayerTimesWithCoords(latitude, longitude);
          } catch (geoError) {
            console.log('Izin lokasi ditolak atau error, menggunakan lokasi default Bandung');
            // Fallback ke Bandung jika izin lokasi ditolak
            await this.fetchPrayerTimesWithCoords(-6.9175, 107.6191); // Bandung
          }
        } else {
          // Fallback jika geolocation tidak tersedia
          console.log('Geolocation tidak tersedia, menggunakan lokasi default Bandung');
          await this.fetchPrayerTimesWithCoords(-6.9175, 107.6191); // Bandung
        }
      } catch (error) {
        console.error('Error in fetchPrayerTimes:', error);
        this.prayerError = 'Gagal memuat jadwal salat. Silakan coba lagi.';
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
            // Update prayer times
            this.todayPrayers = [
              { name: 'Subuh', time: prayerTimesData.timings.Fajr, isNext: false },
              { name: 'Dzuhur', time: prayerTimesData.timings.Dhuhr, isNext: false },
              { name: 'Ashar', time: prayerTimesData.timings.Asr, isNext: false },
              { name: 'Maghrib', time: prayerTimesData.timings.Maghrib, isNext: false },
              { name: 'Isya', time: prayerTimesData.timings.Isha, isNext: false }
            ];
            
            // Calculate which prayer is next
            this.updateNextPrayer();
            
            // Perbaikan untuk location - gunakan lokasi yang sesuai
            if (locationData) {
              // Jika lokasi "Unknown", gunakan data dari timezone atau default Bandung
              let city = locationData.city;
              let country = locationData.country;
              
              // Tentukan apakah ini adalah lokasi default Bandung
              const isBandungDefault = Math.abs(latitude - (-6.9175)) < 0.01 && 
                                      Math.abs(longitude - 107.6191) < 0.01;
              
              // Jika ini adalah koordinat default Bandung atau city/country Unknown
              if (isBandungDefault || city === "Unknown" || country === "Unknown") {
                // Jika koordinat default Bandung, gunakan Bandung
                if (isBandungDefault) {
                  city = 'Bandung';
                  country = 'Indonesia';
                } 
                // Jika tidak, coba gunakan data timezone
                else if (prayerTimesData.meta && prayerTimesData.meta.timezone) {
                  const timezoneParts = prayerTimesData.meta.timezone.split('/');
                  if (timezoneParts.length > 1) {
                    city = timezoneParts[1].replace('_', ' ');
                    country = "Indonesia";
                  } else {
                    // Fallback ke Bandung jika tidak bisa mendapatkan kota dari timezone
                    city = 'Bandung';
                    country = 'Indonesia';
                  }
                } else {
                  // Fallback ke Bandung jika tidak ada timezone
                  city = 'Bandung';
                  country = 'Indonesia';
                }
              }
              
              this.prayerLocation = {
                city: city,
                country: country,
                latitude: locationData.latitude || latitude,
                longitude: locationData.longitude || longitude
              };
            } else {
              // Fallback ke default Bandung
              this.prayerLocation = {
                city: 'Bandung',
                country: 'Indonesia',
                latitude,
                longitude
              };
            }
          } else {
            this.prayerError = 'Waktu salat tidak ditemukan dalam data';
          }
        } else {
          console.error('Invalid data structure:', responseData);
          this.prayerError = 'Format data jadwal salat tidak valid';
        }
      } catch (error) {
        console.error('Error in fetchPrayerTimesWithCoords:', error);
        this.prayerError = 'Gagal memuat jadwal salat dari koordinat';
      }
    },
    
    updateNextPrayer() {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
      let nextPrayerIndex = -1;
      let minDifference = Infinity;
      
      this.todayPrayers.forEach((prayer, index) => {
        const [hour, minute] = prayer.time.split(':').map(Number);
        const prayerTimeInMinutes = hour * 60 + minute;
        const difference = prayerTimeInMinutes - currentTimeInMinutes;
        
        // Reset isNext flag and timeRemaining
        prayer.isNext = false;
        prayer.timeRemaining = undefined;
        
        if (difference > 0 && difference < minDifference) {
          minDifference = difference;
          nextPrayerIndex = index;
        }
      });
      
      // If we found a next prayer time
      if (nextPrayerIndex !== -1) {
        const prayer = this.todayPrayers[nextPrayerIndex];
        prayer.isNext = true;
        
        const hours = Math.floor(minDifference / 60);
        const minutes = minDifference % 60;
        
        let remainingText = '';
        if (hours > 0) {
          remainingText += `${hours} jam `;
        }
        remainingText += `${minutes} menit lagi`;
        
        prayer.timeRemaining = remainingText;
      }
    },
    
    // Quran actions
    loadLastRead() {
      if (process.client) {
        const lastReadJson = localStorage.getItem('quran_lastRead');
        if (lastReadJson) {
          try {
            this.lastRead = JSON.parse(lastReadJson);
          } catch (error) {
            console.error('Error parsing last read data:', error);
            this.lastRead = null;
          }
        }
      }
    },
    
    loadBookmarks() {
      if (process.client) {
        // Load bookmarks from localStorage for non-logged in users
        const bookmarksJson = localStorage.getItem('quran_bookmarks');
        if (bookmarksJson) {
          try {
            this.bookmarks = JSON.parse(bookmarksJson);
          } catch (error) {
            console.error('Error parsing bookmarks data:', error);
            this.bookmarks = [];
          }
        }
        
        // If user is logged in, fetch bookmarks from API
        const authStore = useAuthStore();
        if (authStore.isAuthenticated) {
          this.fetchUserBookmarks();
        }
      }
    },
    
    async fetchUserBookmarks() {
      if (!useAuthStore().isAuthenticated) return;
      
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
        } else {
          this.latestArticles = [];
          this.articlesError = 'Tidak ada artikel yang tersedia saat ini.';
        }
      } catch (error) {
        console.error('Error fetching latest articles:', error);
        this.articlesError = 'Gagal memuat artikel terbaru.';
        this.latestArticles = [];
      } finally {
        this.loadingArticles = false;
      }
    },

    //Refresh blog without reload page
    async refreshLatestArticles() {
      // Don't show the full loading state to avoid UI flicker
      this.articlesError = null;
      
      try {
        const { apiFetch } = useApi();
        
        const { data } = await apiFetch('/blogs', {
          params: {
            limit: 3,
            status: 'published',
            sort: 'publishedAt:desc',
            forceRefresh: true // Add a parameter to bypass any caching
          }
        });
        
        if (data.value && data.value.success) {
          this.latestArticles = data.value.data.blogs;
        } else {
          this.articlesError = 'Tidak ada artikel yang tersedia saat ini.';
        }
      } catch (error) {
        console.error('Error refreshing latest articles:', error);
        this.articlesError = 'Gagal memperbarui artikel terbaru.';
      }
    },
    
    // Dashboard initialization
    async initDashboard() {
      if (this.dashboardInitialized) return;
      
      // Load data from localStorage first (instant)
      this.loadLastRead();
      this.loadBookmarks();
      
      // Update next prayer time initially
      this.updateNextPrayer();
      
      // Setup a timer to update next prayer time every minute
      if (process.client) {
        setInterval(() => {
          this.updateNextPrayer();
        }, 60000); // Every minute
      }
      
      // Fetch data from API in parallel
      await Promise.allSettled([
        this.fetchPrayerTimes(),
        this.fetchLatestArticles()
      ]);
      
      this.dashboardInitialized = true;
    }
  }
});