<script setup>
import { metrics, sectorCards, values } from '~/data/content'

useHead({
  title: '关于我们 - 上海镝鸣信息科技 DIMING',
  meta: [
    {
      name: 'description',
      content: '了解上海镝鸣信息科技有限公司，企业坐落于上海临港新片区，专注半导体、人工智能及新能源领域技术服务。'
    }
  ]
})
</script>

<template>
  <main class="page-shell">
    <section class="about-hero about-hero--image">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV0NBXyIcU-FJbUxHezeFKVkEocrQPFUq1mQ2q1v5pAOQg0EvVQxL81dD2W953Lp5tppTorhpxuPcrP80uv_VjZZqZbKXzTY4ZSaByxMKRQAwabEardLozECTaYAXw42mpUcq74MW5htPVpXeFolMTwTyNSNvVLIIlDQYY0HXE7K_6SqrrbKPosK6loKPJZQEPs0py6-QiWwwEpKSGyz2hVEKJUR5QJ3CCj-na_T1v-97m57-143bVDPg_laTuBIMH7eCqDHmmUHV0"
        alt=""
      />
      <div class="about-hero__overlay"></div>
      <div class="container">
        <div class="eyebrow eyebrow--dark"><span class="material-symbols-outlined">location_on</span>关于我们</div>
        <h1>扎根临港，赋能未来智能产业</h1>
        <p>上海镝鸣信息科技致力于将最前沿的 AI 技术与精密工业制造深度融合，在临港这片创新热土上书写工业智能的新篇章。</p>
      </div>
    </section>

    <section class="about">
      <div class="container two-column">
        <div class="image-stack">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSNwvBuU5u9oqYyZVZCKfmCWpmBzJq_82fwutkEXKZjjffnNIqw1gOP_Adynp7eJwSoh01wCNvawKUuxyMrFE5tXHoa1PaGIrlqX0q3LP9PNRJZmeezZMLnIZod8bWPATlGlkzozfZqyJGGOa_gPKQmJsfDtT0zqFckUNLZWJWCT07S4QzPJgVMCin2Z4trbR3ljjeYXeHqvuaCgENt0u4kaPj9oyR-BOBsc96J_BH-Rtt25Dr0e4LKiWCSX5j-71L1bOMLSeYKNB-"
            alt="芯片与电路研发场景"
          />
          <div class="location-card glass-card">
            <h3>坐标：上海 · 临港</h3>
            <p>企业坐落于中国（上海）自由贸易试验区临港新片区，在产业链配套与政策优势中深耕核心技术。</p>
          </div>
        </div>

        <div class="section-copy">
          <div class="eyebrow"><span></span>企业简介</div>
          <h2>上海镝鸣信息科技：临港科创之星</h2>
          <p>
            镝鸣信息科技是一家专注于核心工业软件与高精尖技术方案的高新技术服务机构。我们致力于打破技术壁垒，
            在半导体制造工艺咨询、人工智能算法服务、新能源控制系统优化等关键领域提供深度技术支撑。
          </p>
          <div class="metrics">
            <div v-for="metric in metrics" :key="metric.label" class="metric-card">
              <strong>{{ metric.value }}</strong>
              <span>{{ metric.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="values">
      <div class="container">
        <div class="section-heading">
          <h2>核心价值观</h2>
          <p>驱动工业革命，引领高质量发展</p>
        </div>
        <div class="value-grid">
          <article v-for="value in values" :key="value.title" class="value-card glass-card">
            <span class="material-symbols-outlined">{{ value.icon }}</span>
            <h3>{{ value.title }}</h3>
            <p>{{ value.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="sectors">
      <div class="container">
        <div class="section-heading section-heading--left">
          <div class="eyebrow"><span></span>业务领域</div>
          <h2>围绕核心产业构建技术服务能力</h2>
        </div>
        <div class="sector-grid">
          <article v-for="sector in sectorCards" :key="sector.title" class="sector-card">
            <img :src="sector.image" :alt="sector.title" />
            <div>
              <h3>{{ sector.title }}</h3>
              <p>{{ sector.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
