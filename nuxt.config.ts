export default defineNuxtConfig({
  ssr: true,
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
      appName: process.env.APP_NAME || 'Pemuda Persis Cimsel',
    }
  },
  build: {
    transpile: ['@headlessui/vue']
  },
  plugins: [
    '~/plugins/headlessui.ts',
    '~/plugins/auth.ts'
  ],
  app: {
    head: {
      title: 'Pemuda Persis Cimsel',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  typescript: {
    strict: true
  }
})