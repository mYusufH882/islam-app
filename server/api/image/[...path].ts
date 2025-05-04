import { defineEventHandler } from 'h3';
import { proxyRequest } from 'h3';

export default defineEventHandler(async (event) => {
  // Get the path segments from the URL
  const pathSegments = event.context.params?.path || [];
  
  // Join all path segments to create the full path
  const fullPath = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments;
  
  // Define your backend URL - Make sure this matches your backend server
  const backendURL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  
  // Create the full URL to the image - connecting to the direct uploads folder path
  const imageUrl = `${backendURL}/uploads/${fullPath}`;
  
  console.log(`Proxying image request to: ${imageUrl}`);
  
  try {
    // Proxy the request to your backend server
    return proxyRequest(event, imageUrl);
  } catch (error) {
    console.error('Error proxying image request:', error);
    return new Response('Image not found', { status: 404 });
  }
});