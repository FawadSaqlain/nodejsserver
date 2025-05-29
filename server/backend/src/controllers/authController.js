// backend/src/controllers/authController.js
const authService = require('../services/authService');

async function studentLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await authService.loginStudent(email, password);

    if (!user) {
      return res.status(401).json({ auth: false });
    }

    return res.status(200).json({ auth: true, user });
  } catch (err) {
    next(err);
  }
}

async function teacherLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await authService.loginTeacher(email, password);

    if (!user) {
      return res.status(401).json({ auth: false });
    }

    return res.status(200).json({ auth: true, user });
  } catch (err) {
    next(err);
  }
}

module.exports = { studentLogin, teacherLogin };
