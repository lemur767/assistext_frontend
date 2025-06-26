module.exports = {
  apps: [{
    name: 'assistext_frontend',
    script: 'server.js',
    cwd: '/opt/assistext_frontend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: '/var/log/assistext/frontend-combined.log',
    out_file: '/var/log/assistext/frontend-out.log',
    error_file: '/var/log/assistext/frontend-error.log',
    time: true,
    autorestart: true,
    max_restarts: 5,
    restart_delay: 1000,
    max_memory_restart: '500M'
  }]
};
