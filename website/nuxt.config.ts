export default defineNuxtConfig({
  compatibilityDate: '2026-09-04',
  css: ['~/assets/css/styles.css'],
  runtimeConfig: {
    cmsBaseUrl: process.env.NUXT_CMS_BASE_URL || 'http://127.0.0.1:4000',
    public: {
      cmsPublicUrl: process.env.NUXT_PUBLIC_CMS_PUBLIC_URL || process.env.NUXT_CMS_BASE_URL || 'http://127.0.0.1:4000'
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN'
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: '上海镝鸣信息科技 DIMING，专注半导体、人工智能与新能源领域的技术研发、方案咨询和产品配套服务。'
        }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
        }
      ]
    }
  }
})
