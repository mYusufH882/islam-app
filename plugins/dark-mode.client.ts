import { defineNuxtPlugin } from '#app'
import { useThemeStore } from '~/stores/theme.store'

export default defineNuxtPlugin(nuxtApp => {
  // Hanya dijalankan di client side
  if (process.client) {
    const themeStore = useThemeStore()
    themeStore.initTheme()
    
    // Menambahkan listener untuk perubahan preferensi sistem
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Hanya ubah tema jika pengguna belum pernah set preferensi manual
      if (localStorage.getItem('darkMode') === null) {
        themeStore.setDarkMode(e.matches)
      }
    })
  }
})