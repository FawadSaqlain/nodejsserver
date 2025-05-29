// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Valid routes
router.post('/list', taskController.list); // This one uses role & userId from body
router.post('/', taskController.create);
router.put('/', taskController.update);

module.exports = router;
