// src/middlewares/upload.js
const multer = require('multer');

const storage = multer.memoryStorage(); // store in memory (buffer)
const upload = multer({ storage });

module.exports = upload;
