const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');

// Route hiển thị danh sách sinh viên
router.get('/', StudentController.index);

// Route hiển thị form tạo sinh viên mới
router.get('/students/create', StudentController.create);

// Route lưu sinh viên mới
router.post('/students', StudentController.store);

// Route hiển thị chi tiết sinh viên
router.get('/students/:id', StudentController.show);

// Route hiển thị form chỉnh sửa sinh viên
router.get('/students/:id/edit', StudentController.edit);

// Route cập nhật sinh viên
router.put('/students/:id', StudentController.update);

// Route xóa sinh viên
router.delete('/students/:id', StudentController.delete);

module.exports = router;
