import { ref } from 'vue';
// Tambahkan import useRuntimeConfig dari Nuxt
import { useRuntimeConfig } from 'nuxt/app';

// Menambahkan interface untuk tipe data surah dan respons API
interface Surah {
  number: number;
  name: {
    short: string;
    transliteration: {
      id: string;
    };
    translation: {
      id: string;
    };
  };
  revelation: {
    id: string;
  };
  numberOfVerses: number;
}

interface SurahDetail extends Surah {
  verses: Array<{
    number: {
      inSurah: number;
    };
    text: {
      arab: string;
      transliteration: {
        en: string;
      };
    };
    translation: {
      id: string;
    };
  }>;
  preBismillah?: {
    text: {
      arab: string;
      transliteration: {
        en: string;
      };
    };
    translation: {
      id: string;
    };
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  cached?: boolean;
}

export const useQuranService = () => {
  // Mengambil konfigurasi runtime dari Nuxt
  const config = useRuntimeConfig();
  
  // Mendapatkan base URL API dari konfigurasi
  const apiBaseUrl = config.public.apiBaseUrl || '/api';
  
  // State untuk menyimpan data
  const surahs = ref<Surah[]>([]);
  const selectedSurah = ref<SurahDetail | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  
  /**
   * Mendapatkan daftar semua surah
   */
  const fetchAllSurahs = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      // Perbaikan endpoint sesuai dengan struktur backend
      // Dari /quran menjadi /quran/surah
      const response = await fetch(`${apiBaseUrl}/quran/surah`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengambil daftar surah');
      }
      
      const result = await response.json() as ApiResponse<Surah[]>;
      
      if (result.success) {
        surahs.value = result.data;
        return { data: result.data, error: null };
      } else {
        throw new Error(result.message);
      }
    } catch (err: unknown) {
      console.error('Error fetching surahs:', err);
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil daftar surah';
      error.value = errorMessage;
      return { data: null, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };
  
  /**
   * Mendapatkan detail surah berdasarkan ID
   * @param id - ID surah (1-114)
   */
  const fetchSurahById = async (id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Validasi parameter
      if (!id || isNaN(Number(id))) {
        throw new Error('ID surah tidak valid');
      }
      
      // Perbaikan endpoint sesuai dengan struktur backend
      // Dari /quran/{id} menjadi /quran/surah/{id}
      const response = await fetch(`${apiBaseUrl}/quran/surah/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal mengambil detail surah ${id}`);
      }
      
      const result = await response.json() as ApiResponse<SurahDetail>;
      
      if (result.success) {
        selectedSurah.value = result.data;
        return { data: result.data, error: null };
      } else {
        throw new Error(result.message);
      }
    } catch (err: unknown) {
      console.error(`Error fetching surah ${id}:`, err);
      const errorMessage = err instanceof Error ? err.message : `Terjadi kesalahan saat mengambil detail surah ${id}`;
      error.value = errorMessage;
      return { data: null, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };
  
  /**
   * Mendapatkan ayat berdasarkan ID surah dan nomor ayat
   * @param surahId - ID surah (1-114)
   * @param verseNumber - Nomor ayat
   */
  const fetchVerse = async (surahId: number, verseNumber: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Validasi parameter
      if (!surahId || isNaN(Number(surahId)) || !verseNumber || isNaN(Number(verseNumber))) {
        throw new Error('ID surah atau nomor ayat tidak valid');
      }
      
      // Endpoint untuk mengambil ayat tertentu
      const response = await fetch(`${apiBaseUrl}/quran/surah/${surahId}/verse/${verseNumber}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal mengambil ayat ${verseNumber} dari surah ${surahId}`);
      }
      
      const result = await response.json() as ApiResponse<any>; // Gunakan tipe yang sesuai untuk verse
      
      if (result.success) {
        return { data: result.data, error: null };
      } else {
        throw new Error(result.message);
      }
    } catch (err: unknown) {
      console.error(`Error fetching verse ${verseNumber} from surah ${surahId}:`, err);
      const errorMessage = err instanceof Error ? err.message : `Terjadi kesalahan saat mengambil ayat`;
      error.value = errorMessage;
      return { data: null, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };
  
  /**
   * Mencari surah berdasarkan kata kunci
   * @param keyword - Kata kunci pencarian
   */
  const searchSurahs = async (keyword: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Validasi parameter
      if (!keyword) {
        throw new Error('Kata kunci pencarian diperlukan');
      }
      
      // Karena tidak ada endpoint search khusus di backend,
      // kita ambil semua surah dulu lalu filter di sisi client
      const { data, error: fetchError } = await fetchAllSurahs();
      
      if (fetchError) {
        throw new Error(fetchError);
      }
      
      if (!data) {
        throw new Error('Gagal mengambil daftar surah untuk pencarian');
      }
      
      // Filter surah berdasarkan keyword
      const query = keyword.toLowerCase();
      const filteredSurahs = data.filter(surah => 
        surah.name.transliteration.id.toLowerCase().includes(query) ||
        surah.name.translation.id.toLowerCase().includes(query) ||
        surah.number.toString().includes(query)
      );
      
      return { 
        data: filteredSurahs, 
        error: null 
      };
    } catch (err: unknown) {
      console.error('Error searching surahs:', err);
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat mencari surah';
      error.value = errorMessage;
      return { data: null, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };
  
  return {
    surahs,
    selectedSurah,
    loading,
    error,
    fetchAllSurahs,
    fetchSurahById,
    fetchVerse,
    searchSurahs
  };
};