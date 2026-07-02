// nuxt.config.ts
export default defineNuxtConfig({
  // ... your existing settings (like vuetify module configs)

  vue: {
    compilerOptions: {
      // Directs Vue to ignore the 3D element tag errors
      isCustomElement: (tag) => tag === 'model-viewer'
    }
  }
})