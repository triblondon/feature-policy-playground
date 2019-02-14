const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/slow-load', { target: 'http://localhost:3002/' }));
};
