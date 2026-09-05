# GitHub Actions 自动部署

当前项目可以用 GitHub Actions 自动部署到阿里云服务器。流程是：

1. push 到 `main` 分支。
2. GitHub Actions 打包当前代码。
3. 通过 SSH 上传到服务器 `/tmp/dimingwebsite-deploy.tar.gz`。
4. 解压到 `/var/www/dimingwebsite`。
5. 执行 `docker compose up -d --build`。

服务器上的 `.env` 不会被覆盖，需要提前保存在：

```txt
/var/www/dimingwebsite/.env
```

测试环境示例：

```bash
CMS_ADMIN_USER=admin
CMS_ADMIN_PASSWORD=Diming@2026
CMS_SESSION_SECRET=替换成随机长字符串
CMS_PUBLIC_URL=http://47.100.77.39:4000
WEBSITE_PORT=3100
CMS_PORT=4000
```

## GitHub Secrets

在 GitHub 仓库打开：

```txt
Settings -> Secrets and variables -> Actions -> New repository secret
```

添加：

```txt
ALIYUN_HOST=47.100.77.39
ALIYUN_USER=root
ALIYUN_PORT=22
ALIYUN_SSH_KEY=用于 ssh aliyun 的私钥内容
```

`ALIYUN_SSH_KEY` 必须是私钥全文，例如：

```txt
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

## 手动触发

除了 push 到 `main` 自动部署，也可以在 GitHub：

```txt
Actions -> Deploy to Aliyun -> Run workflow
```

手动触发部署。

## 访问地址

```txt
官网：http://47.100.77.39:3100
CMS：http://47.100.77.39:4000/login
```
