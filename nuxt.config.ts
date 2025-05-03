// nuxt.config.ts
export default defineNuxtConfig({
  // Konfigurasi rendering
  ssr: true,

  routeRules: {
    '/': { ssr: true },
    '/auth/**': { ssr: false }, // Matikan SSR untuk semua halaman auth
  },

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

  css: [
    '~/assets/css/hydration-fix.css'
  ],

  plugins: [
    '~/plugins/headlessui.ts',
    '~/plugins/auth.ts',
    '~/plugins/dark-mode.client.ts',
    '~/plugins/fixHydration.client.js',
    '~/plugins/completeHydration.client.js'
  ],

  app: {
    head: {
      title: 'Pemuda Persis Cimsel',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    },
    // Atur mode transisi halaman untuk membantu dengan hydration
    pageTransition: false,
    layoutTransition: false
  },

  typescript: {
    strict: true
  },

  // Setelan eksperimental untuk membantu mengatasi masalah hydration
  vite: {
    assetsInclude: ['**/*.jpg', '**/*.png', '**/*.svg', '**/*.gif'],
    vue: {
      template: {
        compilerOptions: {
          // Opsi ini membuat Vue lebih toleran terhadap kesalahan hydration
          whitespace: 'preserve'
        }
      }
    }
  },

  // Nonaktifkan optimasi pencetak hidrogen yang mungkin menyebabkan masalah
  nitro: {
    preset: 'node-server',
    routeRules: {
      '/**': { swr: false }
    }
  },

  compatibilityDate: '2025-05-03'
})