# ShareMDC 开发环境部署状态

## 部署信息

- **应用名称**: sharemdc
- **环境**: 开发环境
- **端口**: 3003
- **PM2 状态**: 在线运行
- **Nginx 配置**: 已配置 HTTP
- **SSL 方案**: Cloudflare Flexible SSL

## PM2 配置

```javascript
{
  name: 'sharemdc',
  script: './server.js',
  cwd: '/root/project/sharemdc',
  instances: 1,
  autorestart: true,
  watch: false,
  max_memory_restart: '500M',
  env: {
    NODE_ENV: 'development',
    PORT: 3003
  }
}
```

## Nginx 配置

服务器使用 HTTP (端口 80)，Cloudflare 处理 HTTPS 终止。

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name dev.sharemdc.com;

    location / {
        proxy_pass http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

## Cloudflare 配置

### 1. DNS 设置
- **域名**: `dev.sharemdc.com`
- **代理状态**: 已启用（橙色云朵）
- **记录类型**: A 或 CNAME

### 2. SSL/TLS 设置
- **加密模式**: **Flexible**（重要！）
  - Flexible: 用户 → Cloudflare (HTTPS) → 服务器 (HTTP)
  - 服务器只需要 HTTP，Cloudflare 处理 HTTPS

### 3. 其他推荐设置
- **Always Use HTTPS**: 开启（强制 HTTPS）
- **Automatic HTTPS Rewrites**: 开启
- **Browser Cache TTL**: 根据需求设置（建议 2 小时）

## 访问方式

- 开发环境：https://dev.sharemdc.com
- 生产环境：https://md.bookcell.org

## 相关配置文件

- **PM2 配置**: `/root/project/sharemdc/ecosystem.config.js`
- **Nginx 配置**: `/etc/nginx/sites-available/dev.sharemdc.com.conf`
- **Nginx 链接**: `/etc/nginx/sites-enabled/dev.sharemdc.com.conf`

## PM2 常用命令

```bash
# 查看状态
pm2 list

# 查看日志
pm2 logs sharemdc

# 重启服务
pm2 restart sharemdc

# 停止服务
pm2 stop sharemdc

# 更新环境变量
pm2 restart sharemdc --update-env
```

## 维护说明

- 无需手动申请 SSL 证书
- Cloudflare 自动处理证书更新
- Nginx 使用 HTTP，Cloudflare 终止 HTTPS
- 如需重启，直接重启 PM2 服务即可
