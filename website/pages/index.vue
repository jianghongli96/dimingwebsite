<script setup>
useHead({
  title: '镝鸣科技 DIMING - 芯启未来 智创半导体新生态',
  meta: [
    {
      name: 'description',
      content: '上海镝鸣信息科技以前瞻技术驱动半导体、人工智能与新能源产业革新，提供技术研发、方案咨询、产品配套一体化服务。'
    }
  ]
})
</script>

<template>
  <main>
    <section class="hero">
      <div class="hero__media" aria-hidden="true">
        <img
          src="/assets/images/image-01-cd5d3f6df5.png"
          alt=""
        />
        <div class="hero__overlay"></div>
        <div class="chip-pattern"></div>
      </div>

      <div class="container hero__content">
        <div class="eyebrow eyebrow--dark">
          <span class="material-symbols-outlined">verified_user</span>
          Industrial Intelligence Solutions
        </div>
        <h1>芯启未来<br /><span>技术研发、方案咨询、产品配套一体化服务</span></h1>
        <p>
          匠心研芯，聚力同行。上海镝鸣信息科技以前瞻技术驱动半导体、人工智能与新能源产业革新，
          提供全栈式高技术服务与系统解决方案。
        </p>
        <div class="hero__actions">
          <NuxtLink class="button button--primary" to="/services">
            探索业务领域
            <span class="material-symbols-outlined">arrow_forward</span>
          </NuxtLink>
          <NuxtLink class="button button--ghost" to="/about">了解详情</NuxtLink>
        </div>
      </div>

      <aside class="signal-panel">
        <span class="material-symbols-outlined">memory</span>
        <div>
          <strong>100+</strong>
          <small>核心技术方案沉淀</small>
        </div>
      </aside>
    </section>

    <section class="home-about">
      <div class="container two-column">
        <div class="image-stack">
          <img
            src="/assets/images/image-02-8e064291c2.png"
            alt="上海临港创新中心"
          />
          <div class="location-card glass-card">
            <h3>坐标：上海 · 临港</h3>
            <p>扎根临港科创高地，面向半导体、人工智能与新能源产业提供工程化技术支撑。</p>
          </div>
        </div>

        <div class="section-copy">
          <div class="eyebrow"><span></span>关于镝鸣科技</div>
          <h2>以前瞻技术驱动产业革新</h2>
          <p>
            镝鸣信息科技是一家专注于核心工业软件与高精尖技术方案的技术服务机构，
            在半导体制造工艺咨询、人工智能算法服务、新能源控制系统优化等关键领域提供深度支撑。
          </p>
          <div class="feature-pair">
            <article>
              <span class="material-symbols-outlined">developer_board</span>
              <h3>半导体核心咨询</h3>
              <p>提供芯片设计流程优化与制造工艺技术指导，助力产业效能提升。</p>
            </article>
            <article>
              <span class="material-symbols-outlined">psychology</span>
              <h3>人工智能方案</h3>
              <p>定制工业级 AI 算法服务，实现预测性维护分析与生产智控咨询。</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-services">
      <div class="container">
        <div class="section-heading">
          <h2>技术研发、方案咨询、产品配套一体化服务</h2>
          <p>从技术研发到商业落地的全方位支持，助力企业在工业 4.0 时代实现质的飞跃。</p>
        </div>

        <div class="service-layout service-layout--home">
          <article class="service-feature glass-card">
            <span class="tag">核心业务</span>
            <h3>全流程技术研发与攻关</h3>
            <p>提供定制化半导体设备软件方案、工业自动化系统架构设计及新能源控制逻辑研发咨询服务。</p>
            <ul>
              <li><span class="material-symbols-outlined">check_circle</span>高性能工业软件架构设计</li>
              <li><span class="material-symbols-outlined">check_circle</span>异构计算平台算法优化</li>
              <li><span class="material-symbols-outlined">check_circle</span>实时控制系统国产化替代</li>
            </ul>
          </article>

          <article class="service-card">
            <span class="material-symbols-outlined">forum</span>
            <h3>技术咨询与指导</h3>
            <p>针对半导体及 AI 领域复杂工艺痛点，提供资深专家级技术路线规划与顾问服务。</p>
          </article>

          <article class="service-card">
            <span class="material-symbols-outlined">hub</span>
            <h3>精密产品适配</h3>
            <p>依托深厚行业资源，为客户提供精准的核心电子元器件选型建议与高端设备配套技术支撑。</p>
          </article>
        </div>
      </div>
    </section>

    <!-- <section class="banner">
      <div class="container banner__inner">
        <div>
          <h2>立足临港科创高地</h2>
          <p>Shanghai Lin-gang Special Area · High-Tech Hub</p>
        </div>
        <strong>以创新引领突破，以专业铸就价值</strong>
      </div>
    </section> -->
  </main>
</template>
