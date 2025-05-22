
// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.list);
router.post('/', taskController.create);
router.put('/', taskController.update);

module.exports = router;
