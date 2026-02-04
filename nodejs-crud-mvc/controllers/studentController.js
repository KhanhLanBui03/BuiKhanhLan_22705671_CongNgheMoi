const StudentModel = require('../models/studentModel');

class StudentController {
  // Hiển thị danh sách sinh viên
  static index(req, res) {
    const students = StudentModel.getAll();
    res.render('students/index', { students, title: 'Danh sách sinh viên' });
  }

  // Hiển thị form tạo sinh viên mới
  static create(req, res) {
    res.render('students/create', { title: 'Thêm sinh viên mới' });
  }

  // Lưu sinh viên mới
  static store(req, res) {
    const studentData = {
      name: req.body.name,
      age: req.body.age,
      major: req.body.major
    };
    StudentModel.create(studentData);
    res.redirect('/');
  }

  // Hiển thị chi tiết sinh viên
  static show(req, res) {
    const student = StudentModel.getById(req.params.id);
    if (student) {
      res.render('students/show', { student, title: 'Chi tiết sinh viên' });
    } else {
      res.status(404).send('Không tìm thấy sinh viên');
    }
  }

  // Hiển thị form chỉnh sửa sinh viên
  static edit(req, res) {
    const student = StudentModel.getById(req.params.id);
    if (student) {
      res.render('students/edit', { student, title: 'Chỉnh sửa sinh viên' });
    } else {
      res.status(404).send('Không tìm thấy sinh viên');
    }
  }

  // Cập nhật sinh viên
  static update(req, res) {
    const studentData = {
      name: req.body.name,
      age: req.body.age,
      major: req.body.major
    };
    const updatedStudent = StudentModel.update(req.params.id, studentData);
    if (updatedStudent) {
      res.redirect('/');
    } else {
      res.status(404).send('Không tìm thấy sinh viên');
    }
  }

  // Xóa sinh viên
  static delete(req, res) {
    const deletedStudent = StudentModel.delete(req.params.id);
    if (deletedStudent) {
      res.redirect('/');
    } else {
      res.status(404).send('Không tìm thấy sinh viên');
    }
  }
}

module.exports = StudentController;
