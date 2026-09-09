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
        {
          rel: 'stylesheet',
          href: '/assets/fonts/google-fonts.css'
        }
      ]
    }
  }
})
