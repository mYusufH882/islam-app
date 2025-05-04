import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Ambil URL API dari runtime config
    const config = useRuntimeConfig()
    const apiBaseUrl = config.public.apiBaseUrl
    
    // Buat URL untuk API backend Anda 
    const url = `${apiBaseUrl}/quran`
    
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
    console.error('Error dalam proxy daftar surah:', error)
    
    // Return error
    return {
      success: false,
      message: 'Gagal mengambil daftar surah',
      error: error instanceof Error ? error.message : String(error)
    }
  }
})