require("dotenv").config();
const express = require("express");
const multer = require("multer");
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: multer.memoryStorage() });

// Views
app.set("view engine", "ejs");
app.set("views", "./views");

const PORT = process.env.PORT || 3000;
const ticketController = require("./controllers/ticket-controller");

// Routes
app.get("/", ticketController.renderTicket)
app.get("/tickets/:ticketId", ticketController.renderTicketById)          // chi tiết
app.get("/form", ticketController.renderForm)                 // form thêm mới
app.get("/form/:ticketId", ticketController.renderForm)                 // form sửa

app.post("/tickets", upload.single("imageUrl"), ticketController.handleUpsert)   // thêm mới
app.post("/tickets/:ticketId", upload.single("imageUrl"), ticketController.handleUpsert)   // cập nhật
app.post("/tickets/delete/:ticketId", ticketController.handleDelete)                              // xóa  ← fix: thêm /

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});