const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/demos', { target: 'http://localhost:3002/' }));
};
