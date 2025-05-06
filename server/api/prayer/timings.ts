import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  // Ambil query parameters
  const query = getQuery(event)
  const { latitude, longitude, method, forceRefresh } = query
  
  // Validasi input
  if (!latitude || !longitude) {
    return {
      success: false,
      message: 'Latitude and longitude are required'
    }
  }
  
  try {
    // Ambil URL API dari runtime config
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBaseUrl
    
    // Buat query string secara manual
    const queryString = new URLSearchParams()
    queryString.append('latitude', latitude.toString())
    queryString.append('longitude', longitude.toString())
    if (method) queryString.append('method', method.toString())
    if (forceRefresh === 'true') queryString.append('forceRefresh', 'true')
    
    // Buat URL untuk API backend dengan query string
    const url = `${baseUrl}/api/prayer/timings?${queryString.toString()}`
    
    // Forward request ke backend
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    // Parse response JSON
    const data = await response.json()
    
    // Return hasil
    return data
  } catch (error) {
    console.error('Error in prayer timings proxy:', error)
    
    // Return error
    return {
      success: false,
      message: 'Failed to fetch prayer times'
    }
  }
})