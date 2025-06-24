
module.exports = {
  apps: [{
    name: 'assistext_frontend',
    script: 'server.js',
    instances: 2, // Run 2 instances for load balancing
    exec_mode: 'cluster',
    cwd: '/opt/assistext_frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/opt/assistext_frontend/logs/err.log',
    out_file: '/opt/assistext_frontend/logs/out.log',
    log_file: '/opt/assistext_frontend/logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};