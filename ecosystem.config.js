/**
 * ecosystem.config.js – Configuración PM2
 * Gestiona el proceso Node.js del backend en producción
 */
module.exports = {
  apps: [
    {
      name: 'assessment-gtgroup',
      script: './backend/server.js',
      cwd: '/var/www/assessment-gtgroup',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      // Reinicio automático ante fallos
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      // Logs
      out_file: '/var/log/pm2/assessment-out.log',
      error_file: '/var/log/pm2/assessment-err.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    }
  ]
};
