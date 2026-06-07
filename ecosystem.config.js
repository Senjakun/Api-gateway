module.exports = {
  apps: [
    {
      name: 'nusaai-api',
      cwd: './apps/api',
      script: 'node',
      args: 'dist/server.js',
      env: {
        NODE_ENV: 'production',
      },
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '512M',
    },
    {
      name: 'nusaai-web',
      cwd: './apps/web',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
      },
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '512M',
    },
  ],
};
