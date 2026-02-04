# Ứng dụng CRUD Node.js Express MVC

Ứng dụng quản lý sinh viên đơn giản sử dụng Node.js, Express, và EJS theo mô hình MVC.

## Cấu trúc dự án

```
nodejs-crud-mvc/
│
├── app.js                      # File chính của ứng dụng
├── package.json                # Quản lý dependencies
│
├── controllers/                # Controller Layer
│   └── studentController.js    # Xử lý logic nghiệp vụ
│
├── models/                     # Model Layer
│   └── studentModel.js         # Quản lý dữ liệu (sử dụng mảng/List)
│
├── routes/                     # Routes
│   └── studentRoutes.js        # Định nghĩa các route
│
├── views/                      # View Layer (EJS templates)
│   └── students/
│       ├── index.ejs           # Danh sách sinh viên
│       ├── create.ejs          # Form thêm sinh viên
│       ├── edit.ejs            # Form chỉnh sửa sinh viên
│       └── show.ejs            # Chi tiết sinh viên
│
└── public/                     # Static files
    └── css/
        └── style.css           # CSS styling
```

## Tính năng

✅ **CREATE** - Thêm sinh viên mới  
✅ **READ** - Xem danh sách và chi tiết sinh viên  
✅ **UPDATE** - Chỉnh sửa thông tin sinh viên  
✅ **DELETE** - Xóa sinh viên  

## Cài đặt

### Bước 1: Cài đặt dependencies

```bash
npm install
```

### Bước 2: Chạy ứng dụng

**Chế độ thường:**
```bash
npm start
```

**Chế độ development (tự động reload):**
```bash
npm run dev
```

### Bước 3: Truy cập ứng dụng

Mở trình duyệt và truy cập: `http://localhost:3000`

## Cách sử dụng

1. **Xem danh sách sinh viên**: Truy cập trang chủ `http://localhost:3000`
2. **Thêm sinh viên mới**: Click nút "Thêm sinh viên mới"
3. **Xem chi tiết**: Click nút "Xem" ở hàng sinh viên muốn xem
4. **Chỉnh sửa**: Click nút "Sửa" ở hàng sinh viên muốn chỉnh sửa
5. **Xóa**: Click nút "Xóa" ở hàng sinh viên muốn xóa

## Mô hình MVC

### Model (studentModel.js)
- Quản lý dữ liệu sinh viên trong mảng (List)
- Cung cấp các phương thức: getAll(), getById(), create(), update(), delete()

### View (EJS templates)
- `index.ejs`: Hiển thị danh sách sinh viên dạng bảng
- `create.ejs`: Form thêm sinh viên mới
- `edit.ejs`: Form chỉnh sửa sinh viên
- `show.ejs`: Hiển thị chi tiết sinh viên

### Controller (studentController.js)
- Xử lý logic nghiệp vụ
- Kết nối giữa Model và View
- Các phương thức: index(), create(), store(), show(), edit(), update(), delete()

## Routes

| Method | URL | Chức năng |
|--------|-----|-----------|
| GET | `/` | Hiển thị danh sách sinh viên |
| GET | `/students/create` | Hiển thị form thêm sinh viên |
| POST | `/students` | Lưu sinh viên mới |
| GET | `/students/:id` | Hiển thị chi tiết sinh viên |
| GET | `/students/:id/edit` | Hiển thị form chỉnh sửa |
| PUT | `/students/:id` | Cập nhật sinh viên |
| DELETE | `/students/:id` | Xóa sinh viên |

## Công nghệ sử dụng

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **EJS** - Template engine
- **body-parser** - Parse request body
- **method-override** - Hỗ trợ HTTP verbs (PUT, DELETE)

## Lưu ý

- Dữ liệu được lưu trong bộ nhớ (mảng), sẽ mất khi restart server
- Để lưu trữ lâu dài, cần tích hợp database (MongoDB, MySQL, PostgreSQL)

## Mở rộng

Bạn có thể mở rộng ứng dụng bằng cách:
- Tích hợp database
- Thêm validation dữ liệu
- Thêm phân trang
- Thêm tìm kiếm và lọc
- Thêm authentication/authorization
- Upload ảnh đại diện sinh viên
