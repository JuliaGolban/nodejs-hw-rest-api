const multer = require('multer');
const { BadRequest } = require('http-errors');
const path = require('path');
const uploadDir = path.join(__dirname, '../tmp');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true);
    } else {
      cb(BadRequest('Wrong format'));
    }
  },
  limits: {
    fieldNameSize: 50,
    fileSize: 2048000,
  },
});

module.exports = { upload };
