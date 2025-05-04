export const getImageUrl = (path) => {
  if (!path) return null;
  
  // If path is already a full URL with http/https, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If path is a complete backend path starting with /uploads/
  // Extract just the part after /uploads/
  if (path.includes('/uploads/')) {
    const pathParts = path.split('/uploads/');
    path = pathParts[1];
  }
  
  // Remove any leading slash
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  
  // Return the path through our API endpoint
  return `/api/image/${path}`;
};