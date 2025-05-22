// src/middlewares/authMiddleware.js
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });
  // Verify token if needed
  next();
}

module.exports = authMiddleware;
