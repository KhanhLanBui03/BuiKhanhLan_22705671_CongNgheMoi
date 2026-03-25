# 🛒 Product Management App

Node.js + Express + EJS + **AWS DynamoDB** — Mô hình MVC

---

## 📁 Cấu trúc dự án (MVC)

```
product-app/
├── app.js                     # Entry point
├── .env                       # ⚠️ AWS credentials (KHÔNG commit lên Git)
├── .env.example               # Template credentials
├── .gitignore
├── package.json
├── config/
│   └── db.js                  # Kết nối AWS DynamoDB & khởi tạo bảng
├── models/
│   └── Product.js             # Model: CRUD với DynamoDB
├── controllers/
│   └── ProductController.js   # Controller: xử lý logic
├── routes/
│   └── products.js            # Routes + Multer upload
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── products/
│   │   ├── index.ejs          # Danh sách sản phẩm
│   │   ├── create.ejs         # Thêm sản phẩm
│   │   ├── edit.ejs           # Sửa sản phẩm
│   │   └── show.ejs           # Chi tiết sản phẩm
│   └── 404.ejs
└── public/
    └── uploads/               # Ảnh upload được lưu ở đây
```

---

## 🔑 Bước 1: Lấy AWS Credentials

### Cách lấy Access Key từ AWS Console:
1. Đăng nhập **https://console.aws.amazon.com**
2. Góc trên phải → tên tài khoản → **Security credentials**
3. Mục **Access keys** → **Create access key**
4. Chọn **Command Line Interface (CLI)** → tạo key
5. Copy **Access key ID** và **Secret access key**

> ⚠️ **Lưu ý**: Nếu dùng AWS Academy / Learner Lab → vào **AWS Details** → copy `aws_access_key_id`, `aws_secret_access_key`, `aws_session_token`

---

## ⚙️ Bước 2: Cấu hình file `.env`

```env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=abc123...
AWS_SESSION_TOKEN=           # Chỉ dùng nếu là Learner Lab
AWS_REGION=ap-southeast-1   # Singapore - gần Việt Nam nhất
PORT=3000
```

---

## 🚀 Bước 3: Cài đặt & chạy

```bash
# Cài dependencies
npm install

# Chạy ứng dụng
npm start

# Hoặc development mode (auto reload)
npm run dev
```

Truy cập: **http://localhost:3000**

> App sẽ tự động tạo bảng `Products` trên AWS DynamoDB nếu chưa tồn tại.

---

## 🗄️ Cấu trúc bảng DynamoDB

| Thuộc tính     | Kiểu   | Mô tả                        |
|----------------|--------|------------------------------|
| `id`           | String | Partition Key (UUID tự động) |
| `name`         | String | Tên sản phẩm                 |
| `price`        | Number | Giá sản phẩm (VND)           |
| `unit_in_stock`| Number | Số lượng tồn kho             |
| `url_image`    | String | Đường dẫn ảnh `/uploads/...` |

---

## ✅ Chức năng

| #  | Chức năng                                | Điểm  |
|----|------------------------------------------|-------|
| 1  | Kết nối AWS DynamoDB thành công          | 1.0   |
| 2  | Tổ chức MVC đúng chuẩn                  | 1.0   |
| 3  | Hiển thị danh sách sản phẩm (table+ảnh) | 1.5   |
| 4  | Thêm sản phẩm + upload ảnh              | 1.5   |
| 5  | Sửa sản phẩm + cập nhật ảnh             | 1.5   |
| 6  | Xóa sản phẩm + xóa file ảnh cũ         | 1.0   |
| 7  | Xem chi tiết sản phẩm                   | 0.5   |
| 8  | Giao diện đẹp, ổn định                  | 1.0   |
| +  | **Bonus**: Tìm kiếm, validate, thông báo, xóa ảnh cũ | +1.0 |

---

## ⚙️ Công nghệ sử dụng

- **Runtime**: Node.js
- **Framework**: Express.js
- **Template Engine**: EJS
- **Database**: **AWS DynamoDB** (cloud)
- **AWS SDK**: @aws-sdk/client-dynamodb v3
- **Config**: dotenv
- **Upload**: Multer
- **Override Method**: method-override (PUT/DELETE qua form)
- **ID Generation**: uuid v4
