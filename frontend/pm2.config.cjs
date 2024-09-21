// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'xbit-fronentend-app',
      script: 'serve -s build-app -p 9000',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'xbit-fronentend-dev',
      script: 'serve -s build-dev -p 9100',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'xbit-frontend-home',
      script: 'serve -s build-home -p 9200',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
