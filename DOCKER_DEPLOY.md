# Docker 部署说明

本项目包含两个服务：

- `cms`：CMS 后台与文章接口，默认端口 `4000`
- `website`：Nuxt 官网，默认端口 `3000`

CMS 的数据库和图片通过 Docker volume 持久化：

- `cms-data` 挂载到容器内 `/data`
- `cms-uploads` 挂载到容器内 `/uploads`

## 本地启动

在项目根目录执行：

```bash
docker compose up -d --build
```

访问地址：

```txt
官网：http://localhost:3000
CMS：http://localhost:4000/login
```

查看日志：

```bash
docker compose logs -f
```

停止服务：

```bash
docker compose down
```

只停止容器不会删除文章和图片；数据保存在 Docker volumes 里。

## 生产环境变量

生产环境建议创建 `.env` 文件：

```bash
CMS_ADMIN_USER=admin
CMS_ADMIN_PASSWORD=替换成强密码
CMS_SESSION_SECRET=替换成随机长字符串
CMS_PUBLIC_URL=https://你的CMS域名
WEBSITE_PORT=3000
CMS_PORT=4000
```

然后启动：

```bash
docker compose up -d --build
```

`CMS_PUBLIC_URL` 很重要。官网正文图片会把 `/uploads/...` 转成这个地址，例如：

```txt
https://你的CMS域名/uploads/xxx.webp
```

## 使用宿主机目录持久化

如果你希望数据直接保存在服务器目录，而不是 Docker volume，可以把 `docker-compose.yml` 中的 volumes 改成：

```yaml
services:
  cms:
    volumes:
      - /var/lib/diming-cms/data:/data
      - /var/lib/diming-cms/uploads:/uploads
```

首次部署先创建目录：

```bash
sudo mkdir -p /var/lib/diming-cms/data /var/lib/diming-cms/uploads
```

如果容器内使用 root 运行，通常不需要额外改权限；如果后续改成非 root 用户运行，需要把目录授权给对应 UID。

## 反向代理建议

正式上线时通常用 Nginx/Caddy 做反向代理：

```txt
https://你的官网域名 -> website:3000
https://你的CMS域名 -> cms:4000
```

如果只想暴露一个域名，也可以把 `/api/articles` 和 `/uploads` 代理到 CMS，把其他页面代理到 website。
