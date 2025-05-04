import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  // Ambil query parameters
  const query = getQuery(event)
  const { latitude, longitude } = query
  
  // Validasi koordinat
  if (!latitude || !longitude) {
    return {
      success: false,
      message: 'Latitude and longitude are required'
    }
  }
  
  try {
    // Buat query string secara manual
    const queryString = new URLSearchParams()
    queryString.append('latitude', latitude.toString())
    queryString.append('longitude', longitude.toString())
    queryString.append('localityLanguage', 'id')
    
    // Using the same location service as backend
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?${queryString.toString()}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    // Parse response JSON
    const locationData = await response.json()
    
    // Format location response
    const location = {
      city: locationData.city || locationData.locality || 'Unknown',
      country: locationData.countryName,
      latitude,
      longitude
    }
    
    // Return hasil
    return {
      success: true,
      data: { location },
      message: 'Successfully retrieved location information'
    }
  } catch (error) {
    console.error('Error in location proxy:', error)
    
    // Return fallback
    return {
      success: true,
      data: {
        location: {
          city: 'Unknown',
          country: 'Unknown',
          latitude,
          longitude
        }
      },
      message: 'Using fallback location'
    }
  }
})