# ShareMDC

**Share AI content and Markdown with one click.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-22.22.0-green.svg)
![Express](https://img.shields.io/badge/express-5.2.1-lightgrey.svg)

## ✨ Features

### 🎨 Editor Features
- **Real-time Preview** - See your Markdown rendered instantly as you type
- **One-Click Sharing** - Generate short links and share content effortlessly
- **Content Persistence** - SQLite database stores your content for later access

### 🌟 User Experience
- **Responsive Design** - Perfectly adapted for desktop and mobile devices
- **Dark Mode** - Toggle between light and dark themes with one click
- **Touch Optimized** - Double-tap preview area to zoom in/out
- **Social Sharing** - Share to WeChat, QQ, Weibo, and Twitter with one click

### 🔒 Security
- **XSS Protection** - DOMPurify sanitizes all HTML output
- **Input Validation** - Strict content validation

## 🌐 Live Demo

Try ShareMDC at: **https://www.sharemdc.com**

## 📸 Preview

### Editor Page
- Left side: Markdown editing area
- Right side: Real-time preview
- Top: Share button

### Share Page
- Rendered Markdown content
- Share timestamp
- Social media sharing buttons

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0
- npm >= 9.0

### Installation

```bash
# Clone the repository
git clone https://github.com/perry2008084/sharemdc.git
cd sharemdc

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Configuration

```bash
# Set port (default: 3000)
export PORT=8080

# Set database path (default: ./data/share.db)
export DB_PATH=/path/to/database.db

# Set Microsoft Clarity ID for analytics (optional)
# If not set, Clarity will be disabled
export CLARITY_ID=your_clarity_project_id
```

## 🚢 Self-Hosting / Deployment

ShareMDC is open source (MIT licensed) and can be self-hosted on any Node.js-compatible platform.

### Quick Deploy with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the service
pm2 start server.js --name sharemdc

# Set up auto-restart on system boot
pm2 startup
pm2 save
```

### Deploy with Docker

```bash
# Build the image
docker build -t sharemdc .

# Run the container
docker run -p 3000:3000 -v ./data:/app/data sharemdc
```

### Deploy with Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### HTTPS Configuration (Recommended)

For production, use Nginx with Let's Encrypt:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

## 📁 Project Structure

```
sharemdc/
├── public/              # Static files
│   ├── index.html       # Editor page
│   ├── share.html       # Share page
│   ├── app.js          # Editor scripts
│   ├── share.js        # Share page scripts
│   └── styles.css      # Stylesheet
├── data/               # Database directory
│   └── share.db       # SQLite database
├── server.js           # Express server
├── package.json        # Project configuration
├── .gitignore         # Git ignore rules
├── design.md          # Design documentation
├── usage.md           # Usage guide
└── LICENSE            # MIT License
```

## 🔌 API Reference

### POST /api/share
Generate a share link

**Request:**
```json
{
  "content": "# Hello World\n\nThis is a test."
}
```

**Response:**
```json
{
  "id": "abc123xyz",
  "url": "/s/abc123xyz"
}
```

### POST /api/preview
Preview Markdown content

**Request:**
```json
{
  "content": "# Hello World"
}
```

**Response:**
```json
{
  "html": "<h1>Hello World</h1>"
}
```

### GET /api/share/:id
Retrieve shared content

**Response:**
```json
{
  "content": "# Hello World",
  "createdAt": 1739918400000
}
```

### GET /health
Health check

**Response:**
```json
{
  "ok": true
}
```

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 22.22.0 | Runtime |
| Express | 5.2.1 | Web Framework |
| SQLite | 3.x | Database |
| better-sqlite3 | 12.6.2 | SQLite Driver |
| marked | 17.0.2 | Markdown Parser |
| DOMPurify | 3.3.1 | XSS Protection |
| jsdom | 28.1.0 | DOM Simulation |
| nanoid | 5.1.6 | ID Generator |

## 🎨 Design Philosophy

### Responsive Layout
- Desktop: Split layout (editor + preview)
- Mobile: Single layout with touch gestures

### Theme System
- CSS variables for color management
- localStorage persists theme preference
- One-click light/dark mode toggle

### Performance Optimization
- Static file caching
- Code splitting
- Lazy loading

## 📱 Mobile Features

### Touch Gestures
- **Double-tap preview area** - Zoom in/out font size
- **Touch targets** - Minimum 44px, follows Apple guidelines

### Responsive Typography
- Desktop: Base font 16px
- Mobile: Base font 14px
- Code blocks: 12px

### Social Sharing
- WeChat: Copy link to clipboard
- QQ: QQ share component
- Weibo: Weibo share API
- Twitter: Twitter share API

## 🔐 Security

### XSS Protection
Sanitize all HTML with DOMPurify:

```javascript
const clean = DOMPurify.sanitize(raw);
```

### Input Validation
- Check if content is empty
- Limit content size (max 1MB)
- Validate ID format (10 characters)

## 📊 Performance

### Load Times
- First load: < 500ms
- Real-time preview: < 50ms
- Share generation: < 100ms

### Resource Usage
- Memory: ~60 MB (Node.js)
- CPU: < 1% (idle)
- Disk: < 10 MB (database + files)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use 2 spaces for indentation
- Follow ESLint configuration
- Use Conventional Commits for commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Self-Hosting Configuration

When self-hosting ShareMDC, you may want to customize the following:

### SEO and Social Sharing

The default HTML files include placeholder URLs (`sharemdc.com`) for Open Graph and Twitter meta tags. For production self-hosting, you should:

1. Update `public/index.html` and `public/share.html`
2. Replace `sharemdc.com` with your own domain
3. Update the og:image and twitter:image URLs if hosting your own preview images

Example meta tag to update:
```html
<meta property="og:url" content="https://your-domain.com/" />
<meta property="og:image" content="https://your-domain.com/og-image.png" />
```

### Analytics

ShareMDC supports Microsoft Clarity analytics (optional). To enable:

1. Create a project at [clarity.microsoft.com](https://clarity.microsoft.com)
2. Set the `CLARITY_ID` environment variable with your project ID
3. If not set, Clarity will be completely disabled

```bash
export CLARITY_ID=your_clarity_project_id
npm start
```

## 👨‍💻 Author

**perry2008084**

- GitHub: [perry2008084](https://github.com/perry2008084)

## 🙏 Acknowledgments

- [Express](https://expressjs.com/) - Web Framework
- [marked](https://marked.js.org/) - Markdown Parser
- [DOMPurify](https://github.com/cure53/DOMPurify) - XSS Protection
- [nanoid](https://github.com/ai/nanoid) - ID Generator

## 📧 Troubleshooting

### Database Errors
If you encounter SQLite errors:

```bash
# Check database file permissions
ls -la data/

# Fix permissions
chmod 600 data/share.db
chmod 700 data/
```

### Port Already in Use
```bash
# Find process using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### PM2 Startup Issues
```bash
# Reset PM2
pm2 delete all
pm2 start server.js --name sharemdc
```

## 📞 Support

For questions or suggestions, please:

- Submit an [Issue](https://github.com/perry2008084/sharemdc/issues)

---

⭐ If this project helps you, please give it a Star!
