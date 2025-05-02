import { defineStore } from 'pinia';

interface ThemeState {
  darkMode: boolean;
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    darkMode: false
  }),
  
  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      this.updateDocumentClass();
      this.savePreference();
    },
    
    setDarkMode(value: boolean) {
      this.darkMode = value;
      this.updateDocumentClass();
      this.savePreference();
    },
    
    updateDocumentClass() {
      if (this.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    
    savePreference() {
      if (process.client) {
        localStorage.setItem('darkMode', this.darkMode ? 'true' : 'false');
      }
    },
    
    initTheme() {
      if (process.client) {
        // Cek localStorage dulu
        const storedPreference = localStorage.getItem('darkMode');
        
        if (storedPreference !== null) {
          this.darkMode = storedPreference === 'true';
        } else {
          // Jika tidak ada di localStorage, cek preferensi sistem
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          this.darkMode = prefersDark;
        }
        
        this.updateDocumentClass();
      }
    }
  }
});