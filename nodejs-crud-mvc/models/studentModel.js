// Dữ liệu mẫu - sử dụng mảng (List) để lưu trữ
let students = [
  { id: 1, name: 'Nguyễn Văn A', age: 20, major: 'Công nghệ thông tin' },
  { id: 2, name: 'Trần Thị B', age: 21, major: 'Kế toán' },
  { id: 3, name: 'Lê Văn C', age: 19, major: 'Quản trị kinh doanh' }
];

let nextId = 4;

class StudentModel {
  // Lấy tất cả sinh viên
  static getAll() {
    return students;
  }

  // Lấy sinh viên theo ID
  static getById(id) {
    return students.find(student => student.id === parseInt(id));
  }

  // Tạo sinh viên mới
  static create(studentData) {
    const newStudent = {
      id: nextId++,
      name: studentData.name,
      age: parseInt(studentData.age),
      major: studentData.major
    };
    students.push(newStudent);
    return newStudent;
  }

  // Cập nhật sinh viên
  static update(id, studentData) {
    const index = students.findIndex(student => student.id === parseInt(id));
    if (index !== -1) {
      students[index] = {
        id: parseInt(id),
        name: studentData.name,
        age: parseInt(studentData.age),
        major: studentData.major
      };
      return students[index];
    }
    return null;
  }

  // Xóa sinh viên
  static delete(id) {
    const index = students.findIndex(student => student.id === parseInt(id));
    if (index !== -1) {
      const deletedStudent = students.splice(index, 1)[0];
      return deletedStudent;
    }
    return null;
  }
}

module.exports = StudentModel;
