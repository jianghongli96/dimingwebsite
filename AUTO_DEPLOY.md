# GitHub Actions 自动部署

## 工作流

| 工作流 | 文件 | 自动触发分支 | GitHub Environment |
| --- | --- | --- | --- |
| 测试环境 | `.github/workflows/deploy.yml` | `dev` | 无 |
| 生产环境 | `.github/workflows/deploy-production.yml` | `staging` | `production` |

两个工作流均支持在 GitHub 的 **Actions** 页面手动点击 **Run workflow** 触发。

部署时会上传代码包到服务器，保留服务器已有的 `.env`、CMS 数据库和上传文件，然后执行：

```bash
docker compose up -d --build
```

服务器必须预先创建：

```txt
/var/www/dimingwebsite/.env
```

## 生产环境配置

在 GitHub 仓库设置生产环境：

```txt
Settings -> Environments -> New environment -> production
```

在 **Settings -> Secrets and variables -> Actions** 中添加：

| 类型 | 名称 | 值 |
| --- | --- | --- |
| Secret | `DIMING_SSH_KEY` | 用于登录生产服务器的 SSH 私钥全文 |
| Variable | `DIMING_HOST` | `47.93.124.16` |
| Variable | `DIMING_USER` | `root` |
| Variable | `DIMING_PORT` | `22`，可省略 |

`DIMING_SSH_KEY` 示例：

```txt
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

生产服务器 `.env` 示例：

```dotenv
CMS_ADMIN_USER=admin
CMS_ADMIN_PASSWORD=替换成强密码
CMS_SESSION_SECRET=替换成随机长字符串
CMS_PUBLIC_URL=http://47.93.124.16:4000
WEBSITE_PORT=80
CMS_PORT=4000
```

## 测试环境配置

测试环境工作流使用以下 GitHub Secrets：

```txt
ALIYUN_HOST
ALIYUN_USER
ALIYUN_PORT
ALIYUN_SSH_KEY
```

## 发布生产环境

将准备发布的代码合并或推送到 `staging` 分支。GitHub Actions 会运行 **Deploy to Production**。

部署完成后，访问：

```txt
官网：http://47.93.124.16
CMS：http://47.93.124.16:4000/login
```

在 Actions 日志中确认最后的 `docker compose ps` 步骤显示 `website` 和 `cms` 均为运行状态。
