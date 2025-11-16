const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://contact-manager-api-bc37.onrender.com',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/api': '/api', // remove base path
      },
    })
  );
};
