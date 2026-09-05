export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  try {
    return await $fetch('/api/articles', {
      baseURL: config.cmsBaseUrl
    })
  } catch (error) {
    console.error('Failed to fetch CMS articles:', error)
    return []
  }
})
