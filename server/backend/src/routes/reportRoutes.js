const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/', reportController.generateReport);
router.get('/top-performers', reportController.topPerformers);
router.get('/export', reportController.exportReportExcel);
router.get('/student', reportController.generateStudentReport);
router.get('/student/export', reportController.exportStudentReportExcel);

module.exports = router;
