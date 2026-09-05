# 镝鸣科技官网

Nuxt 4 + Vue 3 官网项目。

## 启动开发环境

先启动 CMS：

```bash
cd /Users/honglijiang/Desktop/project/dimingwebsite/CMS
npm run dev
```

再启动官网：

```bash
cd /Users/honglijiang/Desktop/project/dimingwebsite/website
npm run dev
```

默认情况下：

```txt
CMS: http://localhost:4000
官网: http://localhost:3000
```

如果端口被占用，Nuxt 会自动换到下一个可用端口。

## CMS 接口配置

本地默认连接：

```txt
NUXT_CMS_BASE_URL=http://127.0.0.1:4000
NUXT_PUBLIC_CMS_PUBLIC_URL=http://127.0.0.1:4000
```

生产环境需要把它们换成真实后台地址，例如：

```txt
NUXT_CMS_BASE_URL=https://api.example.com
NUXT_PUBLIC_CMS_PUBLIC_URL=https://api.example.com
```

## 页面

- `/`
- `/about`
- `/services`
- `/insights`
- `/insights/[slug]`

`/insights` 和 `/insights/[slug]` 会通过 Nuxt server API 从 CMS 获取已发布文章。

## 构建

```bash
npm run build
```

本项目使用 Nuxt 4.5.x，建议 Node 22+。
