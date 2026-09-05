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
  content?: string
  status: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

const { data: articles } = await useFetch<Article[]>('/api/articles', {
  default: () => []
})

const activeSlug = ref(articles.value[0]?.slug || '')

const { data: activeArticle } = await useFetch<Article | null>(
  () => (activeSlug.value ? `/api/articles/${activeSlug.value}` : null),
  {
    watch: [activeSlug],
    default: () => null
  }
)

const config = useRuntimeConfig()
const activeContent = computed(() => resolveArticleAssetUrls(activeArticle.value?.content || ''))

function formatDate(article: Article) {
  return (article.publishedAt || article.createdAt || '').slice(0, 10)
}

function resolveArticleAssetUrls(content: string) {
  const cmsPublicUrl = config.public.cmsPublicUrl.replace(/\/+$/, '')
  return content.replace(/(<img[^>]+src=["'])\/uploads\//gi, `$1${cmsPublicUrl}/uploads/`)
}

useHead({
  title: '行业热点 - 镝鸣科技 DIMING',
  meta: [
    {
      name: 'description',
      content: '镝鸣科技行业热点栏目，分享半导体、人工智能、新能源及工业智能领域的技术趋势和行业资讯。'
    }
  ]
})
</script>

<template>
  <main class="page-shell">
    <section class="insights-hero chip-section">
      <div class="container">
        <h1>行业热点</h1>
        <p>洞察半导体与 AI 行业前沿趋势，分享镝鸣科技最新动态。</p>
      </div>
    </section>

    <section class="insights-board">
      <div class="container">
        <div v-if="articles.length && activeArticle" class="insight-layout">
          <div class="insight-main">
            <article class="article-detail">
              <div class="article-meta">
                <span>{{ activeArticle.category }}</span>
                <time>{{ formatDate(activeArticle) }}</time>
              </div>
              <h2>{{ activeArticle.title }}</h2>
              <div class="article-preview" v-html="activeContent"></div>
              <NuxtLink class="read-more-link" :to="`/insights/${activeArticle.slug}`">
                查看独立文章页
                <span class="material-symbols-outlined">arrow_forward</span>
              </NuxtLink>
            </article>
          </div>

          <aside class="insight-side">
            <h2><span class="material-symbols-outlined">list_alt</span>行业资讯</h2>
            <div class="article-list">
              <button
                v-for="article in articles"
                :key="article.id"
                class="article-card glass-card"
                :class="{ active: activeSlug === article.slug }"
                type="button"
                @click="activeSlug = article.slug"
              >
                <div class="article-card__meta">
                  <span>{{ article.category }}</span>
                  <time>{{ formatDate(article) }}</time>
                </div>
                <h3>{{ article.title }}</h3>
                <p>{{ article.summary }}</p>
              </button>
            </div>
          </aside>
        </div>

        <div v-else class="empty-article glass-card">
          <h2>暂无已发布文章</h2>
        </div>
      </div>
    </section>
  </main>
</template>
