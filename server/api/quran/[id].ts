import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // Ambil ID surah dari parameter URL
  const id = event.context.params?.id
  
  // Validasi ID
  if (!id || isNaN(Number(id))) {
    return {
      success: false,
      message: 'ID surah tidak valid'
    }
  }
  
  try {
    // Ambil URL API dari runtime config 
    const config = useRuntimeConfig()
    const apiBaseUrl = config.public.apiBaseUrl
    
    // Buat URL untuk API backend Anda
    const url = `${apiBaseUrl}/quran/${id}`
    
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
    console.error(`Error dalam proxy detail surah ${id}:`, error)
    
    // Return error
    return {
      success: false,
      message: `Gagal mengambil detail surah ${id}`,
      error: error instanceof Error ? error.message : String(error)
    }
  }
})