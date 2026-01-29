const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${safeName}`);
  },
});

const allowedMimeTypes = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
};

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = allowedMimeTypes[file.mimetype];
  if (!allowedExts || !allowedExts.includes(ext)) {
    return cb(new Error('Invalid file type'));
  }
  return cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

function validateUploadSize(req, res, next) {
  if (!req.file) {
    return next();
  }

  const isImage = req.file.mimetype.startsWith('image/');
  const maxSize = isImage ? 5 * 1024 * 1024 : 10 * 1024 * 1024;

  if (req.file.size > maxSize) {
    return res.status(400).json({ error: 'File exceeds size limit' });
  }

  return next();
}

module.exports = {
  upload,
  validateUploadSize,
};
