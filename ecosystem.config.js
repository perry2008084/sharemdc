module.exports = {
  apps: [{
    name: 'markdown-share',
    script: './server.js',
    cwd: '/root/project/markdown-share',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      CLARITY_ID: 'vlrng2aakn'
    }
  }]
};
