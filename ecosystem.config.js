module.exports = {
  apps: [{
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
  }]
};
