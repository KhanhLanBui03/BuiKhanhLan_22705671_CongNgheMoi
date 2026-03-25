const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ProductController = require('../controllers/ProductController');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e6) + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase()) &&
              allowed.test(file.mimetype);
  ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, gif, webp)!'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Product routes
router.get('/', ProductController.index);
router.get('/products/create', ProductController.create);
router.post('/products', upload.single('image'), ProductController.store);
router.get('/products/:id', ProductController.show);
router.get('/products/:id/edit', ProductController.edit);
router.put('/products/:id', upload.single('image'), ProductController.update);
router.delete('/products/:id', ProductController.destroy);

module.exports = router;
