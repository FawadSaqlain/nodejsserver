const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.list);
router.post('/', studentController.create);
router.delete('/:id', studentController.remove);
router.put('/:id/password', studentController.resetPassword);
router.put('/:id', studentController.edit); // Full update: name/email/password

module.exports = router;
