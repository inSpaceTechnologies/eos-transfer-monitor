module.exports = {
  apps: [
    {
      name: 'eos-transfer-monitor',
      script: 'index.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
