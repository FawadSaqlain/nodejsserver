const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/student', authController.studentLogin);
router.post('/teacher', authController.teacherLogin);

module.exports = router;
