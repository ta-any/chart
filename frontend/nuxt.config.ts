// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'APP', // Замените на нужный вам заголовок
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: []
    }
  },
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true
      }
    }
  }

})
