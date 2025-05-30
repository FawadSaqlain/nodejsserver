// backend\src\api\index.js
const server = require('../server');

// Export as Vercel function
module.exports = (req, res) => {
  server(req, res);
};
