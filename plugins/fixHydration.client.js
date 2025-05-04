export default defineNuxtPlugin(() => {
  // Plugin will only run on the client side
  if (process.client) {
    // Catch hydration warnings related to useAsyncData
    const originalWarn = console.warn;
    
    console.warn = (...args) => {
      // Check if the warning is about useAsyncData after mounting
      if (typeof args[0] === 'string' && 
          args[0].includes('[useAsyncData] Component is already mounted, please use $fetch instead')) {
        
        // Log a clearer message about what's happening
        // console.log('Hydration warning intercepted: useAsyncData called after component mounted');
        
        // Don't display the original warning as we're handling it
        return;
      }
      
      // Display all other warnings as normal
      originalWarn.apply(console, args);
    };
    
    // Add a helper function to the window that components can use
    window.$nuxtFetch = async (url, options = {}) => {
      // Helper for components to use after mounting instead of useAsyncData
      try {
        return await $fetch(url, options);
      } catch (error) {
        console.error('Error fetching data with $nuxtFetch:', error);
        throw error;
      }
    };
    
    // Set a flag to indicate the app is hydrated
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        window.__nuxtIsHydrated = true;
      }, 100);
    });
  }
});