export default defineNuxtPlugin(() => {
    if (process.client) {
      // Menambahkan kelas 'hydrated' ke body setelah hydration selesai
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          document.body.classList.add('hydrated');
        }, 200); // Memberikan sedikit delay untuk memastikan hydration benar-benar selesai
      });
    }
});