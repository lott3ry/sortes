// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'xbit-fronentend-app',
      script: 'serve -s build-app -p 3000',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
