# 域名部署

服务器：`47.93.124.16`  
项目目录：`/var/www/dimingwebsite`

## 当前 IP 访问

官网：http://47.93.124.16  
CMS：http://47.93.124.16:4000/login

`.env`：

```dotenv
WEBSITE_PORT=80
CMS_PORT=4000
CMS_PUBLIC_URL=http://47.93.124.16:4000
```

## 域名解析

完成 ICP 备案后，在 DNS 控制台添加：

| 主机记录 | 类型 | 记录值 |
| --- | --- | --- |
| `@` | A | `47.93.124.16` |
| `cms` | A | `47.93.124.16` |

安全组放行 TCP `80`、`443`。服务器执行：

```bash
firewall-cmd --zone=public --add-service=https
firewall-cmd --permanent --zone=public --add-service=https
```

确认解析生效：

```bash
getent ahostsv4 diming.net.cn
getent ahostsv4 cms.diming.net.cn
```

## 启用 HTTPS 域名访问

项目中的 `Caddyfile` 和 `docker-compose.domain.yml` 已配置官网与 CMS 域名。

```bash
cd /var/www/dimingwebsite
docker compose -f docker-compose.yml -f docker-compose.domain.yml pull caddy
cp -p .env .env.before-domain
```

将 `.env` 更新为：

```dotenv
WEBSITE_PORT=127.0.0.1:3100
CMS_PORT=127.0.0.1:4000
CMS_PUBLIC_URL=https://cms.diming.net.cn
```

启动服务：

```bash
docker compose -f docker-compose.yml -f docker-compose.domain.yml config --quiet
docker compose up -d --no-deps --force-recreate website cms
docker compose -f docker-compose.yml -f docker-compose.domain.yml up -d --no-deps caddy
docker compose -f docker-compose.yml -f docker-compose.domain.yml logs --tail=100 caddy
```

## 验证

```bash
curl -I https://diming.net.cn
curl -fsS https://diming.net.cn/api/articles
curl -I https://cms.diming.net.cn/login
```

- 官网：https://diming.net.cn
- 行业热点：https://diming.net.cn/insights
- CMS：https://cms.diming.net.cn/login

## 后续发布

```bash
cd /var/www/dimingwebsite
docker compose -f docker-compose.yml -f docker-compose.domain.yml up -d --build
```

不要执行 `docker compose down -v`。

## 回退到 IP 访问

```bash
cd /var/www/dimingwebsite
docker compose -f docker-compose.yml -f docker-compose.domain.yml stop caddy
cp -p .env.before-domain .env
docker compose up -d --no-deps --force-recreate website cms
```
