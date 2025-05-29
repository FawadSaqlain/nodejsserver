const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
// const upload = require('../middlewares/upload');  // <-- Add this line
const { uploadMiddleware, handleUpload } = require('../controllers/studentController');


router.get('/', studentController.list);
router.post('/', studentController.create);
router.delete('/:id', studentController.remove);
router.put('/:id/password', studentController.resetPassword);
router.put('/:id', studentController.edit); // Full update: name/email/password

// router.post('/upload', upload.single('file'), studentController.handleUpload);
router.post('/upload', uploadMiddleware, handleUpload);

module.exports = router;
