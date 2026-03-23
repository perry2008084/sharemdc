# Cloudflare 配置指南 - dev.sharemdc.com

## 快速设置步骤

### 1. DNS 设置
- 登录 Cloudflare
- 找到 `dev.sharemdc.com` 的 DNS 记录
- 确保代理状态为 **已启用（橙色云朵）**

### 2. SSL/TLS 设置
进入 **SSL/TLS** → **Overview**，设置：
- **加密模式**: 选择 **Flexible**
  - Flexible: 用户 → Cloudflare (HTTPS) → 服务器 (HTTP)
  - 服务器端只需要 HTTP，Cloudflare 处理 HTTPS 终止

### 3. 推荐设置
进入 **SSL/TLS** → **Edge Certificates**：
- ✅ **Always Use HTTPS**：开启（强制 HTTPS）
- ✅ **Automatic HTTPS Rewrites**：开启

### 4. Page Rules (可选)
如果需要重定向或自定义规则：
- 进入 **Rules** → **Page Rules**
- 添加需要的规则

## 验证设置

1. **检查 SSL 模式**:
   - 访问 Cloudflare SSL/TLS 页面
   - 确认模式为 "Flexible"

2. **测试 HTTPS 访问**:
   - 浏览器访问: https://dev.sharemdc.com
   - 应该看到证书由 Cloudflare 签发

3. **检查服务器响应**:
   - 服务器端保持 HTTP (127.0.0.1:3003)
   - Cloudflare 处理所有 HTTPS 流量

## 工作原理

```
用户浏览器
  ↓ HTTPS
Cloudflare (Orange Cloud)
  ↓ HTTP
Nginx (127.0.0.1:80)
  ↓
Node.js (127.0.0.1:3003)
```

## 注意事项

- 服务器端保持 HTTP，不需要配置 SSL 证书
- Cloudflare 提供免费 SSL 证书
- 证书自动续期，无需维护
- 确保只对 `dev.sharemdc.com` 使用 Flexible 模式
- 其他域名（如 md.bookcell.org）应保持 Full (Strict) 模式
