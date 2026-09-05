<script setup>
const navItems = [
  { label: '首页', to: '/' },
  { label: '关于我们', to: '/about' },
  { label: '业务领域', to: '/services' },
  { label: '行业热点', to: '/insights' }
]

const mobileMenuOpen = ref(false)
</script>

<template>
  <header class="topbar">
    <div class="topbar__inner">
      <NuxtLink class="brand" to="/" @click="mobileMenuOpen = false">
        <span class="brand__mark">D</span>
        <span>镝鸣科技 DIMING</span>
      </NuxtLink>

      <nav class="nav">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <button class="icon-button" type="button" aria-label="打开导航" @click="mobileMenuOpen = !mobileMenuOpen">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>

    <div v-if="mobileMenuOpen" class="mobile-nav">
      <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" @click="mobileMenuOpen = false">
        {{ item.label }}
      </NuxtLink>
    </div>
  </header>

  <NuxtPage />

  <footer class="footer">
    <div class="container footer__grid">
      <div>
        <strong>镝鸣科技 DIMING</strong>
        <p>深耕半导体与人工智能领域，致力于核心技术研发咨询与高端方案配套，助力行业高质量发展。</p>
      </div>
      <nav>
        <h3>快速链接</h3>
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
      </nav>
      <div>
        <h3>联系我们</h3>
        <p><span class="material-symbols-outlined">mail</span>business@diming-tech.com</p>
        <p><span class="material-symbols-outlined">location_on</span>上海市浦东新区临港新片区</p>
      </div>
    </div>
    <div class="container footer__bottom">© 2024 上海镝鸣信息科技有限公司 版权所有 | 沪ICP备XXXXXXXX号</div>
  </footer>
</template>
