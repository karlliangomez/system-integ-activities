import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    plugins: [
      vuetify({ autoImport: true }),
    ],
    vue: {
      template: {
        transformAssetUrls,
        // Directs Vue to ignore the 3D element tag errors
        compilerOptions: {
          isCustomElement: (tag) => tag === 'model-viewer'
        }
      },
    },
  },

  css: [
    'leaflet/dist/leaflet.css'
  ],
  
  runtimeConfig: {
    public: {
      //@ts-ignore
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID
      
    }
  }
})
