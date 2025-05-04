export const usePrayerService = () => {
    // Get the runtime config to access apiBaseUrl
    const config = useRuntimeConfig();
    const apiBaseUrl = config.public.apiBaseUrl;
  
    /**
     * Mendapatkan jadwal sholat untuk hari ini
     * @param latitude - Koordinat latitude
     * @param longitude - Koordinat longitude
     * @param method - Metode perhitungan (opsional)
     */
    const getTodayPrayerTimes = async (latitude: number, longitude: number, method?: number) => {
      try {
        // Build query parameters
        const params = new URLSearchParams();
        params.append('latitude', latitude.toString());
        params.append('longitude', longitude.toString());
        if (method) params.append('method', method.toString());
        
        // Use apiBaseUrl from the config
        const response = await fetch(`${apiBaseUrl}/prayer/timings?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch prayer times');
        }
        
          const data = await response.json();
        //   console.log(data);
          
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching today prayer times:', error);
        return { data: null, error: 'Failed to fetch prayer times' };
      }
    };
    
    /**
     * Mendapatkan jadwal sholat untuk tanggal tertentu
     * @param date - Tanggal dalam format YYYY-MM-DD
     * @param latitude - Koordinat latitude
     * @param longitude - Koordinat longitude
     * @param method - Metode perhitungan (opsional)
     */
    const getPrayerTimesByDate = async (date: string, latitude: number, longitude: number, method?: number) => {
      try {
        // Validasi format tanggal
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
          throw new Error('Invalid date format. Use YYYY-MM-DD');
        }
        
        // Build query parameters
        const params = new URLSearchParams();
        params.append('latitude', latitude.toString());
        params.append('longitude', longitude.toString());
        if (method) params.append('method', method.toString());
        
        // Use apiBaseUrl from the config
        const response = await fetch(`${apiBaseUrl}/prayer/timings/${date}?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch prayer times for ${date}`);
        }
        
          const data = await response.json();
        //   console.log(data);
          
        return { data, error: null };
      } catch (error) {
        console.error(`Error fetching prayer times for ${date}:`, error);
        return { 
          data: null, 
          error: error instanceof Error ? error.message : `Failed to fetch prayer times for ${date}` 
        };
      }
    };
    
    /**
     * Mendapatkan kalender sholat untuk bulan tertentu
     * @param year - Tahun (contoh: 2025)
     * @param month - Bulan (1-12)
     * @param latitude - Koordinat latitude
     * @param longitude - Koordinat longitude
     * @param method - Metode perhitungan (opsional)
     */
    const getMonthlyCalendar = async (year: number, month: number, latitude: number, longitude: number, method?: number) => {
      try {
        // Validasi bulan
        if (month < 1 || month > 12) {
          throw new Error('Invalid month. Must be between 1 and 12.');
        }
        
        // Build query parameters
        const params = new URLSearchParams();
        params.append('latitude', latitude.toString());
        params.append('longitude', longitude.toString());
        if (method) params.append('method', method.toString());
        
        // Use apiBaseUrl from the config
        const response = await fetch(`${apiBaseUrl}/prayer/calendar/${year}/${month}?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch prayer calendar for ${year}-${month}`);
        }
        
        const data = await response.json();
        return { data, error: null };
      } catch (error) {
        console.error(`Error fetching prayer calendar for ${year}-${month}:`, error);
        return { 
          data: null, 
          error: error instanceof Error ? error.message : `Failed to fetch prayer calendar for ${year}-${month}` 
        };
      }
    };
    
    return {
      getTodayPrayerTimes,
      getPrayerTimesByDate,
      getMonthlyCalendar
    };
};