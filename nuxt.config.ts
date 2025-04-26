export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
      appName: process.env.APP_NAME || 'Yusuf Code App',
    }
  },
  build: {
    transpile: ['@headlessui/vue']
  },
  // Opsional: menambahkan plugins untuk auto-import komponen Headless UI
  plugins: [
    '~/plugins/headlessui.ts',
    '@pinia/nuxt'
  ]
})
