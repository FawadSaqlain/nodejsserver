// src/api/index.js
const app = require('../app');

module.exports = (req, res) => {
  // Let Vercel handle listen(), just pass in req & res
  app(req, res);
};
