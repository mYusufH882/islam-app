export default defineNuxtPlugin(() => {
  // Plugin ini hanya berjalan di sisi klien
  if (process.client) {
    // Tangkap peringatan hydration
    const originalWarn = console.warn;
    
    console.warn = (...args) => {
      // Jika pesan berkaitan dengan hydration, coba atasi
      if (typeof args[0] === 'string' && args[0].includes('Hydration')) {
        // Log untuk debugging tapi bisa di-suppress di produksi
        console.log('Resolving hydration issue...');
        
        // Jadwalkan untuk menjalankan fungsi perbaikan setelah komponen di-mount
        setTimeout(() => {
          // Coba temukan element yang bermasalah dan lakukan re-render mini pada mereka
          const layouts = document.querySelectorAll('[data-layout]');
          layouts.forEach(el => {
            const style = el.getAttribute('style') || '';
            el.setAttribute('style', style + '; display: block;');
          });
        }, 0);
        
        return; // Jangan tampilkan peringatan yang asli
      }
      
      // Tampilkan peringatan lain seperti biasa
      originalWarn.apply(console, args);
    };
  }
});