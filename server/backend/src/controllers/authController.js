// backend/src/controllers/authController.js
const authService = require('../services/authService');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    console.log('Email is : ', email, 'Password is : ', password);  // <-- fixed typo here
    const user = await authService.login(email, password);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
