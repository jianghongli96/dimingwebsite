# 镝鸣科技 CMS

这是给官网“行业热点”使用的轻量文章后台。

## 功能

- 管理员登录后才能进入后台
- SQLite 本地数据库
- 内置管理员账号
- 文章新增、编辑、删除、发布、下架
- URL 标识由系统保存时自动生成，并自动处理重复
- 文章列表、创建文章、编辑文章为独立页面
- 富文本编辑器支持正文内插入多张图片
- 提供公开文章接口，方便 Nuxt 前台做 SSR/SEO

## 启动

```bash
npm run dev
```

默认地址：

```txt
http://localhost:4000/login
```

后台页面：

```txt
/admin
/admin/articles/new
/admin/articles/:id/edit
```

## 默认管理员

```txt
用户名：admin
密码：Diming@2026
```

生产环境建议通过环境变量覆盖默认密码：

```bash
CMS_ADMIN_PASSWORD='your-strong-password' npm start
```

## 生产环境持久化目录

默认情况下，SQLite 数据库和上传图片会保存在 CMS 项目目录内：

```txt
CMS/data/cms.sqlite
CMS/uploads/
```

生产环境建议把它们放到发布目录之外，避免重新部署时被覆盖。CMS 支持通过环境变量指定持久化目录：

```bash
CMS_DATA_DIR=/var/lib/diming-cms/data \
CMS_UPLOAD_DIR=/var/lib/diming-cms/uploads \
CMS_ADMIN_PASSWORD='your-strong-password' \
npm start
```

首次部署可以先创建目录并设置权限：

```bash
sudo mkdir -p /var/lib/diming-cms/data /var/lib/diming-cms/uploads
sudo chown -R www-data:www-data /var/lib/diming-cms
```

如果你的 Node 服务不是用 `www-data` 用户运行，把上面的 `www-data:www-data` 换成实际运行用户。

PM2 示例：

```bash
cd /var/www/dimingwebsite/CMS
CMS_DATA_DIR=/var/lib/diming-cms/data \
CMS_UPLOAD_DIR=/var/lib/diming-cms/uploads \
CMS_ADMIN_PASSWORD='your-strong-password' \
pm2 start npm --name diming-cms -- start
```

Docker 示例：

```bash
docker run -d \
  --name diming-cms \
  -p 4000:4000 \
  -e CMS_DATA_DIR=/data \
  -e CMS_UPLOAD_DIR=/uploads \
  -e CMS_ADMIN_PASSWORD='your-strong-password' \
  -v /var/lib/diming-cms/data:/data \
  -v /var/lib/diming-cms/uploads:/uploads \
  diming-cms
```

## 公开接口

```txt
GET /api/articles
GET /api/articles/:slug
GET /uploads/文件名
```

只有 `published` 状态的文章会通过公开接口返回。

## 文章字段

- 标题
- URL 标识 slug：系统自动生成，不需要管理员填写
- 摘要
- 分类
- 标签
- SEO 标题
- SEO 描述
- 正文 HTML
- 状态：草稿 / 已发布
