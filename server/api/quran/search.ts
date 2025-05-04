import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  // Ambil query parameters
  const query = getQuery(event)
  const keyword = query.keyword as string
  
  // Validasi keyword
  if (!keyword) {
    return {
      success: false,
      message: 'Kata kunci pencarian diperlukan'
    }
  }
  
  try {
    // Ambil URL API dari runtime config
    const config = useRuntimeConfig()
    const apiBaseUrl = config.public.apiBaseUrl
    
    // Buat URL untuk API backend Anda dengan parameter pencarian
    const url = `${apiBaseUrl}/quran/search?keyword=${encodeURIComponent(keyword)}`
    
    // Forward request ke backend Anda
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    // Parse response JSON
    const data = await response.json()
    
    // Forward response dari backend ke frontend
    return data
  } catch (error) {
    console.error('Error dalam pencarian surah:', error)
    
    // Return error
    return {
      success: false,
      message: 'Gagal melakukan pencarian surah',
      error: error instanceof Error ? error.message : String(error)
    }
  }
})