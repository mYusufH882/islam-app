// nuxt.config.ts
export default defineNuxtConfig({
  // Konfigurasi rendering - aktifkan SSR untuk SEO & performa
  ssr: true,

  // Route rules untuk strategi rendering & caching optimal
  routeRules: {
    // Halaman utama dengan SSR + caching
    '/': { 
      ssr: true,
      cache: {
        maxAge: 60 * 10 // Cache 10 menit
      }
    },
    // Halaman Auth tanpa SSR, hanya CSR untuk lebih cepat
    '/auth/**': { 
      ssr: false 
    },
    // Konten statis dengan caching panjang
    '/blog/**': {
      ssr: true,
      cache: {
        maxAge: 60 * 60 // Cache 1 jam
      }
    },
    '/quran/**': { 
      ssr: true,
      cache: {
        maxAge: 60 * 60 * 24 // Cache 24 jam
      }
    }
  },

  experimental: {
    // Aktifkan fitur experimental untuk performa terbaik
    componentIslands: true, // Izinkan component islands untuk CSR/SSR hybrid
    payloadExtraction: true, // Ekstrak payload dari HTML untuk caching yang lebih baik
    renderJsonPayloads: true, // Gunakan JSON payload untuk data rendering yang lebih efisien
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
  ],

  // Konfigurasi untuk @nuxt/image
  // Diletakkan di runtimeConfig.public untuk menghindari error TypeScript
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
      appName: process.env.APP_NAME || 'Pemuda Persis Cimsel',
      
      // Konfigurasi gambar
      imageQuality: 80,
      imageFormats: ['webp'],
      imageDir: 'public/uploads',
    }
  },

  // Konfigurasi build yang dioptimasi
  build: {
    transpile: ['@headlessui/vue'],
  },

  // Optimasi Vite untuk build yang lebih cepat
  vite: {
    // Konfigurasi build yang lebih cepat
    build: {
      target: 'es2020', // Buat bundle yang lebih kecil dengan ES target terbaru
      cssCodeSplit: true, // Split CSS untuk loading optimal
      minify: 'terser', // Gunakan terser untuk minifikasi lebih baik
      rollupOptions: {
        output: {
          // Strategi chunking untuk kode yang lebih efisien
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia', '@vue/shared'],
            'ui-components': ['@headlessui/vue'],
          }
        }
      }
    },
    // Optimalkan asset handling
    assetsInclude: ['**/*.jpg', '**/*.png', '**/*.svg', '**/*.gif', '**/*.woff2'],
    // Optimalkan template compilation
    vue: {
      template: {
        compilerOptions: {
          // Atur opsi compiler Vue yang lebih toleran terhadap kesalahan hydration
          whitespace: 'condense',
          comments: false
        }
      }
    },
    // Aktifkan caching untuk build yang lebih cepat
    optimizeDeps: {
      include: ['vue', 'pinia', '@headlessui/vue'],
      exclude: []
    }
  },

  // Pengaturan CSS dengan preload fonts
  css: [
    '~/assets/css/hydration-fix.css',
    // Tambahkan reset CSS yang minimal
    '~/assets/css/minimal-reset.css',
    '~/assets/css/fonts.css'
  ],

  // Load plugins hanya ketika dibutuhkan
  plugins: [
    '~/plugins/headlessui.ts',
    '~/plugins/auth.ts',
    // Client-side only plugins dengan .client suffix
    '~/plugins/dark-mode.client.ts',
    '~/plugins/fixHydration.client.js',
    '~/plugins/completeHydration.client.js',
    '~/plugins/user-dashboard.client.ts'
  ],

  // Konfigurasi app head dengan preloading & prefetching
  app: {
    head: {
      title: 'Pemuda Persis Cimsel',
      htmlAttrs: {
        lang: 'id'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        // Tambahkan meta tags untuk PWA
        { name: 'theme-color', content: '#2563eb' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
      link: [
        // Preload font utama
        // { 
        //   rel: 'preload', 
        //   href: '/fonts/ScheherazadeNew-Regular.woff2', 
        //   as: 'font',
        //   type: 'font/woff2',
        //   crossorigin: 'anonymous'
        // },
        // Favicon
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    // Matikan transisi halaman untuk mengurangi masalah hydration
    pageTransition: false,
    layoutTransition: false,
    // Aktifkan keepalive untuk caching component instance
    keepalive: {
      exclude: ['index-page', 'dashboard-page']
    }
  },

  // Typescript dengan caching untuk build yang lebih cepat
  typescript: {
    strict: true,
    shim: false, // Nonaktifkan shim untuk build yang lebih cepat 
    typeCheck: false // Jalankan typecheck terpisah untuk build yang lebih cepat
  },

  // Optimasi server Nitro yang aggressive
  nitro: {
    preset: 'node-server',
    minify: true, // Minifikasi output HTML
    compressPublicAssets: {
      brotli: true // Aktifkan kompresi brotli untuk aset statis
    },
    // Strategi caching
    storage: {
      cache: {
        driver: 'memory' // Cache di memory untuk performa optimal
      }
    },
    routeRules: {
      '/**': { swr: false } // Disable SWR untuk mengurangi overhead
    },
    // Optimasi modern output
    esbuild: {
      options: {
        target: 'esnext', // Target esnext untuk bundle yang optimal
        minify: true
      }
    }
  },

  // Konfigurasi khusus untuk modul
  tailwindcss: {
    // Konfigurasi Tailwind CSS (jika perlu)
    viewer: false, // Nonaktifkan viewer untuk produksi
  },

  // Compatibility date untuk fitur terbaru
  compatibilityDate: '2025-05-03'
});