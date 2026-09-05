export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing article slug' })
  }

  try {
    const article = await $fetch(`/api/articles/${encodeURIComponent(slug)}`, {
      baseURL: config.cmsBaseUrl
    })

    return normalizeArticleImages(article, config.public.cmsPublicUrl)
  } catch (error) {
    console.error(`Failed to fetch CMS article "${slug}":`, error)
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }
})

function normalizeArticleImages(article: unknown, cmsPublicUrl: string) {
  if (!article || typeof article !== 'object') return article

  const normalized = article as { content?: string }
  if (normalized.content) {
    const baseUrl = cmsPublicUrl.replace(/\/$/, '')
    normalized.content = normalized.content.replaceAll('src="/uploads/', `src="${baseUrl}/uploads/`)
  }

  return normalized
}
