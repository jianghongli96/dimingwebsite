<script setup lang="ts">
type Article = {
  id: number
  title: string
  slug: string
  summary: string
  category: string
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  content: string
  status: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const config = useRuntimeConfig()

const { data: article } = await useFetch<Article>(() => `/api/articles/${slug.value}`)
const articleContent = computed(() => resolveArticleAssetUrls(article.value?.content || ''))

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

useHead(() => ({
  title: article.value?.seoTitle || article.value?.title || '行业热点 - 镝鸣科技 DIMING',
  meta: [
    {
      name: 'description',
      content: article.value?.seoDescription || article.value?.summary || '镝鸣科技行业热点文章。'
    },
    {
      property: 'og:title',
      content: article.value?.seoTitle || article.value?.title || '行业热点 - 镝鸣科技 DIMING'
    },
    {
      property: 'og:description',
      content: article.value?.seoDescription || article.value?.summary || '镝鸣科技行业热点文章。'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    }
  ]
}))

function resolveArticleAssetUrls(content: string) {
  const cmsPublicUrl = config.public.cmsPublicUrl.replace(/\/+$/, '')
  return content.replace(/(<img[^>]+src=["'])\/uploads\//gi, `$1${cmsPublicUrl}/uploads/`)
}
</script>

<template>
  <main class="page-shell">
    <section class="article-page">
      <article class="container article-content glass-card">
        <NuxtLink class="back-link" to="/insights">
          <span class="material-symbols-outlined">arrow_back</span>
          返回行业热点
        </NuxtLink>

        <header class="article-header">
          <div class="article-meta article-meta--hero">
            <span>{{ article.category }}</span>
            <time>{{ article.publishedAt?.slice(0, 10) || article.createdAt.slice(0, 10) }}</time>
          </div>
          <h1>{{ article.title }}</h1>
          <p>{{ article.summary }}</p>
        </header>

        <div class="article-body">
          <div class="article-richtext" v-html="articleContent"></div>
        </div>
      </article>
    </section>
  </main>
</template>
